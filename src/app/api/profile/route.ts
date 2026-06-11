import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validators/profile";
import { resend, FROM_EMAIL } from "@/lib/resend/client";

/**
 * GET /api/profile
 * Fetch the current authenticated user's candidate profile.
 * Returns 401 if not authenticated, 404 if no profile exists.
 *
 * Requirements: 2.6, 2.7, 12.1
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("candidate_id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(profile, { status: 200 });
}

/**
 * PUT /api/profile
 * Validate and upsert the candidate profile, then set candidate as active.
 * Returns 401 if not authenticated, 400 if validation fails.
 *
 * Requirements: 2.6, 2.7, 12.1
 */
export async function PUT(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const validation = profileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { target_titles, skills, location, resume_url, designation, expected_salary } = validation.data;

  // Upsert profile (INSERT or UPDATE on conflict with candidate_id)
  const { data: profile, error: upsertError } = await supabase
    .from("candidate_profiles")
    .upsert(
      {
        candidate_id: user.id,
        target_titles,
        skills,
        location,
        designation: designation || "",
        expected_salary: expected_salary || "",
        resume_url: resume_url || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "candidate_id" }
    )
    .select()
    .single();

  if (upsertError) {
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }

  // Set candidate as active after saving profile
  const { error: updateError } = await supabase
    .from("candidates")
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to activate candidate" },
      { status: 500 }
    );
  }

  // Send profile confirmation email (fire and forget — don't block the response)
  resend.emails.send({
    from: FROM_EMAIL,
    to: user.email!,
    subject: "Your DecaJobs profile is ready!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #2563eb; margin: 0 0 16px;">DecaJobs</h2>
        <p style="color: #374151; font-size: 16px; line-height: 26px;">Hi${user.user_metadata?.full_name ? ` ${user.user_metadata.full_name}` : ''},</p>
        <p style="color: #374151; font-size: 16px; line-height: 26px;">Your profile has been updated successfully! Here's a summary:</p>
        <ul style="color: #374151; font-size: 14px; line-height: 24px;">
          <li><strong>Target Titles:</strong> ${target_titles.join(", ")}</li>
          <li><strong>Skills:</strong> ${skills.join(", ")}</li>
          <li><strong>Location:</strong> ${location}</li>
        </ul>
        <p style="color: #374151; font-size: 16px; line-height: 26px;">You're now active for daily job matching. We'll send your top 10 curated jobs every morning.</p>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">— The DecaJobs Team</p>
      </div>
    `,
  }).catch((err) => {
    console.error("[Profile] Failed to send confirmation email:", err);
  });

  return NextResponse.json(profile, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jobListingSchema } from "@/lib/validators/job";
import { checkJobPostRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Authenticate the user
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

  // Verify employer exists and is verified
  const { data: employer, error: employerError } = await supabase
    .from("employers")
    .select("id, is_verified")
    .eq("id", user.id)
    .single();

  if (employerError || !employer) {
    return NextResponse.json(
      { error: "Employer account not found" },
      { status: 403 }
    );
  }

  if (!employer.is_verified) {
    return NextResponse.json(
      { error: "Employer must be verified to post jobs" },
      { status: 403 }
    );
  }

  // Check rate limit: max 10 posts per 24 hours
  const rateLimit = await checkJobPostRateLimit(user.id, supabase);

  if (!rateLimit.allowed) {
    const now = new Date();
    const msUntilReset = rateLimit.resetAt!.getTime() - now.getTime();
    const minutesUntilReset = Math.ceil(msUntilReset / (60 * 1000));

    return NextResponse.json(
      {
        error: "Rate limit exceeded: You can post a maximum of 10 jobs within 24 hours.",
        resetAt: rateLimit.resetAt!.toISOString(),
        minutesUntilReset,
      },
      { status: 429 }
    );
  }

  // Parse and validate the request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const result = jobListingSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Calculate expires_at as 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Insert the job listing
  const { data: jobListing, error: insertError } = await supabase
    .from("job_listings")
    .insert({
      employer_id: user.id,
      title: result.data.title,
      description: result.data.description,
      location: result.data.location,
      application_link: result.data.application_link,
      is_active: true,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to create job listing" },
      { status: 500 }
    );
  }

  return NextResponse.json(jobListing, { status: 201 });
}

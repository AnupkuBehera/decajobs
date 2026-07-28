import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateResumeFromRaw } from "@/lib/gemini/client";

/**
 * POST /api/resume-builder
 *
 * Auth-required. Generates a structured resume JSON from raw candidate details
 * using Gemini AI, and optionally saves it to the `resumes` Supabase table.
 *
 * Body: { rawDetails: string, targetRole: string, title?: string, save?: boolean }
 * Returns: { success: true, data: ResumeContent, resumeId?: string }
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      rawDetails,
      targetRole,
      title = "My Resume",
      save = true,
    } = body as {
      rawDetails: string;
      targetRole: string;
      title?: string;
      save?: boolean;
    };

    if (!rawDetails || rawDetails.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide at least 50 characters of work history and skills." },
        { status: 400 }
      );
    }

    if (!targetRole || targetRole.trim().length < 2) {
      return NextResponse.json(
        { error: "Please specify a target job title." },
        { status: 400 }
      );
    }

    console.log(`[Resume Builder] Generating resume for "${targetRole}" | user=${user.id}`);

    const resumeContent = await generateResumeFromRaw(
      rawDetails.trim(),
      targetRole.trim()
    );

    let resumeId: string | undefined;

    if (save) {
      const { data: saved, error: saveError } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: title.trim() || "My Resume",
          template_id: "modern-clean",
          content: resumeContent,
        })
        .select("id")
        .single();

      if (saveError) {
        // Non-fatal — still return the generated content
        console.error("[Resume Builder] Save failed:", saveError.message);
      } else {
        resumeId = saved?.id;
      }
    }

    return NextResponse.json({
      success: true,
      data: resumeContent,
      resumeId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Resume Builder] Error:", message);

    const isRateLimited =
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("429") ||
      message.toLowerCase().includes("quota");

    return NextResponse.json(
      {
        error: isRateLimited
          ? "AI is currently busy. Please wait a moment and try again."
          : "Resume generation failed. Please try again.",
      },
      { status: isRateLimited ? 429 : 500 }
    );
  }
}

/**
 * GET /api/resume-builder
 *
 * Auth-required. Returns all saved resumes for the logged-in user,
 * ordered newest first.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("id, title, template_id, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Resume Builder] GET error:", error.message);
    return NextResponse.json({ error: "Failed to load resumes." }, { status: 500 });
  }

  return NextResponse.json({ resumes: resumes ?? [] });
}

/**
 * DELETE /api/resume-builder?id=<uuid>
 *
 * Auth-required. Deletes a saved resume owned by the user.
 * RLS ensures users can only delete their own records.
 */
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Resume ID is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[Resume Builder] DELETE error:", error.message);
    return NextResponse.json({ error: "Failed to delete resume." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

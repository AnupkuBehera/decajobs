import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/resume-builder/load?id=<uuid>
 *
 * Auth-required. Loads the full content of a saved resume by ID.
 * RLS ensures the user can only access their own resumes.
 */
export async function GET(request: Request) {
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

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("id, title, content, template_id, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: resume.id,
    title: resume.title,
    content: resume.content,
    templateId: resume.template_id,
    createdAt: resume.created_at,
  });
}

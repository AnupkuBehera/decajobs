import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("candidate_id", user.id)
    .order("applied_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { job_title, company, job_url, status, notes } = body;

  if (!job_title || !company) {
    return NextResponse.json({ error: "Job title and company are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("job_applications")
    .insert({
      candidate_id: user.id,
      job_title,
      company,
      job_url: job_url || null,
      status: status || "applied",
      notes: notes || "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, status, notes } = body;

  if (!id) return NextResponse.json({ error: "Application ID required" }, { status: 400 });

  const updateData: Record<string, string> = { updated_at: new Date().toISOString() };
  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;

  const { error } = await supabase
    .from("job_applications")
    .update(updateData)
    .eq("id", id)
    .eq("candidate_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", id)
    .eq("candidate_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

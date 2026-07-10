import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: applications, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("candidate_id", user.id)
    .order("applied_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { job_title, company, job_url, status, notes } = await request.json();

    if (!job_title || !company) {
      return NextResponse.json({ error: "Missing job title or company" }, { status: 400 });
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
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, job_title, company, job_url, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("job_applications")
      .update({
        job_title,
        company,
        job_url,
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("candidate_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", id)
      .eq("candidate_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

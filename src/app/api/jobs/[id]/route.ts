import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Partial schema for updating only allowed fields (description and application_link)
const jobUpdateSchema = z.object({
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be at most 5000 characters")
    .optional(),
  application_link: z
    .string()
    .url("Application link must be a valid URL")
    .optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  // Verify the job listing exists and belongs to this employer
  const { data: existingJob, error: fetchError } = await supabase
    .from("job_listings")
    .select("id, employer_id")
    .eq("id", id)
    .single();

  if (fetchError || !existingJob) {
    return NextResponse.json(
      { error: "Job listing not found" },
      { status: 404 }
    );
  }

  if (existingJob.employer_id !== user.id) {
    return NextResponse.json(
      { error: "Not authorized to update this job listing" },
      { status: 403 }
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

  const result = jobUpdateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Ensure at least one field is provided
  if (!result.data.description && !result.data.application_link) {
    return NextResponse.json(
      { error: "At least one field (description or application_link) must be provided" },
      { status: 400 }
    );
  }

  // Build the update object with only provided fields
  const updateData: Record<string, string> = {};
  if (result.data.description) {
    updateData.description = result.data.description;
  }
  if (result.data.application_link) {
    updateData.application_link = result.data.application_link;
  }

  // Update the job listing
  const { data: updatedJob, error: updateError } = await supabase
    .from("job_listings")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update job listing" },
      { status: 500 }
    );
  }

  return NextResponse.json(updatedJob);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  // Verify the job listing exists and belongs to this employer
  const { data: existingJob, error: fetchError } = await supabase
    .from("job_listings")
    .select("id, employer_id")
    .eq("id", id)
    .single();

  if (fetchError || !existingJob) {
    return NextResponse.json(
      { error: "Job listing not found" },
      { status: 404 }
    );
  }

  if (existingJob.employer_id !== user.id) {
    return NextResponse.json(
      { error: "Not authorized to deactivate this job listing" },
      { status: 403 }
    );
  }

  // Soft delete: set is_active to false
  const { data: deactivatedJob, error: updateError } = await supabase
    .from("job_listings")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to deactivate job listing" },
      { status: 500 }
    );
  }

  return NextResponse.json(deactivatedJob);
}

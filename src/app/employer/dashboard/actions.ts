"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ToggleJobStatusState {
  success: boolean;
  error?: string;
}

export async function toggleJobStatus(
  jobId: string,
  newStatus: boolean
): Promise<ToggleJobStatusState> {
  const supabase = await createClient();

  // Authenticate the user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify the job listing exists and belongs to this employer
  const { data: existingJob, error: fetchError } = await supabase
    .from("job_listings")
    .select("id, employer_id")
    .eq("id", jobId)
    .single();

  if (fetchError || !existingJob) {
    return { success: false, error: "Job listing not found" };
  }

  if (existingJob.employer_id !== user.id) {
    return { success: false, error: "Not authorized to update this job listing" };
  }

  // Update the is_active status
  const { error: updateError } = await supabase
    .from("job_listings")
    .update({ is_active: newStatus })
    .eq("id", jobId);

  if (updateError) {
    return { success: false, error: "Failed to update job status" };
  }

  revalidatePath("/employer/dashboard");
  return { success: true };
}

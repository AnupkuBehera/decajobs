import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditJobForm } from "./edit-job-form";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Authenticate the user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch the job listing
  const { data: job, error: fetchError } = await supabase
    .from("job_listings")
    .select("id, employer_id, title, description, location, application_link, is_active")
    .eq("id", id)
    .single();

  if (fetchError || !job) {
    redirect("/employer/dashboard");
  }

  // Verify ownership
  if (job.employer_id !== user.id) {
    redirect("/employer/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-0">
      <EditJobForm
        jobId={job.id}
        title={job.title}
        location={job.location}
        description={job.description}
        applicationLink={job.application_link}
      />
    </div>
  );
}

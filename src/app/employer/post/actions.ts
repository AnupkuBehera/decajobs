"use server";

export interface JobPostState {
  success: boolean;
  errors?: {
    title?: string;
    description?: string;
    location?: string;
    applicationLink?: string;
    general?: string;
  };
}

export async function createJobPosting(
  _prevState: JobPostState | null,
  formData: FormData
): Promise<JobPostState> {
  const title = (formData.get("title") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() ?? "";
  const location = (formData.get("location") as string)?.trim() ?? "";
  const applicationLink =
    (formData.get("applicationLink") as string)?.trim() ?? "";

  const errors: JobPostState["errors"] = {};

  // Validate title (5-100 characters)
  if (!title) {
    errors.title = "Job title is required.";
  } else if (title.length < 5) {
    errors.title = "Job title must be at least 5 characters.";
  } else if (title.length > 100) {
    errors.title = "Job title must be 100 characters or fewer.";
  }

  // Validate description (50-5000 characters)
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length < 50) {
    errors.description = "Description must be at least 50 characters.";
  } else if (description.length > 5000) {
    errors.description = "Description must be 5000 characters or fewer.";
  }

  // Validate location
  if (!location) {
    errors.location = "Location is required.";
  }

  // Validate application link (valid URL)
  if (!applicationLink) {
    errors.applicationLink = "Application link is required.";
  } else {
    try {
      const url = new URL(applicationLink);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.applicationLink =
          "Application link must be a valid HTTP or HTTPS URL.";
      }
    } catch {
      errors.applicationLink =
        "Application link must be a valid URL (e.g., https://example.com/apply).";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // TODO: In task 5.4, this will create the job listing via Supabase
  // For now, return success to indicate the form works correctly
  return { success: true };
}

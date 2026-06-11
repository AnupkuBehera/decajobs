"use server";

import { createClient } from "@/lib/supabase/server";
import { parseResume } from "@/lib/resume-parser";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365; // 1 year in seconds

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  parsedSkills?: string[];
  parsedTitles?: string[];
}

export async function uploadResume(formData: FormData): Promise<UploadResult> {
  const file = formData.get("resume") as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." };
  }

  // Server-side file type validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Unsupported file format. Please upload a PDF or DOCX file.",
    };
  }

  // Server-side file size validation
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "File is too large. Maximum size is 5MB.",
    };
  }

  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to upload a resume." };
  }

  // Build the storage path: {user_id}/{filename}
  const filePath = `${user.id}/${file.name}`;

  // Convert File to ArrayBuffer for upload
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Upload to Supabase Storage (upsert to allow replacing existing file)
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, fileBuffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("[Resume Upload] Storage error:", uploadError.message, uploadError);
    return {
      success: false,
      error: `Upload failed: ${uploadError.message}`,
    };
  }

  // Generate a signed URL for accessing the file
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("resumes")
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    return {
      success: false,
      error: "File uploaded but failed to generate access URL. Please try again.",
    };
  }

  // Update candidate_profiles.resume_url with the signed URL
  const { error: updateError } = await supabase
    .from("candidate_profiles")
    .update({ resume_url: signedUrlData.signedUrl })
    .eq("candidate_id", user.id);

  if (updateError) {
    // If no profile exists yet, try upserting
    const { error: upsertError } = await supabase
      .from("candidate_profiles")
      .upsert(
        {
          candidate_id: user.id,
          resume_url: signedUrlData.signedUrl,
          target_titles: [],
          skills: [],
          location: "",
        },
        { onConflict: "candidate_id" }
      );

    if (upsertError) {
      return {
        success: false,
        error: "Resume uploaded but failed to save the URL to your profile.",
      };
    }
  }

  // Parse the resume to extract skills and job titles
  let parsedSkills: string[] = [];
  let parsedTitles: string[] = [];
  try {
    const parsed = await parseResume(fileBuffer, file.type);
    parsedSkills = parsed.extractedSkills;
    parsedTitles = parsed.extractedTitles;
    console.log(
      `[Resume Parser] Found ${parsedSkills.length} skills, ${parsedTitles.length} titles`
    );
  } catch (parseErr) {
    console.error("[Resume Parser] Failed to parse resume:", parseErr);
    // Don't fail the upload if parsing fails — just skip suggestions
  }

  return {
    success: true,
    url: signedUrlData.signedUrl,
    parsedSkills,
    parsedTitles,
  };
}

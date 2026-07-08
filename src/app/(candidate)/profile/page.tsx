"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TagInput, Input, Button, Card, CardTitle } from "@/components/ui";
import { ResumeUpload } from "@/components/forms/resume-upload";
import { createClient } from "@/lib/supabase/client";
import { JOB_TITLE_SUGGESTIONS, SKILL_SUGGESTIONS, LOCATION_SUGGESTIONS } from "@/lib/suggestions";

interface FormErrors {
  targetTitles?: string;
  skills?: string;
  location?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [targetTitles, setTargetTitles] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [designation, setDesignation] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsFetching(false);
          return;
        }

        const { data: profile } = await supabase
          .from("candidate_profiles")
          .select("target_titles, skills, location, resume_url, designation, expected_salary")
          .eq("candidate_id", user.id)
          .single();

        if (profile) {
          setTargetTitles(profile.target_titles || []);
          setSkills(profile.skills || []);
          setLocation(profile.location || "");
          setDesignation(profile.designation || "");
          setExpectedSalary(profile.expected_salary || "");
          setResumeUrl(profile.resume_url || null);
        }
      } catch {
        // Profile doesn't exist yet, that's fine
      } finally {
        setIsFetching(false);
      }
    }

    fetchProfile();
  }, []);

  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (targetTitles.length === 0) {
      newErrors.targetTitles = "Please add at least one target job title.";
    }

    if (skills.length === 0) {
      newErrors.skills = "Please add at least one skill.";
    }

    if (!location.trim()) {
      newErrors.location = "Location is required.";
    }

    return newErrors;
  }, [targetTitles, skills, location]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_titles: targetTitles,
          skills,
          location: location.trim(),
          designation: designation.trim(),
          expected_salary: expectedSalary.trim(),
        } satisfies Record<string, unknown>),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({
            location: data.message || "Failed to save profile. Please try again.",
          });
        }
        return;
      }

      setSuccessMessage("Profile saved successfully! Redirecting to dashboard...");
      // Redirect to dashboard after a brief moment
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setErrors({
        location: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-neutral-500">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Set Up Your Profile
          </h1>
          <p className="mt-2 text-neutral-600">
            Tell us what you&apos;re looking for and we&apos;ll match you with 10
            perfect jobs every morning.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-label="Profile setup">
            {/* Live region for form-level error announcements */}
            <div aria-live="assertive" aria-atomic="true" className="sr-only">
              {Object.keys(errors).length > 0
                ? `Form has ${Object.keys(errors).length} error${Object.keys(errors).length > 1 ? "s" : ""}. Please correct the highlighted fields.`
                : ""}
            </div>
            <div>
              <CardTitle className="mb-4">Job Preferences</CardTitle>

              <div className="space-y-5">
                <TagInput
                  label="Target Job Titles"
                  tags={targetTitles}
                  onTagsChange={(newTags) => {
                    setTargetTitles(newTags);
                    if (newTags.length > 0 && errors.targetTitles) {
                      setErrors((prev) => ({ ...prev, targetTitles: undefined }));
                    }
                  }}
                  placeholder="e.g. Frontend Developer, React Engineer"
                  helperText="Start typing for suggestions, or press Enter to add custom titles."
                  error={errors.targetTitles}
                  suggestions={JOB_TITLE_SUGGESTIONS}
                />

                <TagInput
                  label="Skills"
                  tags={skills}
                  onTagsChange={(newTags) => {
                    setSkills(newTags);
                    if (newTags.length > 0 && errors.skills) {
                      setErrors((prev) => ({ ...prev, skills: undefined }));
                    }
                  }}
                  placeholder="e.g. React, TypeScript, Node.js"
                  helperText="Start typing for suggestions, or press Enter to add custom skills."
                  error={errors.skills}
                  suggestions={SKILL_SUGGESTIONS}
                />

                <div>
                  <Input
                    label="Location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (e.target.value.trim() && errors.location) {
                        setErrors((prev) => ({ ...prev, location: undefined }));
                      }
                    }}
                    placeholder='e.g. San Francisco, CA or "Remote"'
                    helperText='Enter your city/state, or type "Remote" if you only want remote positions.'
                    error={errors.location}
                    list="location-suggestions"
                  />
                  <datalist id="location-suggestions">
                    {LOCATION_SUGGESTIONS.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>

                <Input
                  label="Current Designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Data Analyst, Junior Developer"
                  helperText="Your current or most recent job title. Helps match seniority level."
                />

                <Input
                  label="Expected Salary (Annual)"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="e.g. $80,000 - $120,000 or ₹12L - ₹18L"
                  helperText="Your expected salary range. Jobs outside this range will be ranked lower."
                />

                <ResumeUpload
                  currentResumeUrl={resumeUrl}
                  onUploadComplete={(url) => setResumeUrl(url)}
                  onSkillsExtracted={(parsedSkills: string[], parsedTitles: string[]) => {
                    // Add extracted skills that aren't already in the list
                    if (parsedSkills.length > 0) {
                      setSkills((prev) => {
                        const existing = new Set(prev.map((s: string) => s.toLowerCase()));
                        const newSkills = parsedSkills.filter(
                          (s: string) => !existing.has(s.toLowerCase())
                        );
                        return [...prev, ...newSkills];
                      });
                    }
                    // Add extracted titles that aren't already in the list
                    if (parsedTitles.length > 0) {
                      setTargetTitles((prev) => {
                        const existing = new Set(prev.map((t: string) => t.toLowerCase()));
                        const newTitles = parsedTitles.filter(
                          (t: string) => !existing.has(t.toLowerCase())
                        );
                        return [...prev, ...newTitles];
                      });
                    }
                  }}
                />
              </div>
            </div>

            {successMessage && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200"
              >
                {successMessage}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full sm:w-auto"
                size="lg"
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

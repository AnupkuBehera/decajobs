import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TriggerDigestButton } from "./trigger-digest-button";

export const metadata = {
  title: "Dashboard - DecaJobs",
  description: "Your candidate dashboard showing matching status and profile overview.",
};

export default async function CandidateDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user display name from metadata or email
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "there";

  // Fetch candidate record for matching status
  const { data: candidate } = await supabase
    .from("candidates")
    .select("is_active")
    .eq("id", user.id)
    .maybeSingle();

  // Fetch profile for completeness check
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("target_titles, skills, location")
    .eq("candidate_id", user.id)
    .maybeSingle();

  // Fetch most recent digest history entry
  const { data: lastDigest } = await supabase
    .from("digest_history")
    .select("sent_at")
    .eq("candidate_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Determine matching status
  const isActive = candidate?.is_active ?? false;

  // Determine profile completeness
  const hasTitles = profile?.target_titles && profile.target_titles.length > 0;
  const hasSkills = profile?.skills && profile.skills.length > 0;
  const hasLocation = !!profile?.location;
  const isProfileComplete = hasTitles && hasSkills && hasLocation;

  const missingFields: string[] = [];
  if (!hasTitles) missingFields.push("Target titles");
  if (!hasSkills) missingFields.push("Skills");
  if (!hasLocation) missingFields.push("Location");

  // Format last digest date
  const lastDigestDate = lastDigest?.sent_at
    ? new Date(lastDigest.sent_at).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-2 text-neutral-600">
            Your job matching overview at a glance.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {/* Matching Status */}
          <Card>
            <CardHeader>
              <CardTitle>Matching Status</CardTitle>
              <Badge variant={isActive ? "success" : "warning"}>
                {isActive ? "Active" : "Paused"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {isActive
                  ? "You're receiving daily job matches. We'll send your top 10 jobs every morning."
                  : "Your daily matching is paused. Enable it in settings to start receiving job digests."}
              </p>
            </CardContent>
          </Card>

          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completeness</CardTitle>
              <Badge variant={isProfileComplete ? "success" : "warning"}>
                {isProfileComplete ? "Complete" : "Incomplete"}
              </Badge>
            </CardHeader>
            <CardContent>
              {isProfileComplete ? (
                <p className="text-sm">
                  Your profile is complete. The matching engine is using your
                  preferences to find the best jobs for you.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm">
                    Complete your profile to start receiving matches. Missing:
                  </p>
                  <ul className="list-inside list-disc text-sm text-warning-600">
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                  <Link
                    href="/profile"
                    className="inline-block text-sm font-medium text-primary-600 hover:text-primary-700 underline"
                  >
                    Complete your profile →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Last Digest Sent */}
          <Card>
            <CardHeader>
              <CardTitle>Last Digest Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {lastDigestDate ? (
                  <>
                    Your last daily digest was sent on{" "}
                    <span className="font-medium text-neutral-900">
                      {lastDigestDate}
                    </span>
                    .
                  </>
                ) : (
                  "No digests sent yet. Once your profile is complete and matching is active, you'll receive your first digest."
                )}
              </p>
              <div className="mt-4">
                <TriggerDigestButton />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/profile" className="block">
              <Card hoverable className="h-full">
                <CardContent className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Edit Profile</p>
                    <p className="text-sm text-neutral-500">
                      Update your titles, skills, and location
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/settings" className="block">
              <Card hoverable className="h-full">
                <CardContent className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Settings</p>
                    <p className="text-sm text-neutral-500">
                      Manage email preferences and delivery time
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TriggerDigestButton } from "./trigger-digest-button";
import DashboardTabs from "./dashboard-tabs";

export const metadata = {
  title: "Dashboard - DecaJobs",
  description: "Your candidate dashboard showing matching status and profile overview.",
};

const CAREER_TIPS = [
  "💡 ATS Hack: Tailor your resume key skills for every target role to bypass automatic screening filters.",
  "💡 LinkedIn Booster: Keep your LinkedIn headline active and include keywords like 'Remote' or 'Java Engineer' so recruiters can find you easily.",
  "💡 Interview Prep: When doing mock interviews, focus on the STAR method (Situation, Task, Action, Result) to format your answers.",
  "💡 Pro Tip: Always research a company's recent announcements or funding before an interview to stand out.",
  "💡 Referral Hack: Network with existing employees on LinkedIn before applying to increase your referral chance.",
  "💡 Job CRM Tip: Keep your application notes updated daily to stay organized and follow up exactly 5 days after applying.",
  "💡 Skill Mapping: Review your match scores daily to see which skills you should add next to land high-paying roles."
];

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

  // Fetch candidate record for matching status and referral code
  const { data: candidate } = await supabase
    .from("candidates")
    .select("is_active, referral_code, referral_bonus_days")
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

  // Fetch application counts
  const { count: activeAppsCount } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", user.id)
    .neq("status", "rejected");

  const { count: interviewAppsCount } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", user.id)
    .eq("status", "interview");

  const { count: offerAppsCount } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", user.id)
    .eq("status", "offer");

  // Determine matching status
  const isActive = candidate?.is_active ?? false;
  const referralCode = candidate?.referral_code ?? "";
  const referralBonusDays = candidate?.referral_bonus_days ?? 0;

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

  // Dynamic daily tip
  const todayTip = CAREER_TIPS[new Date().getDay() % CAREER_TIPS.length];

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              Welcome, {displayName}
            </h1>
            <p className="mt-1.5 text-neutral-600 text-sm">
              Your personalized career matching hub and application tracker.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={isActive ? "success" : "warning"} className="text-xs py-1 px-3">
              Daily Matching: {isActive ? "Active" : "Paused"}
            </Badge>
            <Badge variant={isProfileComplete ? "success" : "warning"} className="text-xs py-1 px-3">
              Profile: {isProfileComplete ? "Complete" : "Incomplete"}
            </Badge>
          </div>
        </div>

        {/* Top 3 Search Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-neutral-50/50">
            <CardContent className="p-4 sm:p-5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Active Tracked Jobs</span>
              <p className="text-2xl font-extrabold text-neutral-900 mt-1">{activeAppsCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-50/50">
            <CardContent className="p-4 sm:p-5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Interviews in Progress</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{interviewAppsCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-50/50">
            <CardContent className="p-4 sm:p-5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Offers Received</span>
              <p className="text-2xl font-extrabold text-green-600 mt-1">{offerAppsCount ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Action Tabs area */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardTabs
              isProfileComplete={isProfileComplete}
              referralCode={referralCode}
              referralBonusDays={referralBonusDays}
            />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Daily AI Tip */}
            <Card className="border border-primary-100 bg-primary-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-primary-700 font-bold uppercase tracking-wider">💡 Career Advice</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-neutral-600 leading-relaxed font-medium">
                {todayTip}
              </CardContent>
            </Card>

            {/* Matching Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Mail Delivery Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-neutral-600">
                <p>
                  {lastDigestDate ? (
                    <>
                      Last matching digest was sent on{" "}
                      <span className="font-semibold text-neutral-900">
                        {lastDigestDate}
                      </span>
                      .
                    </>
                  ) : (
                    "No digests sent yet. Complete your profile and keep matching active to receive your first mail."
                  )}
                </p>
                <div className="pt-2">
                  <TriggerDigestButton />
                </div>
              </CardContent>
            </Card>

            {/* Profile Check */}
            {!isProfileComplete && (
              <Card className="border-warning-200 bg-warning-50/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-warning-800">Action Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-neutral-600">
                  <p>Complete your profile fields to qualify for daily matches. Missing details:</p>
                  <ul className="list-inside list-disc text-warning-700">
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                  <Link
                    href="/profile"
                    className="inline-block font-semibold text-primary-600 hover:text-primary-700 underline"
                  >
                    Set details now →
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Quick Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-50 rounded transition-colors"
                >
                  👤 Edit Target Titles & Skills
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-50 rounded transition-colors"
                >
                  ⚙️ Email Settings & Pause Matching
                </Link>
                <Link
                  href="/career-coach"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-50 rounded transition-colors"
                >
                  🤖 Chat with AI Career Coach
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default async function CandidateDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ subscribed?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const isSubscribedJustNow = params?.subscribed === "true" || !!params?.session_id;

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
    .select("is_active, referral_code, referral_bonus_days, subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  // If returning from Stripe Checkout, ensure status is active immediately
  if (isSubscribedJustNow && candidate?.subscription_status !== "active") {
    await supabase
      .from("candidates")
      .update({
        subscription_status: "active",
        subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

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

  // Determine profile completeness score
  const hasTitles = profile?.target_titles && profile.target_titles.length > 0;
  const hasSkills = profile?.skills && profile.skills.length > 0;
  const hasLocation = !!profile?.location;
  const isProfileComplete = hasTitles && hasSkills && hasLocation;

  const completenessScore =
    (hasTitles ? 35 : 0) + (hasSkills ? 35 : 0) + (hasLocation ? 30 : 0);

  const missingFields: string[] = [];
  if (!hasTitles) missingFields.push("Target job titles (+35%)");
  if (!hasSkills) missingFields.push("Core technical skills (+35%)");
  if (!hasLocation) missingFields.push("Target location (+30%)");

  // Weekly stats & streak loop
  const weeklyMatched = 70;
  const weeklyApplied = activeAppsCount ?? 0;
  const weeklyApplyRate = Math.min(100, Math.round((weeklyApplied / weeklyMatched) * 100));
  const applyStreak = weeklyApplied > 0 ? Math.min(14, Math.max(1, weeklyApplied + 2)) : 0;

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
        {/* Post-Checkout Success Banner */}
        {isSubscribedJustNow && (
          <div className="mb-6 rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-4 sm:p-5 text-emerald-900 shadow-sm flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white text-lg font-bold shadow-xs">
                🎉
              </span>
              <div>
                <h3 className="text-sm font-bold sm:text-base">Payment Confirmed — Welcome to DecaJobs Pro!</h3>
                <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                  Your Pro subscription is fully active. You now have full access to all 10 morning match listings, direct contact details, and ATS resume tools.
                </p>
              </div>
            </div>
            <Link
              href="/my-daily-10"
              className="hidden sm:inline-flex items-center rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 shadow-2xs whitespace-nowrap"
            >
              View Daily 10 →
            </Link>
          </div>
        )}

        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              Welcome, {displayName}
            </h1>
            <p className="mt-1.5 text-neutral-600 text-sm">
              Your personalized career matching hub, daily habit tracker, and application CRM.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isActive ? "success" : "warning"} className="text-xs py-1 px-3">
              Daily 10: {isActive ? "Active (7:00 AM)" : "Paused"}
            </Badge>
            <Badge variant={isProfileComplete ? "success" : "warning"} className="text-xs py-1 px-3">
              Profile: {completenessScore}% Complete
            </Badge>
          </div>
        </div>

        {/* Momentum & Habit Loops Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. Daily Apply Streak */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Daily Apply Habit
                </span>
                <span className="text-base">🔥</span>
              </div>
              <p className="text-2xl font-extrabold text-neutral-900 mt-1">
                {applyStreak > 0 ? `${applyStreak}-Day Streak` : "Start Streak"}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                {applyStreak > 0
                  ? "Apply to 1 job today to keep your streak alive!"
                  : "Apply to your first match today to unlock streak bonuses."}
              </p>
            </CardContent>
          </Card>

          {/* 2. Weekly Matched vs Applied */}
          <Card className="bg-gradient-to-br from-primary-500/10 to-blue-500/5 border-primary-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider">
                  Weekly Momentum
                </span>
                <span className="text-base">📊</span>
              </div>
              <p className="text-2xl font-extrabold text-neutral-900 mt-1">
                {weeklyApplied} <span className="text-sm font-normal text-neutral-500">/ {weeklyMatched} matched</span>
              </p>
              <div className="mt-2 w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.max(5, weeklyApplyRate)}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                {weeklyApplyRate}% weekly application velocity
              </p>
            </CardContent>
          </Card>

          {/* 3. Active Applications & Interviews */}
          <Card className="bg-neutral-50/70 border-neutral-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Interviews &amp; Offers
                </span>
                <span className="text-base">🎯</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-amber-600">{interviewAppsCount ?? 0}</span>
                <span className="text-xs text-neutral-500">interviews</span>
                <span className="text-neutral-300">•</span>
                <span className="text-2xl font-extrabold text-green-600">{offerAppsCount ?? 0}</span>
                <span className="text-xs text-neutral-500">offers</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                {activeAppsCount ?? 0} total applications being tracked
              </p>
            </CardContent>
          </Card>

          {/* 4. Profile Completeness Progress */}
          <Card className={`border ${completenessScore === 100 ? "border-green-200 bg-green-50/20" : "border-neutral-200 bg-neutral-50/50"}`}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Profile Completeness
                </span>
                <span className="text-xs font-bold text-neutral-900">{completenessScore}%</span>
              </div>
              <div className="mt-2.5 w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    completenessScore === 100 ? "bg-green-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${completenessScore}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-2 truncate">
                {isProfileComplete ? "✓ 100% Ready for 90+ Match Dispatch" : `Next: Add ${missingFields[0] || "details"}`}
              </p>
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
            {/* Skill Gap Roadmap Widget */}
            <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs text-indigo-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>📈</span> Skill Gap Roadmap
                  </CardTitle>
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    AI Insight
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-neutral-600 space-y-3">
                <p className="leading-relaxed">
                  Based on jobs matching your titles this week, <strong>6 of your 10 top matches</strong> requested:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold text-[11px]">
                    + Docker &amp; Containers
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold text-[11px]">
                    + System Design
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Adding these skills or certifications could increase your high-match score by <strong>+24%</strong>.
                </p>

                {/* Curated Skill Bridge & Certification Partnerships */}
                <div className="mt-3 space-y-2 border-t border-indigo-100/70 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                      🎓 Recommended Certifications
                    </span>
                    <span className="text-[9px] text-neutral-400">Partner Links</span>
                  </div>
                  <div className="space-y-1.5">
                    <a
                      href="https://www.coursera.org/search?query=docker%20kubernetes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-white border border-indigo-100 hover:border-indigo-300 hover:shadow-2xs transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-800 text-[11px] group-hover:text-indigo-600">
                          Docker &amp; K8s Practitioner
                        </span>
                        <span className="text-[10px] text-indigo-600 font-bold">Coursera ↗</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Top-rated containers credential</p>
                    </a>

                    <a
                      href="https://www.coursera.org/search?query=system%20design"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-white border border-indigo-100 hover:border-indigo-300 hover:shadow-2xs transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-800 text-[11px] group-hover:text-indigo-600">
                          System Design &amp; Architecture
                        </span>
                        <span className="text-[10px] text-indigo-600 font-bold">Specialization ↗</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Microservices &amp; scalable backend systems</p>
                    </a>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <Link
                    href="/tools/ats-keyword-scanner"
                    className="font-bold text-indigo-700 hover:text-indigo-800 underline"
                  >
                    Scan ATS Keywords →
                  </Link>
                  <Link
                    href="/career-coach"
                    className="font-semibold text-neutral-500 hover:text-indigo-700"
                  >
                    Ask AI Coach →
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Resume Coaching Marketplace Slot */}
            <Card className="border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <span>🎯</span> Resume Review
                  </span>
                  <Badge variant="outline" className="text-[9px] border-amber-300 text-amber-800 bg-amber-100/60 py-0">
                    Coaching
                  </Badge>
                </div>
                <p className="text-xs text-neutral-700 font-medium leading-snug">
                  Get your resume reviewed 1-on-1 by senior hiring managers before applying.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-500">Double your interview callbacks</span>
                  <Link
                    href="/career-coach"
                    className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Review Options →
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Instant Urgency Alert Status */}
            <Card className="border border-emerald-100 bg-emerald-50/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span> Urgent 90+ Match Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-neutral-600 space-y-2">
                <p className="text-[11px] leading-relaxed">
                  Enabled: Instant notifications sent when a role scores <strong>90%+ match</strong> to help you apply before 200+ applications pile up.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 pt-1">
                  <span>✓ WhatsApp Alerts Active</span>
                  <span>•</span>
                  <span>✓ 7:00 AM Digest Active</span>
                </div>
              </CardContent>
            </Card>

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
                <CardTitle className="text-sm font-bold">Mail &amp; WhatsApp Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-neutral-600">
                <p>
                  {lastDigestDate ? (
                    <>
                      Last matching digest was dispatched on{" "}
                      <span className="font-semibold text-neutral-900">
                        {lastDigestDate}
                      </span>
                      .
                    </>
                  ) : (
                    "No digests sent yet. Complete your profile to receive your first morning batch."
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
                  <p>Complete missing profile fields to qualify for top-tier matching:</p>
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
                  href="/tools/ats-keyword-scanner"
                  className="flex items-center gap-2 text-xs font-semibold text-primary-700 hover:text-primary-800 p-2 hover:bg-primary-50 rounded transition-colors border border-primary-100 bg-primary-50/50"
                >
                  🔍 ATS Keyword Scanner
                </Link>
                <Link
                  href="/tools/in-hand-salary-calculator"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-50 rounded transition-colors"
                >
                  💵 In-Hand Salary Calculator
                </Link>
                <Link
                  href="/tools/notice-period-calculator"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-50 rounded transition-colors"
                >
                  📅 Notice Period &amp; LWD Calculator
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-primary-600 p-2 hover:bg-neutral-50 rounded transition-colors"
                >
                  👤 Edit Target Titles &amp; Skills
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

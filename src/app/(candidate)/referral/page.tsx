"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState("");
  const [bonusDays, setBonusDays] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReferralData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("candidates")
        .select("referral_code, referral_bonus_days")
        .eq("id", user.id)
        .single();

      if (data) {
        setReferralCode(data.referral_code || user.id.slice(0, 8));
        setBonusDays(data.referral_bonus_days || 0);
      }
      setIsLoading(false);
    }
    loadReferralData();
  }, []);

  const referralLink = `https://decajob.com/login?ref=${referralCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = `🚀 I found this AI tool that sends you 10 perfect job matches every morning — based on your skills & location.\n\nNo spam. Just 10 that actually fit you.\n\nTry it FREE 👉 ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function shareTwitter() {
    const text = `Tired of scrolling 1000s of jobs? This AI sends you exactly 10 perfect matches every morning. Try it free:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`, "_blank");
  }

  function shareLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, "_blank");
  }

  if (isLoading) return <div className="py-16 text-center text-neutral-500">Loading...</div>;

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Refer & Earn Free Days</h1>
          <p className="mt-2 text-neutral-600">
            Invite friends to DecaJobs. Get 7 free Pro days for every friend who signs up!
          </p>
        </div>

        {/* Stats */}
        <Card padding="lg" className="text-center mb-6">
          <p className="text-sm text-neutral-600">Your earned bonus days</p>
          <p className="text-4xl font-bold text-primary-600">{bonusDays}</p>
          <p className="text-xs text-neutral-500 mt-1">days of free Pro access earned</p>
        </Card>

        {/* Referral Link */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Your Referral Link</h2>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
            />
            <Button onClick={copyLink} variant="secondary" size="sm">
              {copied ? "Copied! ✓" : "Copy"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            When someone signs up using your link, you both get 7 extra free days of Pro access.
          </p>
        </Card>

        {/* Share buttons */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold mb-4">Share with friends</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors min-h-[44px]"
            >
              📱 WhatsApp
            </button>
            <button
              onClick={shareTwitter}
              className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors min-h-[44px]"
            >
              𝕏 Twitter
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-medium text-white hover:bg-blue-800 transition-colors min-h-[44px]"
            >
              💼 LinkedIn
            </button>
          </div>
        </Card>

        {/* How it works */}
        <div className="mt-8 text-center text-sm text-neutral-600">
          <h3 className="font-semibold text-neutral-900 mb-2">How it works</h3>
          <ol className="space-y-1 text-left max-w-md mx-auto">
            <li>1. Share your referral link with friends</li>
            <li>2. They sign up for DecaJobs using your link</li>
            <li>3. You both get 7 extra free days of Pro access</li>
            <li>4. No limit — invite as many friends as you want!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

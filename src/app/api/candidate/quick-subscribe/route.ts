import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { contact, channel = "email" } = await request.json();

    if (!contact || typeof contact !== "string") {
      return NextResponse.json(
        { error: "Contact (email or WhatsApp number) is required" },
        { status: 400 }
      );
    }

    const trimmedContact = contact.trim();
    let email = trimmedContact.toLowerCase();

    // If channel is whatsapp, format clean surrogate email for the candidates table
    if (channel === "whatsapp") {
      const numericOnly = trimmedContact.replace(/[^\d+]/g, "");
      if (numericOnly.length < 8) {
        return NextResponse.json(
          { error: "Please provide a valid WhatsApp number" },
          { status: 400 }
        );
      }
      email = `${numericOnly.replace("+", "")}@whatsapp.decajob.com`;
    } else {
      // Basic email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Please enter a valid email address" },
          { status: 400 }
        );
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.warn(
        "[Quick Subscribe] Missing Supabase credentials. Acknowledging lead gracefully."
      );
      return NextResponse.json({
        success: true,
        message: "Subscribed successfully (dry run)",
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Upsert candidate
    const { data: existingCandidate } = await supabase
      .from("candidates")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let candidateId = existingCandidate?.id;

    if (!candidateId) {
      const { data: inserted, error: insertErr } = await supabase
        .from("candidates")
        .insert({
          email,
          is_active: true,
          preferred_delivery_time: "07:00",
        })
        .select("id")
        .single();

      if (insertErr) {
        console.warn("[Quick Subscribe] Insert error:", insertErr.message);
      } else {
        candidateId = inserted?.id;
      }
    } else {
      await supabase
        .from("candidates")
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq("id", candidateId);
    }

    // Ensure candidate_profile exists
    if (candidateId) {
      const { data: existingProfile } = await supabase
        .from("candidate_profiles")
        .select("id")
        .eq("candidate_id", candidateId)
        .maybeSingle();

      if (!existingProfile) {
        await supabase.from("candidate_profiles").insert({
          candidate_id: candidateId,
          target_titles: ["Software Engineer", "Tech Specialist"],
          skills: ["Full Stack", "AI", "Cloud"],
          location: channel === "whatsapp" ? "India / Remote" : "Remote",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled in 7:00 AM Daily Job Digest!",
    });
  } catch (err: any) {
    console.error("[Quick Subscribe] Unhandled error:", err);
    return NextResponse.json(
      { error: "Failed to process alert subscription" },
      { status: 500 }
    );
  }
}

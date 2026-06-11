"use server";

import { createClient } from "@/lib/supabase/server";

export interface SettingsState {
  success: boolean;
  message: string;
}

export async function updateSettings(
  isActive: boolean,
  preferredDeliveryTime: string
): Promise<SettingsState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to update settings." };
  }

  // Validate delivery time
  const validTimes = ["07:00", "17:00"];
  if (!validTimes.includes(preferredDeliveryTime)) {
    return { success: false, message: "Invalid delivery time selected." };
  }

  const { error } = await supabase
    .from("candidates")
    .update({
      is_active: isActive,
      preferred_delivery_time: preferredDeliveryTime,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: "Failed to update settings. Please try again." };
  }

  return { success: true, message: "Settings saved successfully!" };
}

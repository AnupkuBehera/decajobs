import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tpnmxxwplvsbdypxhuys.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Please set SUPABASE_SERVICE_ROLE_KEY environment variable.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const adminEmail = process.argv[2] || "anup4503@gmail.com";
const newPassword = process.argv[3] || "DecaJobs@Admin2026!";

async function main() {
  console.log(`Setting admin password for: ${adminEmail}...`);
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  const user = usersData.users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase());
  if (!user) {
    console.error(`User with email ${adminEmail} not found!`);
    process.exit(1);
  }

  const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      password: newPassword,
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata || {}),
        role: "admin",
      },
    }
  );

  if (updateError) {
    console.error("Failed to update password:", updateError.message);
    process.exit(1);
  }

  console.log(`✅ Success! Password successfully set for ${adminEmail} (User ID: ${user.id}).`);
  console.log(`Password: ${newPassword}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

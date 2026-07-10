const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUser() {
  const email = 'jkraghunandan@gmail.com';
  console.log(`Checking candidate status for: ${email}`);

  // Fetch candidate
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('*')
    .eq('email', email)
    .single();

  if (candidateError) {
    console.error('Candidate fetch error:', candidateError.message);
  } else {
    console.log('Candidate record:', candidate);
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('candidate_id', candidate.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError.message);
    } else {
      console.log('Candidate profile record:', profile);
    }
  }
}

checkUser();

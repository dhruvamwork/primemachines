import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupAndLogin() {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    console.log("Signing up...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
    });

    if (signUpError) {
        console.error("Signup failed:", signUpError);
        return;
    }

    console.log("Signup success. Trying to log in immediately...");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
    });

    if (loginError) {
        console.error("Login failed:", loginError);
    } else {
        console.log("Login success! Email confirmation is OFF.");
    }
}

testSignupAndLogin();

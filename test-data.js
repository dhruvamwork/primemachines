import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data: machines } = await supabase.from('machines').select('*').limit(1);
    const { data: vendors } = await supabase.from('vendors').select('*').limit(1);

    console.log("MACHINE RAW:", JSON.stringify(machines, null, 2));
    console.log("VENDOR RAW:", JSON.stringify(vendors, null, 2));
}

checkData();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMachines() {
    console.log("Fetching machines directly...");
    const { data: machines, error: mError } = await supabase.from('machines').select('*');
    if (mError) console.error("Error fetching machines:", mError);
    console.log("Machines stored:", machines);

    console.log("\nFetching machines with vendor JOIN...");
    const { data: joined, error: jError } = await supabase.from('machines').select(`*, vendors(company_name)`);
    if (jError) console.error("Error fetching JOIN:", jError);
    console.log("Joined data:", joined);
}

checkMachines();

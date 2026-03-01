import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRelations() {
    // 1. Get the single vendor
    const { data: vendors } = await supabase.from('vendors').select('*').limit(1);
    if (!vendors || vendors.length === 0) return console.log("No vendors found");
    const vendorId = vendors[0].id;

    // 2. Get the machine
    const { data: machines } = await supabase.from('machines').select('*').limit(1);
    if (!machines || machines.length === 0) return console.log("No machines found");
    const machineId = machines[0].id;

    // 3. Update machine vendor_id
    const { error } = await supabase.from('machines').update({ vendor_id: vendorId }).eq('id', machineId);
    if (error) {
        console.error("Failed to update machine:", error);
    } else {
        console.log(`Updated machine ${machineId} to use vendor_id ${vendorId}`);
    }
}

fixRelations();

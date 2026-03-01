import React from "react";
import { Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";
import LeadRow from "./components/LeadRow";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching so dashboard is always fresh

export default async function AdminDashboard() {
    // 1. Fetch all Live Leads
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Customer Requirements</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Live management of incoming customer requests.</p>
                </div>
            </div>

            {/* Live Data Tables Section */}
            <div className="flex flex-col gap-8">

                {/* Leads Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 rounded-t-2xl">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                <Activity className="size-5 text-primary" />
                                Customer Requirements (Leads)
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Live feed of all customer equipment requests</p>
                        </div>
                    </div>
                    <div>
                        {/* Grid Header */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200 dark:border-slate-800">
                            <div className="col-span-2">Date</div>
                            <div className="col-span-3">Customer Details</div>
                            <div className="col-span-3">Requirement / Machine ID</div>
                            <div className="col-span-2">Location</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>
                        {/* Rows */}
                        <div>
                            {leads && leads.length > 0 ? (
                                leads.map((lead) => (
                                    <LeadRow key={lead.id} lead={lead} />
                                ))
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No live requirements received yet.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

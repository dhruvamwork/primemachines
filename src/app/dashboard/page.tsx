"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HardHat, LogOut, Plus, Package, Activity, AlertCircle, Trash2, MapPin, IndianRupee } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PartnerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [machines, setMachines] = useState<any[]>([]);
    const [vendorProfile, setVendorProfile] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);

                // Try to fetch vendor profile using email or phone to get the correct vendor ID
                const identifier = session.user.email || session.user.phone;
                let vendorIdToUse = session.user.id;

                if (identifier) {
                    const { data: vendorData } = await supabase
                        .from('vendors')
                        .select('*')
                        .or(`email.eq.${identifier},mobile_number.eq.${identifier}`)
                        .single();

                    if (vendorData) {
                        setVendorProfile(vendorData);
                        vendorIdToUse = vendorData.id;
                    }
                }

                // Fetch vendor's machines using the correct vendor table ID
                const { data: machineData } = await supabase
                    .from('machines')
                    .select('*')
                    .eq('vendor_id', vendorIdToUse)
                    .order('created_at', { ascending: false });

                if (machineData) setMachines(machineData);
            } else {
                window.location.href = "/vendor-login";
                return;
            }
            setLoading(false);
        };
        fetchData();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/vendor-login";
    };

    const handleDeleteMachine = async (machineId: string) => {
        if (!confirm("Are you sure you want to delete this machine?")) return;

        const { error } = await supabase
            .from('machines')
            .delete()
            .eq('id', machineId);

        if (!error) {
            setMachines(machines.filter(m => m.id !== machineId));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalMachines = machines.length;
    const availableMachines = machines.filter(m => m.status === 'available').length;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <HardHat className="text-primary h-8 w-8" />
                            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                PRIME CONSTRUCTION <span className="text-primary">PARTNER</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-500 hidden sm:block">
                                {user?.phone || user?.email}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Vendor Status Banner */}
                {vendorProfile && vendorProfile.status !== 'approved' && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-6">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        Your vendor application is currently <span className="uppercase">{vendorProfile.status || 'pending'}</span>. You can still upload machines, but they will be visible to customers only after approval.
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your fleet and track performance.</p>
                    </div>
                    <Link
                        href="/dashboard/upload"
                        className="bg-primary hover:bg-orange-600 text-white font-black py-3 px-6 rounded-xl flex items-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 uppercase tracking-widest text-sm"
                    >
                        <Plus className="h-5 w-5" />
                        Upload Vehicle
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Machines</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{totalMachines}</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-xl">
                            <Package className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Available</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{availableMachines}</p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-xl">
                            <Activity className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Account Status</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase">
                                {vendorProfile?.status || 'Pending'}
                            </p>
                        </div>
                        <div className={`p-4 rounded-xl ${vendorProfile?.status === 'approved' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                            <AlertCircle className={`h-8 w-8 ${vendorProfile?.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`} />
                        </div>
                    </div>
                </div>

                {/* Fleet Overview */}
                {machines.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-wide">Your Fleet</h3>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{totalMachines} {totalMachines === 1 ? 'Machine' : 'Machines'}</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {machines.map((machine) => (
                                <div key={machine.id} className="flex items-center gap-4 p-4 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                        <img
                                            src={machine.image || '/images/placeholder-machine.jpg'}
                                            alt={machine.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{machine.name}</h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">{machine.category}</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {machine.location}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <IndianRupee className="h-3 w-3" /> {machine.price}/hr
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${machine.status === 'available'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                            }`}>
                                            {machine.status || 'available'}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteMachine(machine.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete Machine"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 min-h-[400px]">
                        <Package className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">No fleet uploaded yet</h3>
                        <p className="text-slate-500 text-center max-w-sm mb-6">Start building your catalog to get equipment inquiries from verified customers.</p>
                        <Link
                            href="/dashboard/upload"
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-3 px-8 rounded-xl transition-transform active:scale-[0.98] uppercase tracking-widest text-sm"
                        >
                            Upload First Vehicle
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

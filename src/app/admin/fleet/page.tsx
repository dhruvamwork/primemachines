"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Search, MapPin, ShieldCheck, ChevronDown, ChevronUp, Building2, Phone, Mail, Calendar, Wrench, Hash, FileText, User, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminFleetMatchmaker() {
    const [machines, setMachines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Filter state
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "available">("all");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: machinesData } = await supabase
                .from('machines')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: vendorsData } = await supabase
                .from('vendors')
                .select('*');

            const vendorMap: Record<string, any> = {};
            if (vendorsData) {
                vendorsData.forEach(v => { vendorMap[v.id] = v; });
            }

            const combined = machinesData ? machinesData.map(m => ({
                ...m,
                vendors: vendorMap[m.vendor_id] || null
            })) : [];

            setMachines(combined);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Get unique categories from actual data
    const categories = useMemo(() => {
        const cats = new Set<string>();
        machines.forEach(m => { if (m.category) cats.add(m.category); });
        return Array.from(cats).sort();
    }, [machines]);

    // Live filtering
    const filteredMachines = useMemo(() => {
        return machines.filter(m => {
            // Category filter
            if (filterCategory !== "all" && m.category !== filterCategory) return false;
            // Location / pincode search
            if (filterLocation.trim()) {
                const q = filterLocation.toLowerCase();
                const loc = (m.location || '').toLowerCase();
                const name = (m.name || '').toLowerCase();
                const vendor = (m.vendors?.company_name || '').toLowerCase();
                if (!loc.includes(q) && !name.includes(q) && !vendor.includes(q)) return false;
            }
            // Status filter
            if (filterStatus === "available" && m.status !== "available") return false;
            return true;
        });
    }, [machines, filterCategory, filterLocation, filterStatus]);

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const hasActiveFilters = filterCategory !== "all" || filterLocation.trim() !== "" || filterStatus !== "all";

    const clearFilters = () => {
        setFilterCategory("all");
        setFilterLocation("");
        setFilterStatus("all");
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Fleet Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">All uploaded machines across vendors.</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Equipment Type</label>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 cursor-pointer"
                    >
                        <option value="all">All Types ({machines.length})</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Search</label>
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 text-slate-400 size-4" />
                        <input
                            value={filterLocation}
                            onChange={e => setFilterLocation(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
                            placeholder="Search by name, location, vendor..."
                            type="text"
                        />
                        {filterLocation && (
                            <button onClick={() => setFilterLocation("")} className="absolute right-3 text-slate-400 hover:text-slate-600">
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Status</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 h-12 border border-slate-200 dark:border-slate-700/50">
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`flex-1 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterStatus === "all" ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >All</button>
                        <button
                            onClick={() => setFilterStatus("available")}
                            className={`flex-1 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterStatus === "available" ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >Available</button>
                    </div>
                </div>
            </div>

            {/* Active filters badge */}
            {hasActiveFilters && (
                <div className="flex items-center gap-3 -mt-4">
                    <span className="text-xs font-bold text-slate-500">Showing {filteredMachines.length} of {machines.length} machines</span>
                    <button onClick={clearFilters} className="text-xs font-bold text-primary hover:text-orange-600 flex items-center gap-1 transition-colors">
                        <X className="size-3" /> Clear filters
                    </button>
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 w-8"></th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 min-w-[200px]">Machine</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Category</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">Vendor</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Location</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Daily ₹</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredMachines.length > 0 ? (
                                    filteredMachines.map((machine) => {
                                        let imgUrl = machine.image || "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=400&q=80";
                                        const vendorName = machine.vendors?.company_name || "Unknown Vendor";
                                        const isExpanded = expandedId === machine.id;
                                        const daily = machine.price_daily || machine.price_per_day || machine.price || 0;
                                        const location = machine.location || '-';

                                        return (
                                            <React.Fragment key={machine.id}>
                                                <tr
                                                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${isExpanded ? 'bg-primary/5 dark:bg-primary/5' : ''}`}
                                                    onClick={() => toggleExpand(machine.id)}
                                                >
                                                    <td className="px-4 py-4">
                                                        <button className="text-slate-400 hover:text-primary transition-colors">
                                                            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-12 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                                                                <img className="w-full h-full object-cover" src={imgUrl} alt={machine.name} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{machine.name}</p>
                                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{machine.brand || ''}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/20">{machine.category || 'Equipment'}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-sm">
                                                            <ShieldCheck className="size-4 text-primary shrink-0" />
                                                            {vendorName}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{location}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">₹{daily > 0 ? daily.toLocaleString('en-IN') : '--'}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${machine.status === 'available'
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                                            }`}>
                                                            <span className={`size-1.5 rounded-full ${machine.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                                            {machine.status || 'available'}
                                                        </span>
                                                    </td>
                                                </tr>

                                                {/* Expanded Details Row */}
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/80 dark:bg-slate-800/20">
                                                        <td colSpan={7} className="px-6 py-6">
                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                {/* Machine Details */}
                                                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
                                                                    <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                                                                        <Wrench className="size-4" /> Machine Details
                                                                    </h4>
                                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Brand</span>
                                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{machine.brand || '---'}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Vehicle No.</span>
                                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{machine.registration_plate || '---'}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mfg Year</span>
                                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{machine.mfg_year || '---'}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Quantity</span>
                                                                            <span className="font-black text-slate-800 dark:text-slate-200">{machine.quantity || 1}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Operator</span>
                                                                            <span className={`font-bold ${machine.operator_included !== false ? 'text-green-600' : 'text-slate-500'}`}>
                                                                                {machine.operator_included !== false ? '✓ Yes' : 'No'}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Location</span>
                                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{machine.location || '---'}</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Pricing Row */}
                                                                    <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                                                                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Hourly</span>
                                                                            <span className="font-black text-slate-800 dark:text-slate-200 text-sm">₹{machine.price_hourly || '--'}</span>
                                                                        </div>
                                                                        <div className="flex-1 bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
                                                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Daily</span>
                                                                            <span className="font-black text-primary text-sm">₹{daily > 0 ? daily.toLocaleString('en-IN') : '--'}</span>
                                                                        </div>
                                                                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Monthly</span>
                                                                            <span className="font-black text-slate-800 dark:text-slate-200 text-sm">₹{machine.price_monthly || '--'}</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Description */}
                                                                    {machine.description && (
                                                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</span>
                                                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{machine.description}</p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Vendor Details */}
                                                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
                                                                    <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                                                                        <User className="size-4" /> Vendor Details
                                                                    </h4>
                                                                    {machine.vendors ? (
                                                                        <div className="space-y-3">
                                                                            <div className="flex items-center gap-4">
                                                                                {machine.vendors.logo_url ? (
                                                                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-white">
                                                                                        <img src={machine.vendors.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                                                        <Building2 className="size-6 text-primary" />
                                                                                    </div>
                                                                                )}
                                                                                <div>
                                                                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{machine.vendors.company_name || '---'}</p>
                                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{machine.vendors.contact_name || machine.vendors.full_name || ''}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2 border-t border-slate-100 dark:border-slate-700">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Phone className="size-3.5 text-primary shrink-0" />
                                                                                    <span className="font-bold text-slate-700 dark:text-slate-300">{machine.vendors.mobile_number || machine.vendors.mobile || '---'}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Mail className="size-3.5 text-primary shrink-0" />
                                                                                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs truncate">{machine.vendors.email || '---'}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <MapPin className="size-3.5 text-primary shrink-0" />
                                                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Pincode: {machine.vendors.pincode || '---'}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="size-3.5 text-primary shrink-0" />
                                                                                    <span className="font-bold text-slate-700 dark:text-slate-300">GST: {machine.vendors.gst_number || '---'}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Calendar className="size-3.5 text-primary shrink-0" />
                                                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Yrs: {machine.vendors.years_in_business || '---'}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Hash className="size-3.5 text-primary shrink-0" />
                                                                                    <span className="font-bold text-slate-700 dark:text-slate-300">Fleet: {machine.vendors.fleet_size || '---'}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-sm text-slate-400 italic">No vendor linked to this machine.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <p className="text-slate-500 text-sm font-medium">
                                                {hasActiveFilters ? `No machines match your filters.` : 'No equipment found in the database.'}
                                            </p>
                                            {hasActiveFilters && (
                                                <button onClick={clearFilters} className="mt-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-orange-600 transition-colors">
                                                    Clear filters
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {hasActiveFilters
                            ? `Showing ${filteredMachines.length} of ${machines.length} machines`
                            : `Total: ${machines.length} machines`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}

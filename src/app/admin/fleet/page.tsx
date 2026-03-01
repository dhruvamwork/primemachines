"use client";
import React, { useEffect, useState } from "react";
import { Download, Plus, MapPin, Filter, ShieldCheck, Copy, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Building2, Map, Target, ArrowRight, Package, Phone, Mail, Calendar, Wrench, Hash, FileText, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminFleetMatchmaker() {
    const [machines, setMachines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

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

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Fleet Matchmaker</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Internal tool for connecting inventory to high-priority construction leads.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <Download className="size-5" />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20">
                        <Plus className="size-5" />
                        Add Equipment
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Equipment Type</label>
                    <div className="relative">
                        <select className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 cursor-pointer">
                            <option>All Equipment Types</option>
                            <option>Backhoe Loader</option>
                            <option>Excavator</option>
                            <option>Transit Mixer</option>
                            <option>Crane</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Pincode / Location</label>
                    <div className="relative flex items-center">
                        <MapPin className="absolute left-4 text-slate-400 size-5" />
                        <input className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="Filter by Pincode" type="text" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Status</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 h-12 border border-slate-200 dark:border-slate-700/50">
                        <button className="flex-1 rounded-lg bg-white dark:bg-slate-700 shadow-sm text-xs font-black text-primary uppercase tracking-widest">Active</button>
                        <button className="flex-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 uppercase tracking-widest transition-colors">All</button>
                    </div>
                </div>

                <div className="flex items-end">
                    <button className="w-full h-12 bg-slate-900 dark:bg-primary hover:bg-slate-800 dark:hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg">
                        <Filter className="size-5" />
                        Apply Filters
                    </button>
                </div>
            </div>

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
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">Equipment ID</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 min-w-[200px]">Title</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">Vendor</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Pincode</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Daily ₹</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {machines && machines.length > 0 ? (
                                    machines.map((machine) => {
                                        let imgUrl = machine.image || "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=400&q=80";
                                        const vendorName = machine.vendors?.company_name || "Unknown Vendor";
                                        const vendorPhone = machine.vendors?.mobile_number || machine.vendors?.mobile || "-";
                                        const shortId = machine.id.substring(0, 8);
                                        const isExpanded = expandedId === machine.id;
                                        const daily = machine.price_daily || machine.price_per_day || machine.price || 0;
                                        const pincode = machine.location_pincode || machine.location || '-';

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
                                                        <span className="font-mono text-[11px] font-black tracking-widest text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/20" title={machine.id}>
                                                            #{shortId}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-14 w-18 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                                                                <img className="w-full h-full object-cover" src={imgUrl} alt={machine.name} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{machine.name}</p>
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{machine.category || 'Equipment'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-sm">
                                                            <ShieldCheck className="size-4 text-primary shrink-0" />
                                                            {vendorName}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{pincode}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">₹{daily > 0 ? daily.toLocaleString('en-IN') : '--'}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            Live
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <button className="inline-flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/5 hover:bg-primary/10 border border-primary/10 px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95">
                                                            <Copy className="size-4" />
                                                            Copy
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* Expanded Details Row */}
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/80 dark:bg-slate-800/20">
                                                        <td colSpan={8} className="px-6 py-6">
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
                                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{machine.location || machine.location_pincode || '---'}</span>
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
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No equipment found in the database.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Showing {machines.length} items</p>
                    <div className="flex gap-2">
                        <button className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-900 shadow-sm">
                            <ChevronLeft className="size-5" />
                        </button>
                        <button className="size-8 rounded-lg bg-primary text-white shadow-md shadow-primary/20 flex items-center justify-center text-xs font-bold transition-transform hover:scale-105">1</button>
                        <button className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-900 shadow-sm">
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

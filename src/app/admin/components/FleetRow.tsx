"use client";
import React, { useState } from "react";
import { ShieldCheck, Copy, ChevronDown, ChevronUp, MapPin, Phone, Mail, Building2, Tag, Calendar, User, Wrench, IndianRupee, Hash, FileText } from "lucide-react";

interface FleetRowProps {
    machine: any;
}

export default function FleetRow({ machine }: FleetRowProps) {
    const [expanded, setExpanded] = useState(false);

    let imgUrl = machine.image || "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=400&q=80";
    const vendorName = machine.vendors?.company_name || "Unknown Vendor";
    const vendorPhone = machine.vendors?.mobile_number || machine.vendors?.mobile || "-";
    const vendorEmail = machine.vendors?.email || "-";
    const vendorPincode = machine.vendors?.pincode || "-";
    const shortId = machine.id.substring(0, 8);

    const hourly = machine.price_hourly || 0;
    const daily = machine.price_daily || machine.price_per_day || machine.price || 0;
    const monthly = machine.price_monthly || 0;

    return (
        <>
            <tr
                onClick={() => setExpanded(!expanded)}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
            >
                <td className="px-6 py-5">
                    <span className="font-mono text-[11px] font-black tracking-widest text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/20" title={machine.id}>
                        #{shortId}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                            <img className="w-full h-full object-cover" src={imgUrl} alt={machine.name} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{machine.name}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{machine.category || 'Equipment'}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-sm">
                            <ShieldCheck className="size-4 text-primary" />
                            {vendorName}
                        </div>
                        <span className="text-xs font-medium text-slate-500 ml-5">{vendorPhone}</span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{machine.location || '-'}</span>
                </td>
                <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20`}>
                        <span className={`size-1.5 rounded-full bg-emerald-500 animate-pulse`}></span>
                        Live
                    </span>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const details = `${machine.name} | ${machine.brand || '-'} | ${machine.registration_plate || '-'} | ₹${daily}/day | Vendor: ${vendorName} (${vendorPhone})`;
                                navigator.clipboard.writeText(details);
                            }}
                            className="inline-flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/5 hover:bg-primary/10 border border-primary/10 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                        >
                            <Copy className="size-4" />
                            Copy
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                            className="inline-flex items-center justify-center size-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary transition-all"
                        >
                            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Expandable Detail Panel */}
            {expanded && (
                <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                    <td colSpan={6} className="px-6 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Machine Details */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Wrench className="size-4" /> Machine Details
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <DetailItem icon={<Tag className="size-3.5" />} label="Brand" value={machine.brand || '---'} />
                                    <DetailItem icon={<Hash className="size-3.5" />} label="Vehicle No." value={machine.registration_plate || '---'} />
                                    <DetailItem icon={<Calendar className="size-3.5" />} label="Mfg Year (Life)" value={machine.mfg_year || '---'} />
                                    <DetailItem icon={<Hash className="size-3.5" />} label="Quantity" value={machine.quantity || 1} />
                                    <DetailItem icon={<User className="size-3.5" />} label="Operator" value={machine.operator_included !== false ? 'Yes ✅' : 'No'} />
                                    <DetailItem icon={<MapPin className="size-3.5" />} label="Location" value={machine.location || '---'} />
                                </div>

                                {/* Pricing Row */}
                                <div className="flex gap-3 mt-2">
                                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Hourly</p>
                                        <p className="text-sm font-black text-slate-800 dark:text-white">₹ {hourly > 0 ? hourly.toLocaleString('en-IN') : '--'}</p>
                                    </div>
                                    <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/30 p-3 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">Daily</p>
                                        <p className="text-sm font-black text-amber-900 dark:text-amber-300">₹ {daily > 0 ? daily.toLocaleString('en-IN') : '--'}</p>
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Monthly</p>
                                        <p className="text-sm font-black text-slate-800 dark:text-white">₹ {monthly > 0 ? monthly.toLocaleString('en-IN') : '--'}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                {machine.description && (
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><FileText className="size-3" /> Description</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{machine.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Vendor Details */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                    <Building2 className="size-4" /> Vendor Details
                                </h4>
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                                    {machine.vendors?.logo_url && (
                                        <div className="flex justify-center mb-2">
                                            <img src={machine.vendors.logo_url} alt="Vendor Logo" className="h-16 w-16 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white p-1" />
                                        </div>
                                    )}
                                    <DetailItem icon={<Building2 className="size-3.5" />} label="Company" value={vendorName} />
                                    <DetailItem icon={<User className="size-3.5" />} label="Contact Person" value={machine.vendors?.contact_name || machine.vendors?.full_name || '---'} />
                                    <DetailItem icon={<Phone className="size-3.5" />} label="Mobile" value={vendorPhone} />
                                    <DetailItem icon={<Mail className="size-3.5" />} label="Email" value={vendorEmail} />
                                    <DetailItem icon={<MapPin className="size-3.5" />} label="Pincode" value={vendorPincode} />
                                    <DetailItem icon={<Hash className="size-3.5" />} label="GST No." value={machine.vendors?.gst_number || '---'} />
                                    <DetailItem icon={<Calendar className="size-3.5" />} label="Years in Biz" value={machine.vendors?.years_in_business || '---'} />
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
    return (
        <div className="flex items-start gap-2">
            <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{String(value)}</p>
            </div>
        </div>
    );
}

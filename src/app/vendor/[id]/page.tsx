"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Phone, Mail, FileText, CheckSquare, MessageSquare, Package } from "lucide-react";

export default function VendorProfilePage() {
    const params = useParams();
    const vendorId = params.id as string;

    const [vendor, setVendor] = useState<any>(null);
    const [machines, setMachines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [formState, setFormState] = useState({ name: "", mobile: "", requirement: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!vendorId) return;
        const fetchData = async () => {
            setLoading(true);
            const { data: vData } = await supabase.from('vendors').select('*').eq('id', vendorId).single();
            if (vData) {
                setVendor(vData);
                const { data: mData } = await supabase.from('machines').select('*').eq('vendor_id', vendorId);
                if (mData) {
                    setMachines(mData);
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [vendorId]);

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const requirementText = `[Vendor Profile Lead] Inquiry for Vendor: ${vendor?.company_name || vendor?.full_name}\n\nClient Need: ${formState.requirement}`;

        const { error } = await supabase.from('leads').insert([{
            customer_name: formState.name,
            customer_phone: formState.mobile,
            location_pincode: vendor?.pincode || "000000",
            requirement_details: requirementText,
            status: 'new'
        }]);

        if (!error) {
            setSubmitted(true);
            setFormState({ name: "", mobile: "", requirement: "" });
        } else {
            alert("Failed to send inquiry. Please try again.");
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center font-display">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAB308]"></div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center font-display p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Vendor Not Found</h1>
                    <p className="text-slate-500">The profile you are looking for does not exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const companyName = vendor.company_name || "Unverified Partner";
    const gstNo = vendor.gst_number || "Pending Registration";

    // Group machines by category
    const groupedMachines = machines.reduce((acc: Record<string, any[]>, machine) => {
        const cat = machine.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(machine);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#EBEFF5] font-display text-slate-800 pb-20">
            {/* Header Banner Area */}
            <div className="relative h-[220px] sm:h-[280px] bg-slate-900 overflow-hidden shadow-lg">
                <img src="/images/login_bg.png" alt="Header Background" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>

                <div className="absolute top-0 left-0 w-full p-6 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center z-10 max-w-6xl mx-auto right-0 gap-6">
                    <div className="flex flex-col text-white max-w-xl">
                        <h1 className="text-[#FDE68A] font-black uppercase tracking-widest text-lg sm:text-2xl drop-shadow-md pb-1">PRIME CONSTRUCTION MACHINE</h1>
                        <p className="text-xs sm:text-sm font-bold tracking-widest drop-shadow-md text-white/80">CONSTRUCTION EQUIPMENT ON RENT</p>

                        <div className="mt-8 sm:mt-12 flex items-center">
                            <span className="text-2xl sm:text-5xl font-black uppercase italic drop-shadow-lg text-white">Vendor Profile</span>
                        </div>
                    </div>

                    <a
                        href={`https://wa.me/919057221351?text=Hi,%20I%20am%20interested%20in%20equipment%20from%20vendor%20${companyName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#25D366] hover:bg-[#1DA851] text-white px-5 py-2.5 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-green-900/20 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap mt-4 md:mt-0"
                    >
                        <MessageSquare className="w-5 h-5 fill-current" />
                        Book on WhatsApp
                    </a>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-16 relative z-20 space-y-8">

                {/* Company Information Card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                    <div className="bg-[#FBBF24] px-6 py-3 flex items-center gap-2 w-fit rounded-br-xl shadow-sm border-b-2 border-amber-500/50">
                        <FileText className="text-amber-900 w-5 h-5" />
                        <h2 className="text-amber-950 font-black text-sm sm:text-base uppercase tracking-widest">Company Information</h2>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-stretch justify-start">
                        {/* Image / Logo */}
                        <div className="w-full md:w-[280px] aspect-video sm:aspect-[4/3] shrink-0 bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 shadow-inner">
                            {(vendor.logo_url || vendor.profile_image) ? (
                                <img src={vendor.logo_url || vendor.profile_image} alt={companyName} className="w-full h-full object-contain bg-white p-3" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
                                    <Package className="w-12 h-12 mb-2 opacity-50" />
                                    <span className="text-xs font-bold uppercase tracking-widest">No Logo</span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="w-full flex-1 flex flex-col gap-4 text-sm sm:text-[15px] font-medium justify-center pb-2">
                            <div className="flex gap-4 items-center border-b border-slate-100 pb-3">
                                <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="flex w-full justify-between items-center gap-2">
                                    <span className="text-slate-600 font-bold min-w-[80px]">GST No:</span>
                                    <span className="text-slate-800 uppercase tracking-widest font-bold text-right">{gstNo}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center border-b border-slate-100 pb-3">
                                <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="flex w-full justify-between items-center gap-2">
                                    <span className="text-slate-600 font-bold min-w-[80px]">Mobile:</span>
                                    <span className="text-[#B45309] font-black tracking-widest text-right">{vendor.mobile_number || vendor.mobile || '+91 -'}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center border-b border-slate-100 pb-3">
                                <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="flex w-full justify-between items-center gap-2 shadow-sm relative">
                                    <span className="text-slate-600 font-bold min-w-[80px]">Email:</span>
                                    <span className="text-slate-800 truncate text-right">{vendor.email || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center border-b border-slate-100 pb-3">
                                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="flex w-full justify-between items-center gap-2">
                                    <span className="text-slate-600 font-bold min-w-[80px]">Location:</span>
                                    <span className="text-slate-800 capitalize text-right">{vendor.city ? vendor.city + ', ' + vendor.state : (vendor.pincode ? `Area Code ${vendor.pincode}` : 'Not Specified')}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="flex w-full justify-between items-center gap-2">
                                    <span className="text-slate-600 font-bold min-w-[80px]">Pincode:</span>
                                    <span className="text-slate-800 font-bold tracking-widest text-right">{vendor.pincode || '----'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                {/* Products Section (Grouped by Category) */}
                {Object.keys(groupedMachines).length > 0 ? (
                    (Object.entries(groupedMachines) as [string, any[]][]).map(([categoryName, categoryMachines], idx) => {
                        return (
                            <div key={categoryName} className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 relative pb-6 mb-8">

                                <div className="bg-[#FBBF24] px-6 py-3 w-fit rounded-br-xl shadow-sm border-b-2 border-amber-500/50 flex items-center gap-2">
                                    <h2 className="text-amber-950 font-black text-sm sm:text-base uppercase tracking-widest">Product {idx + 1}: {categoryName}</h2>
                                    <span className="bg-amber-950 text-[#FBBF24] text-xs px-2.5 py-1 rounded-full font-black tracking-widest ml-3">QTY: {categoryMachines.length}</span>
                                </div>

                                {/* Asset Sub-Table */}
                                <div className="p-6 sm:p-8 pt-6">
                                    <div className="overflow-x-auto rounded-xl border border-slate-200 hidden md:block shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-100 border-b-2 border-slate-200 text-[11px] uppercase tracking-widest text-slate-500">
                                                    <th className="p-4 font-black">Vehicle No.</th>
                                                    <th className="p-4 font-black">Brand</th>
                                                    <th className="p-4 font-black text-center">Qty</th>
                                                    <th className="p-4 font-black text-center">Mfg Year (Life)</th>
                                                    <th className="p-4 font-black text-right text-amber-600">Hour (₹)</th>
                                                    <th className="p-4 font-black text-right text-amber-600">Day (₹)</th>
                                                    <th className="p-4 font-black text-right text-amber-600">Month (₹)</th>
                                                    <th className="p-4 font-black text-center">Operator</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {categoryMachines.map((m: any) => {
                                                    const hourly = m.price_hourly || Math.round((m.price_daily || m.price_per_day || m.price || 0) / 8);
                                                    const daily = m.price_daily || m.price_per_day || m.price || 0;
                                                    const monthly = m.price_monthly || ((m.price_daily || m.price_per_day || m.price || 0) * 25);

                                                    return (
                                                        <>
                                                            <tr key={m.id} className="hover:bg-amber-50/30 transition-colors text-sm font-medium">
                                                                <td className="p-4 font-black text-slate-800 uppercase tracking-widest text-[13px]">{m.registration_plate || m.name}</td>
                                                                <td className="p-4 text-slate-600 uppercase font-bold text-[13px]">{m.brand || '---'}</td>
                                                                <td className="p-4 text-center text-slate-800 font-black">{m.quantity || 1}</td>
                                                                <td className="p-4 text-center text-slate-600 font-bold">{m.mfg_year || '---'}</td>
                                                                <td className="p-4 text-right font-black text-slate-800">{hourly > 0 ? hourly.toLocaleString('en-IN') : '--'}</td>
                                                                <td className="p-4 text-right font-black text-amber-900 bg-amber-50/50">{daily > 0 ? daily.toLocaleString('en-IN') : '--'}</td>
                                                                <td className="p-4 text-right font-black text-slate-800">{monthly > 0 ? monthly.toLocaleString('en-IN') : '--'}</td>
                                                                <td className="p-4 text-center">
                                                                    {m.operator_included !== false ? (
                                                                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest"><CheckSquare className="w-3 h-3" /> Yes</span>
                                                                    ) : (
                                                                        <span className="inline-flex text-slate-500 bg-slate-100 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">No</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            {m.description && (
                                                                <tr key={`${m.id}-desc`} className="bg-slate-50/50">
                                                                    <td colSpan={8} className="px-4 py-3 text-xs text-slate-500 border-b border-slate-100">
                                                                        <span className="font-bold text-slate-400 uppercase tracking-widest mr-2">Desc:</span>
                                                                        {m.description}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards View */}
                                    <div className="flex flex-col gap-4 md:hidden">
                                        {categoryMachines.map((m: any) => {
                                            const hourly = m.price_hourly || Math.round((m.price_daily || m.price_per_day || m.price || 0) / 8);
                                            const daily = m.price_daily || m.price_per_day || m.price || 0;
                                            const monthly = m.price_monthly || ((m.price_daily || m.price_per_day || m.price || 0) * 25);

                                            return (
                                                <div key={m.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 shadow-sm">
                                                    <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                                                        <div>
                                                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest mb-0.5">Vehicle No.</span>
                                                            <span className="font-black text-slate-800 uppercase tracking-widest text-[13px]">{m.registration_plate || m.name}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest mb-0.5">Brand</span>
                                                            <span className="font-bold text-slate-700 uppercase text-[13px]">{m.brand || '---'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div><span className="text-slate-500 font-medium">Qty:</span> <span className="font-black text-slate-800">{m.quantity || 1}</span></div>
                                                        <div className="text-right"><span className="text-slate-500 font-medium">Life (Year):</span> <span className="font-bold">{m.mfg_year || '---'}</span></div>
                                                        <div className="col-span-2 text-right border-t border-slate-100 pt-2 mt-1"><span className="text-slate-500 font-medium">Operator:</span> <span className="font-bold">{m.operator_included !== false ? 'Yes' : 'No'}</span></div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-center bg-white rounded-lg border border-slate-100 p-2.5 shadow-inner">
                                                        <div className="flex flex-col justify-center">
                                                            <span className="text-[9px] uppercase font-black text-slate-400 block pb-1 tracking-widest">Hour</span>
                                                            <span className="font-black text-slate-700 text-xs">₹ {hourly > 0 ? hourly.toLocaleString('en-IN') : '--'}</span>
                                                        </div>
                                                        <div className="border-x border-amber-200 px-1 bg-amber-50 rounded flex flex-col justify-center py-1">
                                                            <span className="text-[9px] uppercase font-black text-amber-600 block pb-1 tracking-widest">Day</span>
                                                            <span className="font-black text-amber-900 text-[13px]">₹ {daily > 0 ? daily.toLocaleString('en-IN') : '--'}</span>
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <span className="text-[9px] uppercase font-black text-slate-400 block pb-1 tracking-widest">Month</span>
                                                            <span className="font-black text-slate-700 text-xs">₹ {monthly > 0 ? monthly.toLocaleString('en-IN') : '--'}</span>
                                                        </div>
                                                    </div>
                                                    {m.description && (
                                                        <div className="pt-3 border-t border-slate-200">
                                                            <p className="text-xs text-slate-500 leading-relaxed"><span className="font-bold text-slate-400 uppercase tracking-widest mr-2">Desc:</span>{m.description}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 p-10 text-center">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Products Listed</h3>
                        <p className="text-slate-500 font-medium mt-2">This vendor has not published any equipment catalog yet.</p>
                    </div>
                )}

                {/* Inquiry Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 pb-16">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 relative">
                        <div className="bg-slate-100 text-slate-500 px-6 py-3 w-fit rounded-br-xl border-b-2 border-slate-200 flex items-center gap-2">
                            <h2 className="font-black text-sm sm:text-base uppercase tracking-widest">Product {machines.length + 1}: Coming Soon</h2>
                        </div>
                        <div className="p-8 text-center flex flex-col items-center justify-center h-[calc(100%-50px)] min-h-[150px]">
                            <span className="text-slate-400/80 font-bold uppercase tracking-widest text-sm">Details Coming Soon...</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                        <div className="bg-[#FBBF24] px-6 py-3 w-fit rounded-br-xl shadow-sm border-b-2 border-amber-500/50 flex items-center gap-2 mb-4">
                            <h2 className="text-amber-950 font-black text-sm sm:text-base uppercase tracking-widest">Inquiry Form</h2>
                        </div>
                        <div className="px-6 pb-6 pt-2">
                            {submitted ? (
                                <div className="bg-green-50 border border-green-200 p-8 rounded-xl text-center flex flex-col items-center justify-center h-full min-h-[220px]">
                                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <CheckSquare className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-black text-green-900 mb-2 uppercase tracking-wide">Inquiry Sent Successfully!</h4>
                                    <p className="text-sm text-green-700 font-medium mb-6">We have received your requirement. The broker team will contact you shortly.</p>
                                    <button onClick={() => setSubmitted(false)} className="px-4 py-2 border-2 border-green-600 text-xs font-bold uppercase tracking-widest text-green-700 hover:bg-green-600 hover:text-white rounded-lg transition-colors">Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your Name"
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3.5 text-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent outline-none transition-shadow placeholder:text-slate-400"
                                    />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Mobile Number"
                                        maxLength={10}
                                        value={formState.mobile}
                                        onChange={e => {
                                            if (!/^\d*$/.test(e.target.value)) return;
                                            setFormState({ ...formState, mobile: e.target.value })
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 p-3.5 text-slate-800 rounded-lg text-sm font-bold tracking-widest focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent outline-none transition-shadow placeholder:text-slate-400"
                                    />
                                    <textarea
                                        required
                                        placeholder="Your Requirement (e.g., specific dates, exact machine)"
                                        rows={2}
                                        value={formState.requirement}
                                        onChange={e => setFormState({ ...formState, requirement: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 p-3.5 text-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#FBBF24] focus:border-transparent outline-none transition-shadow resize-none h-[80px] placeholder:text-slate-400"
                                    ></textarea>

                                    <div className="flex justify-center pt-3">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="bg-[#FBBF24] hover:bg-[#F59E0B] text-amber-950 px-8 py-3.5 rounded-lg w-full font-black uppercase text-sm tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 border border-amber-400/50"
                                        >
                                            {submitting ? 'Sending Request...' : 'Submit Inquiry'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}

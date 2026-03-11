"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { HardHat, ArrowLeft, Save, CheckCircle2, X, ImagePlus, Plus, Hash, Clock, Wrench, IndianRupee, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface UnitDetail {
    registration_plate: string;
    mfg_year: string;
}

export default function UploadVehicle() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Machine info
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Excavators");
    const [brand, setBrand] = useState("");
    const [machineTime, setMachineTime] = useState("");
    const [serviceSpec, setServiceSpec] = useState("");
    const [rentBasis, setRentBasis] = useState("Hour / Day / Month");
    const [priceHourly, setPriceHourly] = useState("");
    const [priceDaily, setPriceDaily] = useState("");
    const [priceMonthly, setPriceMonthly] = useState("");
    const [operatorIncluded, setOperatorIncluded] = useState(true);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Per-unit details
    const [units, setUnits] = useState<UnitDetail[]>([{ registration_plate: '', mfg_year: '' }]);
    const quantity = units.length;

    const addUnit = () => {
        setUnits(prev => [...prev, { registration_plate: '', mfg_year: '' }]);
    };

    const removeUnit = (index: number) => {
        if (units.length <= 1) return;
        setUnits(prev => prev.filter((_, i) => i !== index));
    };

    const updateUnit = (index: number, field: keyof UnitDetail, value: string) => {
        setUnits(prev => prev.map((u, i) => i === index ? { ...u, [field]: value } : u));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5MB");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("You must be logged in to upload a vehicle.");
                router.push("/vendor-login");
                return;
            }

            const identifier = user.email || user.phone;
            const { data: vendorProfile } = await supabase
                .from('vendors')
                .select('id')
                .or(`email.eq.${identifier},mobile_number.eq.${identifier}`)
                .single();

            const vendorIdToUse = vendorProfile ? vendorProfile.id : user.id;

            let imageUrl = "/images/placeholder-machine.jpg";

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('machine-images')
                    .upload(fileName, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Storage upload error:", uploadError);
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('machine-images')
                        .getPublicUrl(uploadData.path);
                    imageUrl = publicUrl;
                }
            }

            // Insert one record per unit
            const records = units.map((unit) => ({
                name: name,
                category: category,
                brand: brand,
                registration_plate: unit.registration_plate,
                mfg_year: unit.mfg_year ? parseInt(unit.mfg_year) : null,
                price_hourly: parseInt(priceHourly) || 0,
                price_daily: parseInt(priceDaily) || 0,
                price_monthly: parseInt(priceMonthly) || 0,
                price: parseInt(priceDaily) || 0,
                operator_included: operatorIncluded,
                quantity: 1,
                description: `Machine Time: ${machineTime || 'N/A'} | Service: ${serviceSpec || 'N/A'} | Rent Basis: ${rentBasis} | ${description}`,
                location: pincode ? `${location} - ${pincode}` : location,
                image: imageUrl,
                vendor_id: vendorIdToUse,
                status: 'available'
            }));

            const { error: insertError } = await supabase
                .from('machines')
                .insert(records);

            if (insertError) {
                console.error("Insert error:", insertError);
                throw new Error("Failed to save machine listing. Please try again.");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "An error occurred while uploading. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center flex-col gap-4">
                <div className="bg-green-500/10 p-6 rounded-full">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {quantity > 1 ? `${quantity} Machines Uploaded!` : 'Machine Uploaded!'}
                </h2>
                <p className="text-slate-500">Redirecting to dashboard...</p>
            </div>
        );
    }

    const inputClass = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm";
    const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5";

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-14">
                        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                        </Link>
                        <span className="text-base sm:text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            PRIME <span className="text-primary">PARTNER</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Add Machine</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">List your equipment like a product card</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ═══════ SECTION 1: Machine Photo + Identity ═══════ */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        {/* Image Upload */}
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/jpeg,image/png,image/webp" className="hidden" />
                        {imagePreview ? (
                            <div className="relative">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 sm:h-56 object-cover" />
                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold uppercase tracking-widest">
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()} className="h-40 sm:h-48 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-200 dark:border-slate-800">
                                <ImagePlus className="h-8 w-8 text-slate-400 mb-2" />
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Tap to upload machine photo</p>
                                <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG or WebP (Max 5MB)</p>
                            </div>
                        )}

                        {/* Machine Name + Brand + Category */}
                        <div className="p-4 space-y-3">
                            <div>
                                <label className={labelClass}>Machine Name / Model *</label>
                                <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className={`${inputClass} font-bold`} placeholder="e.g. JCB 3DX Eco Super" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Brand *</label>
                                    <input required value={brand} onChange={(e) => setBrand(e.target.value)} type="text" className={inputClass} placeholder="e.g. JCB, CAT" />
                                </div>
                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select required value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                                        <option value="JCBs">JCBs</option>
                                        <option value="Excavators">Excavators</option>
                                        <option value="Cranes">Cranes</option>
                                        <option value="Loaders">Loaders</option>
                                        <option value="Bulldozers">Bulldozers</option>
                                        <option value="Dump Trucks">Dump Trucks / Dumpers</option>
                                        <option value="Compactors">Compactors</option>
                                        <option value="Concrete Equipment">Concrete Equipment</option>
                                        <option value="Generators">Generators</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════ SECTION 2: Specs Card (like the screenshot) ═══════ */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="bg-primary/5 dark:bg-primary/10 px-4 py-2.5 border-b border-primary/20">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Wrench className="h-3.5 w-3.5" /> Machine Specifications
                            </h3>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>
                                        <Clock className="h-3 w-3 inline mr-1" />Machine Time
                                    </label>
                                    <input value={machineTime} onChange={(e) => setMachineTime(e.target.value)} type="text" className={inputClass} placeholder="e.g. 8 Hours" />
                                </div>
                                <div>
                                    <label className={labelClass}>Rent Basis</label>
                                    <select value={rentBasis} onChange={(e) => setRentBasis(e.target.value)} className={inputClass}>
                                        <option value="Hour / Day / Month">Hour / Day / Month</option>
                                        <option value="Hourly">Hourly Only</option>
                                        <option value="Daily">Daily Only</option>
                                        <option value="Monthly">Monthly Only</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Service Specification *</label>
                                <input required value={serviceSpec} onChange={(e) => setServiceSpec(e.target.value)} type="text" className={inputClass} placeholder="e.g. Excavation, Foundation, Road Work" />
                            </div>

                            {/* Pricing Table — like the screenshot */}
                            <div>
                                <label className={`${labelClass} flex items-center gap-1`}>
                                    <IndianRupee className="h-3 w-3" /> Rental Pricing *
                                </label>
                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800">
                                        <div className="px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">Hour</div>
                                        <div className="px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">Day</div>
                                        <div className="px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Month</div>
                                    </div>
                                    {/* Table Body */}
                                    <div className="grid grid-cols-3">
                                        <div className="border-r border-slate-200 dark:border-slate-700">
                                            <input required value={priceHourly} onChange={(e) => setPriceHourly(e.target.value)} type="number" className="w-full text-center py-3 bg-transparent font-bold text-primary text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="₹ 800" min="0" />
                                        </div>
                                        <div className="border-r border-slate-200 dark:border-slate-700">
                                            <input required value={priceDaily} onChange={(e) => setPriceDaily(e.target.value)} type="number" className="w-full text-center py-3 bg-transparent font-bold text-primary text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="₹ 6,000" min="0" />
                                        </div>
                                        <div>
                                            <input required value={priceMonthly} onChange={(e) => setPriceMonthly(e.target.value)} type="number" className="w-full text-center py-3 bg-transparent font-bold text-primary text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="₹ 1,50,000" min="0" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════ SECTION 3: Charges, Location, Operator ═══════ */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Charges / Notes</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} placeholder="e.g. Available for excavation, foundation, and road construction work." />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className={labelClass}>
                                        <User className="h-3 w-3 inline mr-1" />Operator
                                    </label>
                                    <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                        <button type="button" onClick={() => setOperatorIncluded(true)} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${operatorIncluded ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                            ✅ Yes
                                        </button>
                                        <button type="button" onClick={() => setOperatorIncluded(false)} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider transition-colors border-l border-slate-200 dark:border-slate-700 ${!operatorIncluded ? 'bg-slate-700 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                            ❌ No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>
                                    <MapPin className="h-3 w-3 inline mr-1" />Location *
                                </label>
                                <input required value={location} onChange={(e) => setLocation(e.target.value)} type="text" className={inputClass} placeholder="e.g. Banswara, Rajasthan" />
                            </div>
                            <div>
                                <label className={labelClass}>Pincode *</label>
                                <input required value={pincode} onChange={(e) => { const val = e.target.value; if (val.length <= 6 && /^\d*$/.test(val)) setPincode(val); }} type="text" className={`${inputClass} font-bold`} placeholder="e.g. 327001" maxLength={6} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════ SECTION 4: Vehicle Units ═══════ */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Vehicle Details</h3>
                            <button type="button" onClick={addUnit} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-colors">
                                <Plus className="size-3" /> Add Unit
                            </button>
                        </div>

                        <div className="p-4 space-y-3">
                            {units.map((unit, index) => (
                                <div key={index} className="relative bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary text-white text-[10px] font-black">{index + 1}</span>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit {index + 1}</span>
                                        </div>
                                        {units.length > 1 && (
                                            <button type="button" onClick={() => removeUnit(index)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <X className="size-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Vehicle No. *</label>
                                            <input required value={unit.registration_plate} onChange={(e) => updateUnit(index, 'registration_plate', e.target.value)} type="text" className={`${inputClass} font-bold tracking-wider uppercase text-xs`} placeholder="MH-04-AB-1234" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Mfg Year *</label>
                                            <input required value={unit.mfg_year} onChange={(e) => updateUnit(index, 'mfg_year', e.target.value)} type="number" className={inputClass} placeholder="e.g. 2021" min="1990" max="2030" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {quantity > 1 && (
                            <div className="px-4 pb-3">
                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <Hash className="size-3" />
                                    {quantity} machines will be uploaded as separate entries.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg disabled:opacity-70 uppercase tracking-widest text-sm">
                        {submitting ? "Uploading..." : quantity > 1 ? `Save ${quantity} Machines` : "Save Listing"}
                        {!submitting && <Save className="h-5 w-5" />}
                    </button>
                </form>
            </main>
        </div>
    );
}

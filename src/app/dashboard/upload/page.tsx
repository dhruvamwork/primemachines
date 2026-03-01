"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HardHat, ArrowLeft, Upload, Save, CheckCircle2, X, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UploadVehicle() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Excavators");
    const [brand, setBrand] = useState("");
    const [registrationPlate, setRegistrationPlate] = useState("");
    const [mfgYear, setMfgYear] = useState("");
    const [priceHourly, setPriceHourly] = useState("");
    const [priceDaily, setPriceDaily] = useState("");
    const [priceMonthly, setPriceMonthly] = useState("");
    const [operatorIncluded, setOperatorIncluded] = useState(true);
    const [quantity, setQuantity] = useState("1");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
            // Get the current logged-in vendor
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("You must be logged in to upload a vehicle.");
                router.push("/vendor-login");
                return;
            }

            // Fetch the actual vendor profile to get the table ID instead of the Auth ID
            const identifier = user.email || user.phone;
            const { data: vendorProfile } = await supabase
                .from('vendors')
                .select('id')
                .or(`email.eq.${identifier},mobile_number.eq.${identifier}`)
                .single();

            const vendorIdToUse = vendorProfile ? vendorProfile.id : user.id;

            let imageUrl = "/images/placeholder-machine.jpg"; // Fallback

            // Upload image to Supabase Storage if one was selected
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
                    // Continue without image if storage fails (bucket might not exist yet)
                } else {
                    // Get the public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('machine-images')
                        .getPublicUrl(uploadData.path);
                    imageUrl = publicUrl;
                }
            }

            // Insert machine record into the database
            const { error: insertError } = await supabase
                .from('machines')
                .insert([{
                    name: name,
                    category: category,
                    brand: brand,
                    registration_plate: registrationPlate,
                    mfg_year: mfgYear ? parseInt(mfgYear) : null,
                    price_hourly: parseInt(priceHourly) || 0,
                    price_daily: parseInt(priceDaily) || 0,
                    price_monthly: parseInt(priceMonthly) || 0,
                    price: parseInt(priceDaily) || 0,
                    operator_included: operatorIncluded,
                    quantity: parseInt(quantity) || 1,
                    description: description,
                    location: location,
                    location_pincode: pincode,
                    image: imageUrl,
                    vendor_id: vendorIdToUse,
                    status: 'available'
                }]);

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
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Machine Uploaded!</h2>
                <p className="text-slate-500">Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                PRIME CONSTRUCTION <span className="text-primary">PARTNER</span>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Upload Machine</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Add a new equipment listing to the prime catalog.</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8">
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Equipment Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                            />
                            {imagePreview ? (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg shadow-lg text-xs font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors hover:border-primary"
                                >
                                    <ImagePlus className="h-10 w-10 text-slate-400 mb-4" />
                                    <p className="text-sm border-b border-slate-900 dark:border-white pb-1 font-bold">Click to upload image</p>
                                    <p className="text-xs text-slate-500 mt-2">JPEG, PNG or WebP (Max 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2 lg:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Machine Name / Model</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                placeholder="e.g. 3DX Eco Super"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                            >
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

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Brand</label>
                            <input
                                required
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                placeholder="e.g. ACE, CAT, JCB"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Vehicle No. (Reg Plate)</label>
                            <input
                                required
                                value={registrationPlate}
                                onChange={(e) => setRegistrationPlate(e.target.value)}
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold tracking-widest uppercase"
                                placeholder="e.g. MH-04-AB-1234"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mfg. Year (Life)</label>
                            <input
                                required
                                value={mfgYear}
                                onChange={(e) => setMfgYear(e.target.value)}
                                type="number"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                placeholder="e.g. 2021"
                                min="1990"
                                max="2030"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hourly Rent (₹)</label>
                            <input
                                required
                                value={priceHourly}
                                onChange={(e) => setPriceHourly(e.target.value)}
                                type="number"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold text-[#D97706]"
                                placeholder="e.g. 1500"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Daily Rent (₹)</label>
                            <input
                                required
                                value={priceDaily}
                                onChange={(e) => setPriceDaily(e.target.value)}
                                type="number"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold text-[#D97706]"
                                placeholder="e.g. 12000"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Monthly Rent (₹)</label>
                            <input
                                required
                                value={priceMonthly}
                                onChange={(e) => setPriceMonthly(e.target.value)}
                                type="number"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold text-[#D97706]"
                                placeholder="e.g. 300000"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Location</label>
                            <input
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                placeholder="e.g. Andheri East, Mumbai"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pincode</label>
                            <input
                                required
                                value={pincode}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length <= 6 && /^\d*$/.test(val)) setPincode(val);
                                }}
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold"
                                placeholder="e.g. 400069"
                                maxLength={6}
                            />
                        </div>

                        <div className="flex flex-col justify-center mt-2">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 hover:border-primary transition-colors">
                                <input
                                    type="checkbox"
                                    checked={operatorIncluded}
                                    onChange={(e) => setOperatorIncluded(e.target.checked)}
                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                />
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Operator Included</span>
                            </label>
                        </div>

                        <div className="md:col-span-2 lg:col-span-3 mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-6">Additional Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Quantity</label>
                                    <input
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold"
                                        placeholder="e.g. 1"
                                        min="1"
                                    />
                                </div>

                                <div className="md:col-span-2 lg:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Service Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={2}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                        placeholder="e.g. Available for excavation, foundation, and road construction work..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:active:scale-100 uppercase tracking-widest text-sm"
                        >
                            {submitting ? "Uploading..." : "Save Listing"}
                            {!submitting && <Save className="h-5 w-5" />}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { HardHat, TrendingUp, ShieldCheck, CreditCard, Building2, Factory, Wrench, Mail, Phone, Menu, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PartnerProgram() {
    const [formData, setFormData] = useState({
        companyName: "",
        fullName: "",
        yearsInBusiness: "",
        gst: "",
        pan: "",
        mobile: "",
        email: "",
        password: "",
        fleetSize: "",
        machineTypes: "",
        regions: "",
        pincode: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Add number validation for mobile, pincode, years in business
        if (name === "mobile" && value.length > 10) return;
        if (name === "mobile" && value && !/^\d*$/.test(value)) return;

        if (name === "pincode" && value.length > 6) return;
        if (name === "pincode" && value && !/^\d*$/.test(value)) return;

        if (name === "yearsInBusiness" && value.length > 2) return;
        if (name === "yearsInBusiness" && value && !/^\d*$/.test(value)) return;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // 1. Sign them up in Supabase Auth so they can log in later
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { full_name: formData.fullName }
                }
            });

            if (authError) {
                if (authError.message.includes("already registered")) {
                    throw new Error("This email is already registered. Please login instead.");
                }
                throw authError;
            }

            // 2. Insert application into `vendors` table
            const { error: insertError } = await supabase
                .from('vendors')
                .insert([
                    {
                        company_name: formData.companyName,
                        full_name: formData.fullName,
                        email: formData.email,
                        mobile_number: formData.mobile,
                        equipment_types: formData.machineTypes,
                        fleet_size: formData.fleetSize,
                        pincode: formData.pincode,
                        years_in_business: formData.yearsInBusiness,
                        status: 'pending' // Admin still needs to approve them
                    }
                ]);

            if (insertError) {
                console.error("Supabase Insert Error:", insertError);
                if (insertError.code === '23505') {
                    throw new Error("An application with this email or mobile number already exists.");
                }
                throw new Error("Failed to submit application. Please try again.");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Application Received!</h2>
                    <p className="text-slate-500 mb-8 font-medium">
                        Thank you for applying to be a Prime Construction Partner. Our admin team will review your fleet details and contact you at <span className="font-bold text-slate-700 dark:text-slate-300">{formData.email}</span> shortly.
                    </p>
                    <Link href="/" className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center transition-transform active:scale-[0.98] shadow-lg uppercase tracking-widest text-sm">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            {/* Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3 text-primary">
                    <HardHat className="h-8 w-8 text-primary" />
                    <h2 className="text-xl font-black leading-tight tracking-tight uppercase italic text-slate-900 dark:text-white">Prime Construction <span className="text-primary">Machines</span></h2>
                </Link>
                <div className="hidden md:flex flex-1 justify-end gap-10">
                    <nav className="flex items-center gap-8">
                        <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/fleet">Fleet</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/how-it-works">How it Works</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/about">About</Link>
                        <Link className="text-sm font-bold border-b-2 border-primary text-primary" href="/partner">Partner Program</Link>
                    </nav>
                    <Link href="/post-requirement" className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-lg shadow-primary/20">
                        Post Requirement
                    </Link>
                </div>
                <div className="md:hidden">
                    <Menu className="text-3xl h-8 w-8 text-slate-900 dark:text-white" />
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center w-full">
                {/* Hero Section */}
                <section className="relative bg-slate-900 py-20 px-6 overflow-hidden w-full">
                    <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60" style={{ backgroundImage: "url('/images/infra_bg.png')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark to-transparent"></div>
                    <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
                        <div className="flex-1 space-y-6">
                            <span className="inline-block px-3 py-1 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest">Vendor Program</span>
                            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight uppercase italic">
                                Partner with Prime Construction Machines and Grow Your Rental Business.
                            </h1>
                            <p className="text-slate-300 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                                List your machines and get high-quality leads from verified contractors. We handle the brokerage, you provide the power.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content Area */}
                <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
                    {/* Registration Form */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Application Details</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    {error}
                                </div>
                            )}
                            {/* Section 1: Company Details */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2 uppercase text-primary">1. Company & Contact Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Legal Entity / Company Name</label>
                                        <input name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="Registered company name" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Contact Person Name</label>
                                        <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="Your full name" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Mobile Number</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500">
                                                <span className="font-bold border-r border-slate-300 dark:border-slate-600 pr-2">+91</span>
                                            </div>
                                            <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary pl-16 py-3" placeholder="9876543210" type="tel" maxLength={10} required />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Email Address</label>
                                        <input name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="vendor@company.com" type="email" required />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Create Password</label>
                                        <input name="password" value={formData.password} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="8+ characters" type="password" required minLength={8} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Years in Business</label>
                                        <input name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="e.g. 5" type="number" min="0" required />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">GST Number (Optional)</label>
                                        <input name="gst" value={formData.gst} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="22AAAAA0000A1Z5" type="text" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Fleet Overview */}
                            <div className="space-y-6 pt-6">
                                <h4 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2 uppercase text-primary">2. Fleet Overview</h4>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Total Fleet Size</label>
                                        <select name="fleetSize" value={formData.fleetSize} onChange={handleChange} required className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-900 focus:ring-primary focus:border-primary p-3">
                                            <option value="" className="bg-white dark:bg-slate-900" disabled>Select fleet size</option>
                                            <option value="1-5 Machines" className="bg-white dark:bg-slate-900">1-5 Machines</option>
                                            <option value="6-15 Machines" className="bg-white dark:bg-slate-900">6-15 Machines</option>
                                            <option value="16-50 Machines" className="bg-white dark:bg-slate-900">16-50 Machines</option>
                                            <option value="50+ Machines" className="bg-white dark:bg-slate-900">50+ Machines</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold">Types of Machines Owned</label>
                                        <textarea name="machineTypes" value={formData.machineTypes} onChange={handleChange} required className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="e.g. Excavators, JCBs, Cranes, Forklifts..." rows={3}></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Operating Regions */}
                            <div className="space-y-6 pt-6">
                                <h4 className="text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2 uppercase text-primary">3. Operating Regions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                    <div className="flex flex-col gap-2 md:col-span-1">
                                        <label className="text-sm font-semibold">States/Cities Covered</label>
                                        <input name="regions" value={formData.regions} onChange={handleChange} required className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="e.g. Maharashtra, Karnataka (Bangalore, Mysore)" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-1">
                                        <label className="text-sm font-semibold">Base Pincode</label>
                                        <input name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent focus:ring-primary focus:border-primary p-3" placeholder="e.g. 400001" type="text" />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="pt-10 space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button disabled={isSubmitting} className="flex-1 bg-primary hover:bg-orange-600 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-primary text-white font-black uppercase italic py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]" type="submit">
                                        {isSubmitting ? "Submitting..." : "Submit Application to Admin"}
                                    </button>
                                    <button className="flex-1 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold uppercase tracking-wider py-4 rounded-xl transition-all" type="button">
                                        Save Progress
                                    </button>
                                </div>
                                <p className="text-center text-xs text-slate-500 font-medium">
                                    By submitting, you agree to our Vendor Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Info Cards & Sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="p-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex gap-4 items-start">
                            <div className="bg-primary text-white p-3 rounded-lg shadow-lg shadow-primary/30 shrink-0">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1 uppercase tracking-tight text-slate-900 dark:text-white">Steady Business</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Access a consistent stream of projects from top-tier construction firms across the country.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex gap-4 items-start">
                            <div className="bg-primary text-white p-3 rounded-lg shadow-lg shadow-primary/30 shrink-0">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1 uppercase tracking-tight text-slate-900 dark:text-white">Verified Leads</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No more cold calling. We only send you leads from contractors with verified budgets and timelines.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex gap-4 items-start">
                            <div className="bg-primary text-white p-3 rounded-lg shadow-lg shadow-primary/30 shrink-0">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1 uppercase tracking-tight text-slate-900 dark:text-white">Timely Payments</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Our escrow service ensures you get paid on time, every time, without the hassle of chasing invoices.</p>
                            </div>
                        </div>

                        {/* Trust Section */}
                        <div className="mt-12 p-8 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Trusted by over 500+ Vendors</h4>
                            <div className="flex flex-col gap-4 grayscale opacity-70">
                                <div className="flex items-center gap-3">
                                    <Building2 className="text-primary h-6 w-6" />
                                    <span className="font-black italic text-lg tracking-tight uppercase">MetroBuild</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Factory className="text-primary h-6 w-6" />
                                    <span className="font-black italic text-lg tracking-tight uppercase">InfraCore</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Wrench className="text-primary h-6 w-6" />
                                    <span className="font-black italic text-lg tracking-tight uppercase">GensetPro</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ or Support Section Placeholder */}
                <section className="bg-slate-50 dark:bg-slate-900/50 w-full py-16 px-6 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-black uppercase italic tracking-tight mb-4 text-slate-900 dark:text-white">Have questions?</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">Our dedicated partner support team is here to help you get started.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors shadow-sm" href="#">
                                <Mail className="h-5 w-5" />
                                partners@primeconstruction.com
                            </Link>
                            <Link className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors shadow-sm" href="tel:+919057221351">
                                <Phone className="h-5 w-5" />
                                +91 90572 21351
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Placeholder matching other pages */}
            <footer className="w-full bg-slate-950 text-white pt-20 pb-10 border-t border-primary/20 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">&copy; 2024 Prime Construction Machines. All rights reserved.</p>
            </footer>
        </div>
    );
}

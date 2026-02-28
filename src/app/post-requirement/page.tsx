"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
    HardHat,
    Search,
    Bell,
    User,
    ClipboardList,
    MapPin,
    Phone,
    Building2,
    Send,
    ChevronRight,
    Mail,
    Share2,
    CheckCircle,
    Wrench,
    User as UserIcon,
    Menu,
    AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function PostRequirementContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const machineId = searchParams?.get("machine");
    const machineName = searchParams?.get("name");

    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",
        pincode: "",
        requirementDetails: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Validation logic
        if (name === "mobileNumber" && value.length > 10) return; // Max 10 digits
        if (name === "mobileNumber" && value && !/^\d*$/.test(value)) return; // Only numeric

        if (name === "pincode" && value.length > 6) return; // Max 6 digits for pincode
        if (name === "pincode" && value && !/^\d*$/.test(value)) return; // Only numeric

        if (name === "fullName" && value.length > 50) return;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const { error: insertError } = await supabase
                .from('leads')
                .insert([
                    {
                        customer_name: formData.fullName,
                        customer_phone: formData.mobileNumber,
                        requirement_details: formData.requirementDetails,
                        location_pincode: formData.pincode,
                        machine_id: machineId || null,
                        status: 'new'
                    }
                ]);

            if (insertError) throw insertError;

            setIsSuccess(true);

            // Redirect back home after a short delay
            setTimeout(() => {
                router.push('/');
            }, 3000);

        } catch (err: any) {
            console.error("Error submitting lead:", err);
            setError(err.message || "Failed to submit requirement. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="size-20 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="size-10" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Requirement Posted!</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                    Our admin team is now reviewing your request and matching you with verified local vendors. You will be contacted shortly.
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">Redirecting to home...</p>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <HardHat className="text-primary h-8 w-8" />
                            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                PRIME CONSTRUCTION <span className="text-primary">MACHINES</span>
                            </span>
                        </Link>

                        {/* Nav Links */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/fleet">Fleet Catalog</Link>
                            <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/partner">Partner Program</Link>
                            <Link className="text-sm font-bold border-b-2 border-primary text-primary" href="/post-requirement">Post Requirement</Link>
                        </nav>

                        {/* Search & Actions */}
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" /> */}
                                <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary outline-none" placeholder="Search equipment..." type="text" />
                            </div>
                            <button className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block">
                                {/* <Bell className="h-5 w-5" /> */}
                            </button>
                            <Link href="/partner" className="hidden sm:flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold uppercase tracking-wider transition-colors border border-slate-200 dark:border-slate-700">
                                List Your Fleet
                            </Link>
                            <div className="md:hidden">
                                {/* <Menu className="text-3xl h-8 w-8 text-slate-900 dark:text-white" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-primary/20 p-8 shadow-2xl relative overflow-hidden w-full">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-yellow-500"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
                            {/* <ClipboardList className="h-8 w-8 text-primary" /> */}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Tell us what you need</h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">Post your exact requirements and we&apos;ll match you with verified vendors.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}
                        {/* Selected Machine Context */}
                        {machineId && machineName && (
                            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-4 mb-2">
                                <Wrench className="h-6 w-6 text-primary shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Requesting Equipment</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{decodeURIComponent(machineName)} <span className="text-primary text-sm italic">#{machineId}</span></p>
                                </div>
                            </div>
                        )}

                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest" htmlFor="fullName">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <input required value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary pl-10 py-3 outline-none transition-colors" id="fullName" name="fullName" placeholder="Enter your full name" type="text" />
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest" htmlFor="mobileNumber">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                                    <Phone className="h-5 w-5" />
                                    <span className="font-bold border-r border-slate-300 dark:border-slate-600 pr-2">+91</span>
                                </div>
                                <input required value={formData.mobileNumber} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary pl-[84px] py-3 outline-none transition-colors" id="mobileNumber" name="mobileNumber" placeholder="98765 43210" type="tel" />
                            </div>
                        </div>

                        {/* Project Pincode */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest" htmlFor="pincode">Project Pincode / Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input required value={formData.pincode} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary pl-10 py-3 outline-none transition-colors" id="pincode" name="pincode" placeholder="e.g. 400001" type="text" />
                                </div>
                            </div>
                        </div>

                        {/* Requirement Details */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest" htmlFor="requirementDetails">Requirement Details</label>
                            <textarea required value={formData.requirementDetails} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary p-4 outline-none transition-colors resize-none" id="requirementDetails" name="requirementDetails" placeholder="Please describe exactly what you need, including timelines and any specific configurations..." rows={4}></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-orange-600 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-primary text-white rounded-xl h-14 font-black text-sm uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                {isSubmitting ? "Submitting..." : (
                                    <>
                                        Submit Requirements <Send className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">Our admin team will match you with a verified local vendor within 30 minutes.</p>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-12 mt-auto border-t border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-8 mb-8">
                        <div className="flex items-center gap-3">
                            <HardHat className="text-primary h-8 w-8" />
                            <span className="text-xl font-black tracking-tighter text-white uppercase italic">PRIME CONSTRUCTION <span className="text-primary">MACHINES</span></span>
                        </div>
                        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
                            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
                            <Link className="hover:text-primary transition-colors" href="#">Terms of Rental</Link>
                            <Link className="hover:text-primary transition-colors" href="#">Support</Link>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-center uppercase tracking-widest">&copy; 2024 Prime Construction Machines. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default function PostRequirement() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PostRequirementContent />
        </Suspense>
    );
}

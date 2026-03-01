"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HardHat, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function VendorLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (signInError) throw signInError;

            // Set simple cookie for Next.js Middleware since Supabase JS uses localStorage
            document.cookie = "vendor_auth=true; path=/; max-age=86400"; // 24 hours

            // Success! Redirect to dashboard with full reload
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message || "Invalid login credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col sm:justify-center items-center pt-8 sm:pt-0">
            <Link href="/" className="flex items-center gap-3 mb-8">
                <div className="bg-primary p-3 rounded-xl shadow-lg shadow-primary/20">
                    <HardHat className="text-white h-8 w-8" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">PRIME CONSTRUCTION</span>
                    <span className="text-primary font-black uppercase text-sm tracking-widest leading-tight">Partners</span>
                </div>
            </Link>

            <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 overflow-hidden sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Vendor Portal</h2>
                        <p className="text-slate-500 font-medium text-sm">Sign in to manage your fleet and view inquiries.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white disabled:opacity-50"
                                    placeholder="partner@company.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white disabled:opacity-50"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:active:scale-100 uppercase tracking-widest text-sm"
                        >
                            {loading ? "Signing in..." : "Login to Dashboard"}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Secure Partner Access
                </div>
            </div>

            <p className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Not a partner yet? <Link href="/partner" className="text-primary hover:underline">Apply Here</Link>
            </p>
        </div>
    );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HardHat, Mail, ArrowRight, ShieldCheck, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function VendorLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Forgot password state
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

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

            document.cookie = "vendor_auth=true; path=/; max-age=86400";
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message || "Invalid login credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!resetEmail) {
            setError("Please enter your email address.");
            return;
        }
        const resetUrl = `${window.location.origin}/auth/reset-password`;
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: resetUrl,
            });
            if (resetError) throw resetError;
            setResetSent(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setResetLoading(false);
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
                    {/* FORGOT PASSWORD VIEW */}
                    {showForgot ? (
                        <div>
                            <button
                                onClick={() => { setShowForgot(false); setResetSent(false); setError(""); setResetEmail(""); }}
                                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary uppercase tracking-widest mb-6 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </button>

                            {resetSent ? (
                                <div className="text-center py-6 space-y-4">
                                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Check Your Email</h2>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        A password reset link has been sent to <span className="text-slate-800 dark:text-white font-bold">{resetEmail}</span>. Click the link in the email to set a new password.
                                    </p>
                                    <button
                                        onClick={() => { setShowForgot(false); setResetSent(false); setResetEmail(""); }}
                                        className="mt-4 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Reset Password</h2>
                                        <p className="text-slate-500 font-medium text-sm">Enter your email and we'll send you a reset link.</p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                                            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleResetPassword} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                                <input
                                                    type="email"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                                                    placeholder="partner@company.com"
                                                    disabled={resetLoading}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={resetLoading}
                                            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg disabled:opacity-70 uppercase tracking-widest text-sm"
                                        >
                                            {resetLoading ? "Sending..." : "Send Reset Link"}
                                            {!resetLoading && <ArrowRight className="h-5 w-5" />}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    ) : (
                        /* LOGIN VIEW */
                        <>
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
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => { setShowForgot(true); setError(""); }}
                                            className="text-xs font-bold text-primary hover:text-orange-600 uppercase tracking-widest transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
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
                        </>
                    )}
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

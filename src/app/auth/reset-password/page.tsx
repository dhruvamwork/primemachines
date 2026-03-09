"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HardHat, KeyRound, ArrowRight, CheckCircle2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [validSession, setValidSession] = useState<boolean | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // When Supabase redirects here, it sets the session in the URL hash.
    // We listen for the PASSWORD_RECOVERY event to confirm the token is valid.
    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setValidSession(true);
            }
        });

        // If no event fires within 3 seconds, session may be invalid/expired
        const timer = setTimeout(() => {
            setValidSession(prev => {
                if (prev === null) return false;
                return prev;
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) throw updateError;
            setSuccess(true);
            setTimeout(() => router.push("/vendor-login"), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to reset password. Please try again.");
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
                    {/* Loading — waiting for Supabase session event */}
                    {validSession === null && (
                        <div className="text-center py-10 space-y-4">
                            <div className="mx-auto w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 text-sm font-medium">Verifying reset link...</p>
                        </div>
                    )}

                    {/* Invalid / expired link */}
                    {validSession === false && (
                        <div className="text-center py-8 space-y-4">
                            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Link Expired</h2>
                            <p className="text-slate-500 text-sm font-medium">This reset link has expired or is invalid. Please request a new one.</p>
                            <Link
                                href="/vendor-login"
                                className="inline-block mt-2 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="text-center py-8 space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Password Updated!</h2>
                            <p className="text-slate-500 text-sm font-medium">Your password has been changed successfully. Redirecting to login...</p>
                        </div>
                    )}

                    {/* Reset Form */}
                    {validSession === true && !success && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Set New Password</h2>
                                <p className="text-slate-500 font-medium text-sm">Choose a strong password for your account.</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleReset} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-12 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                                            placeholder="••••••••"
                                            disabled={loading}
                                            minLength={6}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-12 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                                            placeholder="••••••••"
                                            disabled={loading}
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg disabled:opacity-70 uppercase tracking-widest text-sm"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                    {!loading && <ArrowRight className="h-5 w-5" />}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Secure Partner Access
                </div>
            </div>
        </div>
    );
}

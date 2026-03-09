"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HardHat, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            // Using a server action or API route to securely set an HTTP-only cookie
            // Since this is a hardcoded internal portal, we verify locally.
            // In production, we should map this to an admin Supabase user.

            if (email === "primemachines2026@gmail.com" && password === "%2000@pushkar") {
                // Set a simple auth cookie that the proxy.ts middleware will check
                document.cookie = "admin_auth=true; path=/; max-age=86400"; // 24 hours

                // Redirect to the admin dashboard
                router.push("/admin");
                router.refresh();
            } else {
                throw new Error("Invalid admin credentials.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-display bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col sm:justify-center items-center pt-8 sm:pt-0">
            <Link href="/" className="flex items-center gap-3 mb-8">
                <div className="bg-primary p-3 rounded-xl shadow-lg shadow-primary/20">
                    <HardHat className="text-white h-8 w-8" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">PRIME CONSTRUCTION</span>
                    <span className="text-primary font-black uppercase text-sm tracking-widest leading-tight">Admin Services</span>
                </div>
            </Link>

            <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 overflow-hidden sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-500/10 rounded-full mb-4">
                            <ShieldCheck className="h-8 w-8 text-red-600 dark:text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Restricted Area</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">System administration portal login.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Admin Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none tracking-wide font-medium disabled:opacity-50 text-slate-900 dark:text-white"
                                    placeholder="admin@primemachines.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Access Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-12 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none tracking-widest font-bold disabled:opacity-50 text-slate-900 dark:text-white"
                                    placeholder="••••••••••"
                                    disabled={loading}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:active:scale-100 uppercase tracking-widest text-sm"
                        >
                            {loading ? "Authenticating..." : "Establish Secure Link"}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-xs font-bold text-slate-500 text-center uppercase tracking-widest">
                    <p>Unauthorized access is strictly prohibited and logged.</p>
                </div>
            </div>

            <p className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Return to <Link href="/" className="text-primary hover:underline">Public Homepage</Link>
            </p>
        </div>
    );
}

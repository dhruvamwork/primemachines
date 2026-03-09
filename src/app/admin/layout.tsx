"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HardHat, Search, Bell, LogOut, LayoutDashboard, Truck, Activity, PieChart, Users, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.replace("/admin-login");
    };

    const navLinks = [
        { href: '/admin', label: 'Live Leads', icon: Activity, active: pathname === '/admin' },
        { href: '/admin/vendors', label: 'Vendors', icon: Users, active: pathname.startsWith('/admin/vendors') },
        { href: '/admin/fleet', label: 'Fleet', icon: Truck, active: pathname.startsWith('/admin/fleet') },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100">
            {/* Top Header */}
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3 lg:px-10 z-10 relative">
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link href="/admin" className="flex items-center gap-2 sm:gap-3 text-primary transition-transform hover:scale-105">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <HardHat className="size-5" />
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-base sm:text-xl font-bold leading-tight tracking-tight">
                            Prime <span className="text-primary font-black">Admin</span>
                        </h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className={`text-sm font-semibold transition-colors ${link.active ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'}`}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={handleLogout} className="flex items-center justify-center rounded-xl px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors gap-2 text-sm font-bold">
                        <LogOut className="size-5" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Sidebar - Desktop Only */}
                <aside className="w-full lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hidden lg:flex flex-col overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Main Menu</p>
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${link.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    <link.icon className="size-5" />
                                    <span className="text-sm font-semibold">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-10 pb-4">
                        <div className="rounded-xl bg-primary/10 p-4 border border-primary/20 text-center lg:text-left">
                            <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Super Admin</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Access enabled with full vendor data & control visibility.</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10 relative">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 safe-area-bottom">
                <div className="flex items-center justify-around py-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${link.active ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <link.icon className={`size-6 ${link.active ? 'text-primary' : ''}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${link.active ? 'text-primary' : ''}`}>{link.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                    >
                        <LogOut className="size-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Logout</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

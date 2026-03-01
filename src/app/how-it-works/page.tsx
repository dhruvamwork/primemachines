import Link from "next/link";
import { HardHat, Wrench, Factory, Store, ShieldCheck, CreditCard, Headset, MessageSquare } from "lucide-react";

export default function HowItWorks() {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            {/* Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-4">
                    <div className="text-primary">
                        <HardHat className="text-4xl h-10 w-10" />
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-xl font-black leading-tight tracking-tight uppercase italic">Prime Construction <span className="text-primary">Machines</span></h2>
                </Link>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <nav className="hidden md:flex items-center gap-9">
                        <Link className="text-primary text-sm font-bold border-b-2 border-primary" href="/how-it-works">How it Works</Link>
                        <Link className="text-slate-700 dark:text-slate-200 text-sm font-semibold hover:text-primary transition-colors" href="/about">About</Link>
                        <Link className="text-slate-700 dark:text-slate-200 text-sm font-semibold hover:text-primary transition-colors" href="/partner">Partner Program</Link>
                    </nav>
                </div>
            </header>

            <main className="flex flex-col flex-1 max-w-5xl mx-auto w-full px-6 py-12">
                {/* Hero Section */}
                <div className="flex flex-col gap-4 mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
                        The <span className="text-primary">Engine</span> Of Construction
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        We bridge the gap between high-tier equipment owners and heavy-duty contractors. Transparent, vetted, and reliable.
                    </p>
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Section 1: For Contractors */}
                    <div className="flex flex-col space-y-8">
                        <div className="flex items-center gap-3">
                            <Wrench className="text-primary h-8 w-8" />
                            <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white italic">For Contractors</h2>
                        </div>

                        <div className="relative space-y-12">
                            {/* Step 1 */}
                            <div className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white font-black text-xl shadow-lg shadow-primary/30">1</div>
                                    <div className="w-px grow bg-slate-200 dark:bg-slate-800 mt-4"></div>
                                </div>
                                <div className="pb-8">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Submit Requirement</h3>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">Use our home page to tell us exactly what machinery you need, when you need it, and where your site is located.</p>
                                    <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-slate-200 dark:bg-slate-800">
                                        <img className="w-full h-full object-cover" alt="Row of modern yellow excavators parked on a construction site" src="/images/login_bg.png" />
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white font-black text-xl shadow-lg shadow-primary/30">2</div>
                                    <div className="w-px grow bg-slate-200 dark:bg-slate-800 mt-4"></div>
                                </div>
                                <div className="pb-8">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Request Quote via WhatsApp</h3>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">Found what you need? Connect directly with our admin team to finalize terms, dates, and logistics instantly.</p>
                                    <div className="mt-4 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl">
                                        <MessageSquare className="text-green-600 dark:text-green-400 h-6 w-6" />
                                        <span className="text-green-800 dark:text-green-300 font-bold uppercase tracking-wider text-sm">Instant Admin Support</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white font-black text-xl shadow-lg shadow-primary/30">3</div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Fulfillment & Delivery</h3>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">We handle the end-to-end logistics. Your equipment arrives site-ready and fully operational exactly when you need it.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: For Vendors */}
                    <div className="flex flex-col space-y-8 bg-slate-100 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-fit">
                        <div className="flex items-center gap-3">
                            <Factory className="text-primary h-8 w-8" />
                            <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white italic">For Vendors</h2>
                        </div>

                        <div className="space-y-10">
                            {/* Card 1 */}
                            <div className="flex gap-5">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                    <Store className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight">List Your Equipment</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">Upload your inventory details, certifications, and availability through our intuitive vendor portal.</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="flex gap-5">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                    <ShieldCheck className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight">Admin Vetting</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">Our team verifies machine maintenance logs and legal compliance to maintain our premium fleet standards.</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="flex gap-5">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                    <CreditCard className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight">Verified Leads & Payments</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">Receive high-quality leads from vetted contractors. Enjoy guaranteed and timely payments for every successful rental.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-auto">
                            <Link href="/partner" className="flex items-center justify-center w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase italic tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xl">
                                Apply as Vendor
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Call to Action Footer */}
                <section className="mt-24 p-12 bg-primary rounded-3xl relative overflow-hidden shadow-2xl shadow-primary/40">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 -skew-x-12 translate-x-12 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-white">
                            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight mb-2">Ready to move earth?</h2>
                            <p className="text-white/80 text-lg font-medium">Get in touch with an administrator today to start renting or listing.</p>
                        </div>
                        <Link href="tel:+919057221351" className="flex items-center gap-2 px-10 py-5 bg-white text-slate-900 rounded-xl font-black uppercase italic text-lg shadow-xl hover:scale-105 transition-transform">
                            <Headset className="h-6 w-6" />
                            +91 90572 21351
                        </Link>
                    </div>
                </section>
            </main>

            {/* Small Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6 text-center text-slate-500 dark:text-slate-500 text-sm font-semibold uppercase tracking-widest mt-auto">
                <p>&copy; 2024 Prime Construction Machines. All rights reserved. Safety First.</p>
            </footer>
        </div>
    );
}

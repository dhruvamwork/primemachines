import Link from "next/link";
import { HardHat, Menu, Construction, Timer, Map as MapIcon, Building2, Factory, Package, CheckCircle, ShieldCheck, Wrench, TrendingUp, Box, AtSign } from "lucide-react";

export default function About() {
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
                        <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/">Home</Link>
                        <Link className="text-sm font-bold border-b-2 border-primary text-primary" href="/about">About</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/how-it-works">How it Works</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors text-slate-700 dark:text-slate-200" href="/partner">Partner Program</Link>
                    </nav>
                </div>
                <div className="md:hidden">
                    <Menu className="text-3xl h-8 w-8 text-slate-900 dark:text-white" />
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center">
                {/* Hero Section */}
                <section className="w-full max-w-[1200px] px-6 py-12 md:py-20">
                    <div className="@container">
                        <div className="bg-cover bg-center flex flex-col justify-center overflow-hidden rounded-xl min-h-[500px] relative" style={{ backgroundImage: 'linear-gradient(90deg, rgba(34, 22, 16, 0.7) 0%, rgba(34, 22, 16, 0.2) 100%), url("/images/login_bg.png")' }}>
                            <div className="flex flex-col p-8 md:p-16 max-w-2xl gap-6 relative z-10">
                                <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">Industrial Powerhouse</span>
                                <h1 className="text-white text-4xl md:text-6xl font-black leading-[1.1] tracking-tight italic uppercase">Enterprise-Grade <span className="text-primary">Equipment</span> Solutions</h1>
                                <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed">
                                    Powering the world&apos;s most ambitious projects with scale, reliability, and precision response.
                                </p>
                                <div className="flex gap-4 mt-2">
                                    <Link href="/" className="bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide transition-colors">Start Request</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Mission & Values */}
                <section className="w-full max-w-[1200px] px-6 py-16 flex flex-col md:flex-row gap-12 items-start">
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-12 bg-primary"></div>
                            <span className="text-primary font-bold uppercase tracking-widest text-xs">Our Mission</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight uppercase italic text-slate-900 dark:text-white">Streamlining the <span className="text-primary underline decoration-primary/30 underline-offset-8">Industrial Market</span></h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                            Prime Construction Machines was founded on a single premise: industrial infrastructure should never wait for equipment. We are committed to redefining reliability through uncompromising safety, massive scale, and a digital-first approach to logistical efficiency.
                        </p>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-xl border-l-4 border-primary shadow-sm hover:translate-x-2 transition-transform">
                            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white uppercase tracking-tight">Reliability</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Guaranteed uptime for every machine in our inventory, maintained to manufacturer specs.</p>
                        </div>
                        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-xl border-l-4 border-primary shadow-sm hover:translate-x-2 transition-transform">
                            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white uppercase tracking-tight">Scale</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Access to thousands of specialized machines ready for deployment nationwide.</p>
                        </div>
                    </div>
                </section>

                {/* Key Stats Bar */}
                <section className="w-full bg-slate-900 dark:bg-slate-950 py-16 my-8 border-y border-white/5 shadow-2xl">
                    <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center gap-2 group">
                            <Construction className="text-primary h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-white text-5xl font-black tracking-tight">5,000+</p>
                            <p className="text-primary font-bold uppercase tracking-widest text-sm">Machines in Fleet</p>
                            <p className="text-slate-400 text-xs font-semibold">+15% Annual Growth</p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 group">
                            <Timer className="text-primary h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-white text-5xl font-black tracking-tight">30 MINS</p>
                            <p className="text-primary font-bold uppercase tracking-widest text-sm">Response Commitment</p>
                            <p className="text-slate-400 text-xs font-semibold">Industry Leading Speed</p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 group">
                            <MapIcon className="text-primary h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-white text-5xl font-black tracking-tight">48</p>
                            <p className="text-primary font-bold uppercase tracking-widest text-sm">States Covered</p>
                            <p className="text-slate-400 text-xs font-semibold">Total National Logistics</p>
                        </div>
                    </div>
                </section>

                {/* Expertise Section */}
                <section className="w-full max-w-[1200px] px-6 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4 uppercase italic text-slate-900 dark:text-white">Core Industry <span className="text-primary">Expertise</span></h2>
                        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Infrastructure */}
                        <div className="group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:border-primary/50">
                            <div className="h-48 overflow-hidden bg-slate-800">
                                <img alt="Infrastructure" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="/images/infra_bg.png" />
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Building2 className="text-primary h-6 w-6" />
                                    <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">Infrastructure</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium text-sm">Specialized solutions for roadwork, bridge construction, and civil engineering projects requiring maximum uptime.</p>
                                <ul className="space-y-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Heavy Earthmovers</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Paving Equipment</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Structural Cranes</li>
                                </ul>
                            </div>
                        </div>

                        {/* Manufacturing */}
                        <div className="group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:border-primary/50">
                            <div className="h-48 overflow-hidden bg-slate-800">
                                <img alt="Manufacturing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="/images/logistics_bg.png" />
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Factory className="text-primary h-6 w-6" />
                                    <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">Manufacturing</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium text-sm">Internal facility upgrades and assembly line logistics requiring precision handling and safety-first fleet management.</p>
                                <ul className="space-y-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Electric Forklifts</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Scissor Lifts</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Specialized Tooling</li>
                                </ul>
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:border-primary/50">
                            <div className="h-48 overflow-hidden bg-slate-800">
                                <img alt="Logistics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="/images/logistics_bg.png" />
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Package className="text-primary h-6 w-6" />
                                    <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">Logistics</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium text-sm">Warehousing and distribution support with rapid deployment capabilities to manage seasonal demand peaks.</p>
                                <ul className="space-y-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Material Handlers</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Reach Trucks</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Telehandlers</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Safety Standards Section */}
                <section className="w-full bg-slate-900 dark:bg-slate-950 py-20 border-y border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-32 pointer-events-none"></div>
                    <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row gap-16 items-center relative z-10">
                        <div className="flex-1 text-white">
                            <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Gold Standard Protection</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase italic tracking-tight">Safety Without <span className="text-primary">Compromise</span></h2>
                            <p className="text-lg text-slate-300 mb-8 leading-relaxed font-medium">
                                Our fleet isn&apos;t just large—it&apos;s the safest in the industry. Every piece of equipment undergoes a rigorous 40-point safety inspection before every deployment. We don&apos;t just meet OSHA standards; we exceed them.
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                                    <div className="flex-shrink-0 h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg uppercase tracking-tight">Telemetric Monitoring</h4>
                                        <p className="text-sm text-slate-400 font-medium mt-1">Real-time tracking of machine health and operator behavior to prevent incidents.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                                    <div className="flex-shrink-0 h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                                        <Wrench className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg uppercase tracking-tight">Certified Technicians</h4>
                                        <p className="text-sm text-slate-400 font-medium mt-1">Our 24/7 support team consists of master-certified mechanics only.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="aspect-square bg-slate-950 rounded-[2rem] overflow-hidden relative border-4 border-slate-800 shadow-[0_0_50px_rgba(236,91,19,0.2)] bg-slate-900">
                                <img alt="Safety First" className="w-full h-full object-cover grayscale opacity-40 mix-blend-overlay" src="/images/infra_bg.png" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white bg-gradient-to-t from-slate-950/80 to-transparent">
                                    <p className="text-7xl font-black mb-2 text-primary drop-shadow-[0_0_15px_rgba(236,91,19,0.5)]">0</p>
                                    <p className="text-2xl font-black uppercase tracking-widest italic">Major Incidents</p>
                                    <p className="mt-4 text-sm text-slate-400 font-bold uppercase tracking-wider">Across 2 million+ operating hours in 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="w-full max-w-[1200px] px-6 py-20 text-center">
                    <div className="bg-slate-900 rounded-3xl p-12 md:p-20 relative overflow-hidden shadow-2xl">
                        {/* Decorative Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tight">Ready to Scale Your <span className="text-primary">Operations</span>?</h2>
                            <p className="text-slate-400 text-lg mb-10 font-medium">Experience the Prime Construction Machines difference with our 30-minute response commitment and enterprise-grade fleet.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/post-requirement" className="bg-primary hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 flex items-center justify-center">Start Your Quote</Link>
                                <Link href="tel:+919057221351" className="bg-white/5 border border-white/20 hover:bg-white/10 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest transition-all hover:-translate-y-1 flex items-center justify-center">+91 90572 21351</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full bg-slate-950 text-white pt-20 pb-10 border-t border-primary/20">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <Link href="/" className="flex items-center gap-3 text-primary mb-6 group">
                                <HardHat className="h-8 w-8 group-hover:-rotate-12 transition-transform" />
                                <h2 className="text-xl font-black uppercase tracking-tight italic text-white">Prime Construction <span className="text-primary">Machines</span></h2>
                            </Link>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                                The premier choice for industrial equipment rentals. Scalable solutions for global infrastructure.
                            </p>
                            <div className="flex gap-4">
                                <TrendingUp className="h-5 w-5 cursor-pointer hover:text-primary transition-colors text-slate-500" />
                                <Box className="h-5 w-5 cursor-pointer hover:text-primary transition-colors text-slate-500" />
                                <AtSign className="h-5 w-5 cursor-pointer hover:text-primary transition-colors text-slate-500" />
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-primary">Fleet</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Earthmoving</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Aerial Lifts</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Material Handling</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Compaction</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-primary">Company</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li><Link className="hover:text-white hover:underline transition-all text-primary border-b border-primary/30 pb-1 w-fit inline-block" href="#">About Us</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Expertise</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Safety Standards</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Careers</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-primary">Support</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">24/7 Response</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Maintenance</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Terms of Service</Link></li>
                                <li><Link className="hover:text-white hover:underline transition-all" href="#">Contact</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
                        <p>&copy; 2024 Prime Construction Machines. All rights reserved.</p>
                        <div className="flex gap-8">
                            <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
                            <Link className="hover:text-white transition-colors" href="#">Cookie Policy</Link>
                            <Link className="hover:text-white transition-colors" href="#">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

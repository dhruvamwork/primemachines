"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HardHat, MapPin, ShieldCheck, Headset, CreditCard,
  ChevronDown, Truck, Settings, Warehouse, Droplets, Building,
  Mail, Phone, ChevronRight, Send, User, ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  // Lead Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    address: "",
    requirementDetails: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mobile" && value.length > 10) return;
    if (name === "mobile" && value && !/^\d*$/.test(value)) return;
    if (name === "pincode" && value.length > 6) return;
    if (name === "pincode" && value && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const fullRequirementContext = `Project Address: ${formData.address}\n\nSpecific Requirements:\n${formData.requirementDetails}`;

      const { error: insertError } = await supabase
        .from('leads')
        .insert([
          {
            customer_name: formData.fullName,
            customer_phone: formData.mobile,
            location_pincode: formData.pincode,
            requirement_details: fullRequirementContext,
            status: 'new'
          }
        ]);

      if (insertError) throw new Error("Failed to submit inquiry. Please try again.");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      {/* Sticky Navigation - Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <HardHat className="text-primary h-8 w-8" />
              <h1 className="text-white text-2xl font-black tracking-tighter uppercase italic">
                Prime Construction <span className="text-primary">Machines</span>
              </h1>
            </div>

            {/* Center Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link className="text-white/90 hover:text-primary text-sm font-semibold tracking-wide transition-colors uppercase" href="/">Home</Link>
              <Link className="text-white/90 hover:text-primary text-sm font-semibold tracking-wide transition-colors uppercase" href="#">About Us</Link>
              <Link className="text-white/90 hover:text-primary text-sm font-semibold tracking-wide transition-colors uppercase" href="#">How it Works</Link>
            </nav>

            {/* Right CTA */}
            <div className="flex items-center gap-3">
              <Link href="/partner">
                <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all uppercase tracking-wider">
                  Partner Program
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Split Lead-Capture Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-12 overflow-hidden bg-slate-900">
        {/* Active Video Background */}
        <div className="absolute inset-0 bg-background-dark">
          <div className="absolute inset-0 hero-video-overlay z-10 opacity-80 backdrop-blur-[2px]"></div>
          <video
            autoPlay loop muted playsInline
            className="w-full h-full object-cover scale-110 opacity-40 mix-blend-luminosity"
            poster="https://lh3.googleusercontent.com/aida-public/AB6AXuCbzhXb3t3bOHGfSPO5EUJVi5cAheY95Ql3MOSnXKmF4lpgT0MKxMXGvlRbK6YuXpGzLlhwng7P-b-rO48zsxhY7I9uj1qR8EFOumglDPNr8Ch7FM6SzoeWTywH1-fhzMS6B37bn383i-W-cUrkkl8ph_gQUuuMq0K_Ms84nbdVFnyOegOkH8_tZIAnT2c-20GujsxWkNxUPh-sZPKlS0TP2m_aV16MeDj5892Zp1Gsk-NnOGSS1xYBq1ZO-FiBxuLOhBBjKXb39yEE"
          >
            <source src="https://videos.pexels.com/video-files/3201594/3201594-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-10">

          {/* Left Side: Copy */}
          <div className="flex-1 text-center lg:text-left pt-10">
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md">
              India's Premier Equipment Brokerage
            </span>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tighter mb-6 uppercase italic">
              Rent Heavy Construction <br className="hidden lg:block" />
              <span className="text-primary leading-tight">Equipment Instantly.</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium mb-10 max-w-2xl leading-relaxed">
              Tell us what you need. Our experts will source the best verified machinery for your site within 30 minutes. Let us handle the logistics, you focus on the build.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-6 text-white/60 uppercase text-xs font-bold tracking-widest mt-8">
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary" /> Verified Inventory</div>
              <div className="flex items-center gap-3"><Headset className="h-5 w-5 text-primary" /> 30-Min Sourcing</div>
              <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-primary" /> Escrow Payments</div>
            </div>
          </div>

          {/* Right Side: Lead Capture Form */}
          <div className="w-full max-w-lg lg:w-[480px] shrink-0">
            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden ring-1 ring-white/5">
              {/* Form Glow Effect */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

              {success ? (
                <div className="text-center py-10 space-y-6">
                  <div className="mx-auto w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center border border-green-500/30">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Requirement Sourced</h3>
                  <p className="text-white/70 font-medium leading-relaxed">
                    Our expert brokers are currently matching your request with our verified fleet network. We will contact you at <span className="text-white font-bold">{formData.mobile}</span> shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-colors mt-6 border border-white/10"
                  >
                    Post Another Requirement
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-left">
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight italic mb-2 relative inline-block">
                      Find Machinery
                      <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
                    </h3>
                    <p className="text-white/60 text-sm font-medium mt-4">Fast. Reliable. Direct to Site.</p>
                  </div>

                  <form onSubmit={handleSubmitLead} className="space-y-5 relative z-10">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-bold text-center">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name & Phone Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-4 w-4" />
                          <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white pl-11 pr-4 h-12 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 text-sm font-medium transition-all group-hover:bg-slate-900/80" placeholder="Full Name" type="text" />
                        </div>
                        <div className="relative group flex">
                          <div className="h-12 flex items-center justify-center bg-slate-900/50 border-y border-l border-white/10 rounded-l-xl px-3 border-r-0 text-slate-400 font-bold text-sm">
                            +91
                          </div>
                          <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white px-4 h-12 rounded-r-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 text-sm font-bold tracking-widest transition-all group-hover:bg-slate-900/80 -ml-px focus:z-10" placeholder="Mobile" type="tel" maxLength={10} />
                        </div>
                      </div>

                      {/* Pincode Row */}
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-4 w-4" />
                        <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white pl-11 pr-4 h-12 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 text-sm font-bold tracking-widest transition-all group-hover:bg-slate-900/80" placeholder="Site Pincode" type="tel" maxLength={6} />
                      </div>

                      {/* Exact Location Row */}
                      <div className="relative group">
                        <Building className="absolute left-4 top-4 text-primary h-4 w-4" />
                        <textarea required name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white pl-11 pr-4 py-3 min-h-[50px] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 text-sm font-medium transition-all group-hover:bg-slate-900/80 resize-y" placeholder="Specific Project Location / Address" rows={2} />
                      </div>

                      {/* Requirement Details */}
                      <div className="relative group">
                        <Settings className="absolute left-4 top-4 text-primary h-4 w-4" />
                        <textarea required name="requirementDetails" value={formData.requirementDetails} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 text-white pl-11 pr-4 py-3 min-h-[100px] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40 text-sm font-medium transition-all group-hover:bg-slate-900/80 resize-y" placeholder="Target requirement (e.g. Need a 50-ton mobile crane for 3 days starting Monday...)" rows={3} />
                      </div>
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-orange-600 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 text-white h-14 rounded-xl font-black uppercase italic text-sm md:text-base tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-6">
                      {isSubmitting ? "Submitting Request..." : "Request Machinery Now"}
                      {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                    </button>

                    <p className="text-center text-[10px] text-white/40 font-bold uppercase tracking-widest mt-4">
                      No upfront payment required
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-slate-900 border-y border-white/10 py-6 relative z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 text-white/30 font-black uppercase text-xl italic tracking-widest opacity-60">
          <div className="flex items-center gap-2"><Building2 className="w-6 h-6" /> L&T</div>
          <div className="flex items-center gap-2"><Building2 className="w-6 h-6" /> TATA PROJECTS</div>
          <div className="flex items-center gap-2"><Building2 className="w-6 h-6" /> AFCONS</div>
          <div className="flex items-center gap-2"><Building2 className="w-6 h-6" /> SHAPOORJI PALLONJI</div>
        </div>
      </div>

      {/* Static Services Grid Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Our Core Fleet Expertise</h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter text-slate-900 dark:text-white italic max-w-3xl">
              Machinery We Source For <span className="text-primary">Contractors</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
              From heavy earthmoving to precision lifting, our broker network accesses the finest managed fleet operations in the country. Let us know exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <Truck className="h-8 w-8" />, title: "JCBs", desc: "Backhoe Loaders" },
              { icon: <HardHat className="h-8 w-8" />, title: "Excavators", desc: "Heavy Digging" },
              { icon: <Settings className="h-8 w-8" />, title: "Cranes", desc: "Lifting Gear" },
              { icon: <Truck className="h-8 w-8" />, title: "Mixers", desc: "Concrete transport" },
              { icon: <Truck className="h-8 w-8" />, title: "Dumpers", desc: "Bulk Hauling" }
            ].map((cat, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 text-primary">
                  {cat.icon}
                </div>
                <h4 className="text-base md:text-lg font-black uppercase tracking-tight mb-2 text-slate-900 dark:text-white">{cat.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-wide">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve Section (Kept as is for styling/content value) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Our Reach</h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Industries We <span className="text-primary">Serve</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: <HardHat className="h-6 w-6 text-primary mb-2" />, title: "Infrastructure", img: "/images/infra_bg.png" },
              { icon: <Warehouse className="h-6 w-6 text-primary mb-2" />, title: "Warehouse", img: "/images/logistics_bg.png" },
              { icon: <Settings className="h-6 w-6 text-primary mb-2" />, title: "Manufacturing", img: "/images/logistics_bg.png" },
              { icon: <Droplets className="h-6 w-6 text-primary mb-2" />, title: "Oil & Gas", img: "/images/infra_bg.png" },
              { icon: <Building className="h-6 w-6 text-primary mb-2" />, title: "Residential", img: "/images/login_bg.png" }
            ].map((ind, idx) => (
              <div key={idx} className="group relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-slate-800" />
                <img src={ind.img} alt={ind.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 mix-blend-luminosity hover:mix-blend-normal" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 z-20">
                  {ind.icon}
                  <h4 className="text-base sm:text-lg font-black uppercase italic">{ind.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-3 text-primary mb-6 group inline-flex">
                <HardHat className="h-8 w-8 group-hover:-rotate-12 transition-transform" />
                <h2 className="text-xl font-black uppercase tracking-tight italic text-slate-900 dark:text-white">Prime Construction <span className="text-primary">Machines</span></h2>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                The premier brokerage network for high-end construction machinery and heavy equipment scaling.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"><Mail className="h-5 w-5" /></div>
                  <span className="text-sm font-bold text-white/70">contact@primeconstruction.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"><Phone className="h-5 w-5" /></div>
                  <span className="text-sm font-bold text-white">+91 90572 21351</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-8 text-white/50">Services</h5>
              <ul className="space-y-4">
                <li><span className="text-white/70 text-sm font-bold uppercase italic cursor-default">Machine Leasing</span></li>
                <li><Link className="text-white/70 hover:text-primary transition-colors text-sm font-bold uppercase italic" href="/partner">Partner Program</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black uppercase tracking-widest text-xs mb-8 text-white/50">Company</h5>
              <ul className="space-y-4">
                <li><Link className="text-white/70 hover:text-primary transition-colors text-sm font-bold uppercase italic" href="#">About Us</Link></li>
                <li><Link className="text-white/70 hover:text-primary transition-colors text-sm font-bold uppercase italic" href="#">How it Works</Link></li>
              </ul>
            </div>

            {/* Added an empty placeholder div to keep grid spacing, or we can use it for something else */}
            <div></div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">&copy; 2024 PRIME CONSTRUCTION MACHINES. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <Link className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest" href="#">Privacy Policy</Link>
              <Link className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest" href="/admin-login">Admin Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

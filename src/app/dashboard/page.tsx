"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HardHat, LogOut, Plus, Package, Activity, AlertCircle, Trash2, MapPin, IndianRupee, ImagePlus, Upload, Pencil, X, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PartnerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [machines, setMachines] = useState<any[]>([]);
    const [vendorProfile, setVendorProfile] = useState<any>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ company_name: '', full_name: '', mobile: '', pincode: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Edit Vehicle state
    const [editingMachine, setEditingMachine] = useState<any>(null);
    const [machineEditForm, setMachineEditForm] = useState({
        name: '', category: 'Excavators', brand: '', registration_plate: '',
        mfg_year: '', price_hourly: '', price_daily: '', price_monthly: '',
        operator_included: true, quantity: '1', description: '', location: '', pincode: ''
    });
    const [savingMachine, setSavingMachine] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);

                // Try to fetch vendor profile using email or phone to get the correct vendor ID
                const identifier = session.user.email || session.user.phone;
                let vendorIdToUse = session.user.id;

                if (identifier) {
                    const { data: vendorData } = await supabase
                        .from('vendors')
                        .select('*')
                        .or(`email.eq.${identifier},mobile_number.eq.${identifier}`)
                        .single();

                    if (vendorData) {
                        setVendorProfile(vendorData);
                        setEditForm({
                            company_name: vendorData.company_name || '',
                            full_name: vendorData.contact_name || vendorData.full_name || '',
                            mobile: vendorData.mobile || vendorData.mobile_number || '',
                            pincode: vendorData.pincode || ''
                        });
                        setImagePreview(vendorData.profile_image || null);
                        vendorIdToUse = vendorData.id;
                    }
                }

                // Fetch vendor's machines using the correct vendor table ID
                const { data: machineData } = await supabase
                    .from('machines')
                    .select('*')
                    .eq('vendor_id', vendorIdToUse)
                    .order('created_at', { ascending: false });

                if (machineData) setMachines(machineData);
            } else {
                window.location.href = "/vendor-login";
                return;
            }
            setLoading(false);
        };
        fetchData();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/vendor-login";
    };

    const handleDeleteMachine = async (machineId: string) => {
        if (!confirm("Are you sure you want to delete this machine?")) return;

        const { error } = await supabase
            .from('machines')
            .delete()
            .eq('id', machineId);

        if (!error) {
            setMachines(machines.filter(m => m.id !== machineId));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);

        let finalImageUrl = vendorProfile.profile_image;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `vendor-profiles/${vendorProfile.id}-${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('machine-images')
                .upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('machine-images')
                    .getPublicUrl(uploadData.path);
                finalImageUrl = publicUrl;
            }
        }

        const { error } = await supabase
            .from('vendors')
            .update({
                company_name: editForm.company_name,
                contact_name: editForm.full_name,
                full_name: editForm.full_name,
                mobile: editForm.mobile,
                mobile_number: editForm.mobile,
                pincode: editForm.pincode,
                profile_image: finalImageUrl
            })
            .eq('id', vendorProfile.id);

        if (!error) {
            setVendorProfile({
                ...vendorProfile,
                ...editForm,
                contact_name: editForm.full_name,
                mobile_number: editForm.mobile,
                profile_image: finalImageUrl
            });
            setIsEditingProfile(false);
        } else {
            console.error("Profile update error:", error);
            alert("Failed to update profile. Make sure the 'profile_image' column exists in your vendors table.");
        }
        setSavingProfile(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openEditMachine = (machine: any) => {
        setEditingMachine(machine);
        setMachineEditForm({
            name: machine.name || '',
            category: machine.category || 'Excavators',
            brand: machine.brand || '',
            registration_plate: machine.registration_plate || '',
            mfg_year: machine.mfg_year?.toString() || '',
            price_hourly: machine.price_hourly?.toString() || '',
            price_daily: (machine.price_daily || machine.price_per_day || machine.price || '').toString(),
            price_monthly: machine.price_monthly?.toString() || '',
            operator_included: machine.operator_included !== false,
            quantity: (machine.quantity || 1).toString(),
            description: machine.description || '',
            location: machine.location || '',
            pincode: machine.location_pincode || ''
        });
    };

    const handleUpdateMachine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMachine) return;
        setSavingMachine(true);

        const { error } = await supabase
            .from('machines')
            .update({
                name: machineEditForm.name,
                category: machineEditForm.category,
                brand: machineEditForm.brand,
                registration_plate: machineEditForm.registration_plate,
                mfg_year: machineEditForm.mfg_year ? parseInt(machineEditForm.mfg_year) : null,
                price_hourly: parseInt(machineEditForm.price_hourly) || 0,
                price_daily: parseInt(machineEditForm.price_daily) || 0,
                price_monthly: parseInt(machineEditForm.price_monthly) || 0,
                price: parseInt(machineEditForm.price_daily) || 0,
                operator_included: machineEditForm.operator_included,
                quantity: parseInt(machineEditForm.quantity) || 1,
                description: machineEditForm.description,
                location: machineEditForm.pincode ? `${machineEditForm.location} - ${machineEditForm.pincode}` : machineEditForm.location
            })
            .eq('id', editingMachine.id);

        if (!error) {
            setMachines(machines.map(m => m.id === editingMachine.id ? { ...m, ...machineEditForm, mfg_year: machineEditForm.mfg_year ? parseInt(machineEditForm.mfg_year) : null, price_hourly: parseInt(machineEditForm.price_hourly) || 0, price_daily: parseInt(machineEditForm.price_daily) || 0, price_monthly: parseInt(machineEditForm.price_monthly) || 0, price: parseInt(machineEditForm.price_daily) || 0, quantity: parseInt(machineEditForm.quantity) || 1, operator_included: machineEditForm.operator_included, location_pincode: machineEditForm.location } : m));
            setEditingMachine(null);
        } else {
            console.error("Machine update error:", error);
            alert("Failed to update machine details.");
        }
        setSavingMachine(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalMachines = machines.length;
    const availableMachines = machines.filter(m => m.status === 'available').length;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <HardHat className="text-primary h-8 w-8" />
                            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                PRIME CONSTRUCTION <span className="text-primary">PARTNER</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {vendorProfile && (
                                <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-3 group">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{vendorProfile.company_name || 'Partner Account'}</span>
                                        <span className="text-xs text-slate-500 font-medium">{vendorProfile.email}</span>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black uppercase tracking-widest border border-primary/20 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                                        {vendorProfile.profile_image ? (
                                            <img src={vendorProfile.profile_image} alt={vendorProfile.company_name} className="w-full h-full object-cover" />
                                        ) : (
                                            vendorProfile.company_name ? vendorProfile.company_name.substring(0, 2) : 'PR'
                                        )}
                                    </div>
                                </button>
                            )}
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:block">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Vendor Status Banner */}
                {vendorProfile && vendorProfile.status !== 'approved' && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-6">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        Your vendor application is currently <span className="uppercase">{vendorProfile.status || 'pending'}</span>. You can still upload machines, but they will be visible to customers only after approval.
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your fleet and track performance.</p>
                    </div>
                    <Link
                        href="/dashboard/upload"
                        className="bg-primary hover:bg-orange-600 text-white font-black py-3 px-6 rounded-xl flex items-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 uppercase tracking-widest text-sm"
                    >
                        <Plus className="h-5 w-5" />
                        Upload Vehicle
                    </Link>
                </div>

                {/* Vendor Identity Card */}
                {vendorProfile && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                        <div className="flex items-center gap-5 z-10 w-full sm:w-auto">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-primary to-orange-600 text-white flex items-center justify-center font-black text-2xl uppercase tracking-widest shadow-lg shadow-primary/30 shrink-0 overflow-hidden">
                                {vendorProfile.profile_image ? (
                                    <img src={vendorProfile.profile_image} alt={vendorProfile.company_name} className="w-full h-full object-cover" />
                                ) : (
                                    vendorProfile.company_name ? vendorProfile.company_name.substring(0, 2) : 'PR'
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{vendorProfile.company_name || 'Setup your profile'}</h2>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><HardHat className="size-3.5 text-primary" /> {vendorProfile.contact_name || vendorProfile.full_name || 'No Name Set'}</span>
                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Activity className="size-3.5 text-primary" /> {vendorProfile.mobile || vendorProfile.mobile_number || 'No Phone'}</span>
                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><MapPin className="size-3.5 text-primary" /> Pincode: {vendorProfile.pincode || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsEditingProfile(true)} className="w-full sm:w-auto z-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all border border-slate-200 dark:border-slate-700 shadow-sm">
                            Edit Profile
                        </button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Machines</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{totalMachines}</p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-xl">
                            <Package className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Available</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{availableMachines}</p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-xl">
                            <Activity className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Account Status</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase">
                                {vendorProfile?.status || 'Pending'}
                            </p>
                        </div>
                        <div className={`p-4 rounded-xl ${vendorProfile?.status === 'approved' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                            <AlertCircle className={`h-8 w-8 ${vendorProfile?.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`} />
                        </div>
                    </div>
                </div>

                {/* Fleet Overview */}
                {machines.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-wide">Your Fleet</h3>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{totalMachines} {totalMachines === 1 ? 'Machine' : 'Machines'}</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {machines.map((machine) => (
                                <div key={machine.id} className="flex items-center gap-4 p-4 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                        <img
                                            src={machine.image || '/images/placeholder-machine.jpg'}
                                            alt={machine.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{machine.name}</h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">{machine.category}</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {machine.location}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <IndianRupee className="h-3 w-3" /> {machine.price}/hr
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${machine.status === 'available'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                            }`}>
                                            {machine.status || 'available'}
                                        </span>
                                        <button
                                            onClick={() => openEditMachine(machine)}
                                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                                            title="Edit Machine"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMachine(machine.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete Machine"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 min-h-[400px]">
                        <Package className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">No fleet uploaded yet</h3>
                        <p className="text-slate-500 text-center max-w-sm mb-6">Start building your catalog to get equipment inquiries from verified customers.</p>
                        <Link
                            href="/dashboard/upload"
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-3 px-8 rounded-xl transition-transform active:scale-[0.98] uppercase tracking-widest text-sm"
                        >
                            Upload First Vehicle
                        </Link>
                    </div>
                )}
            </main>

            {/* Profile Edit Modal */}
            {isEditingProfile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 dark:text-white">Edit Partner Profile</h3>
                            <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                                <Trash2 className="h-4 w-4 hidden" /> {/* Hidden icon trick to preserve space */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="p-6 flex flex-col gap-5">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden relative group cursor-pointer" onClick={() => document.getElementById('profileImageInput')?.click()}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImagePlus className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <input id="profileImageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Upload Logo/Photo</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Company Name</label>
                                <input required value={editForm.company_name} onChange={e => setEditForm({ ...editForm, company_name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-sm text-slate-900 dark:text-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Primary Contact Name</label>
                                <input required value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-sm text-slate-900 dark:text-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Mobile Number</label>
                                <input required type="tel" value={editForm.mobile} onChange={e => setEditForm({ ...editForm, mobile: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-sm text-slate-900 dark:text-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Base Pincode</label>
                                <input required type="text" value={editForm.pincode} onChange={e => setEditForm({ ...editForm, pincode: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-sm text-slate-900 dark:text-white" />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-xs py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={savingProfile} className="flex-1 bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:active:scale-100">
                                    {savingProfile ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Vehicle Modal */}
            {editingMachine && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
                            <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 dark:text-white">Edit Vehicle Info</h3>
                            <button onClick={() => setEditingMachine(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateMachine} className="p-5 flex flex-col gap-4 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Machine Name / Model</label>
                                    <input required value={machineEditForm.name} onChange={e => setMachineEditForm({ ...machineEditForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-medium" placeholder="e.g. 3DX Eco Super" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Category</label>
                                    <select value={machineEditForm.category} onChange={e => setMachineEditForm({ ...machineEditForm, category: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-medium">
                                        <option value="JCBs">JCBs</option>
                                        <option value="Excavators">Excavators</option>
                                        <option value="Cranes">Cranes</option>
                                        <option value="Loaders">Loaders</option>
                                        <option value="Bulldozers">Bulldozers</option>
                                        <option value="Dump Trucks">Dump Trucks / Dumpers</option>
                                        <option value="Compactors">Compactors</option>
                                        <option value="Concrete Equipment">Concrete Equipment</option>
                                        <option value="Generators">Generators</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Brand</label>
                                    <input value={machineEditForm.brand} onChange={e => setMachineEditForm({ ...machineEditForm, brand: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-medium" placeholder="e.g. JCB, TATA" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Vehicle / Reg. No.</label>
                                    <input value={machineEditForm.registration_plate} onChange={e => setMachineEditForm({ ...machineEditForm, registration_plate: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold uppercase" placeholder="e.g. MH12AB1234" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Mfg Year</label>
                                    <input type="number" value={machineEditForm.mfg_year} onChange={e => setMachineEditForm({ ...machineEditForm, mfg_year: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold" placeholder="e.g. 2020" />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1 block mb-3">Charges (₹)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Hourly</span>
                                        <input type="number" value={machineEditForm.price_hourly} onChange={e => setMachineEditForm({ ...machineEditForm, price_hourly: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-black text-center" placeholder="0" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest text-center">Daily</span>
                                        <input type="number" value={machineEditForm.price_daily} onChange={e => setMachineEditForm({ ...machineEditForm, price_daily: e.target.value })} className="w-full bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-black text-center" placeholder="0" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Monthly</span>
                                        <input type="number" value={machineEditForm.price_monthly} onChange={e => setMachineEditForm({ ...machineEditForm, price_monthly: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-black text-center" placeholder="0" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Quantity</label>
                                    <input type="number" min="1" value={machineEditForm.quantity} onChange={e => setMachineEditForm({ ...machineEditForm, quantity: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold" placeholder="1" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Location</label>
                                    <input value={machineEditForm.location} onChange={e => setMachineEditForm({ ...machineEditForm, location: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-medium" placeholder="e.g. Mumbai" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Pincode</label>
                                    <input value={machineEditForm.pincode} onChange={e => { const v = e.target.value; if (v.length <= 6 && /^\d*$/.test(v)) setMachineEditForm({ ...machineEditForm, pincode: v }); }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-bold" placeholder="400069" maxLength={6} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-1">
                                <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 hover:border-primary transition-colors flex-1">
                                    <input type="checkbox" checked={machineEditForm.operator_included} onChange={e => setMachineEditForm({ ...machineEditForm, operator_included: e.target.checked })} className="w-5 h-5 accent-primary rounded cursor-pointer" />
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Operator Included</span>
                                </label>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pl-1">Service Description</label>
                                <textarea value={machineEditForm.description} onChange={e => setMachineEditForm({ ...machineEditForm, description: e.target.value })} rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-medium" placeholder="e.g. Available for excavation, foundation work..." />
                            </div>

                            <div className="pt-3 flex gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => setEditingMachine(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-xs py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={savingMachine} className="flex-1 bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2">
                                    <Save className="h-4 w-4" />
                                    {savingMachine ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

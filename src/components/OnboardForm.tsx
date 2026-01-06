'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Declare Razorpay on window
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function OnboardForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        storeName: '',
        category: 'General',
        whatsapp: '',
        email: '',
        username: '',
        password: '',
        plan: 'monthly',
        // New Fields
        banner_url: '',
        address_full: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    });
    const [error, setError] = useState('');

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // Basic validation for username to prevent spaces/emails
        if (e.target.name === 'username') {
            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
            setFormData({ ...formData, [e.target.name]: val });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleRazorpayPayment = async () => {
        setLoading(true);
        setError('');

        if (!window.Razorpay) {
            setError('Razorpay SDK failed to load. Please check your connection.');
            setLoading(false);
            return;
        }

        const amount = formData.plan === 'monthly' ? 200 : 2000;

        const options = {
            key: "rzp_live_RjWggtvUprVXfJ", // Live Key from User
            amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Flipminis Platform",
            description: `Subscription for ${formData.storeName}`,
            image: "https://example.com/your_logo", // Placeholder
            handler: async function (response: any) {
                await createStore(response.razorpay_payment_id);
            },
            prefill: {
                name: formData.storeName,
                email: formData.email,
                contact: formData.whatsapp
            },
            theme: {
                color: "#2563eb"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
            setError(`Payment Failed: ${response.error.description}`);
            setLoading(false);
        });
        rzp1.open();
    };

    const createStore = async (paymentId: string) => {
        try {
            const res = await fetch('/api/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, paymentId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Success - Redirect to Dashboard
            // The API should handle setting the Auth cookie for auto-login
            router.push(`/dashboard`);
            router.refresh();

        } catch (err: any) {
            setError(err.message);
            setLoading(false); // Only stop loading on error, otherwise we are redirecting
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-3 text-slate-800 dark:text-white tracking-tight">Create Your Flipminis Store</h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm">
                        <span>Step {step} of 4</span>
                        <div className="flex gap-1 ml-2">
                            <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                            <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                            <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                            <div className={`h-2 w-2 rounded-full ${step >= 4 ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 p-8 relative overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/50 flex items-center gap-3 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-6 relative z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">1</span>
                                Store Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 ml-1 text-slate-700 dark:text-slate-200">Store Name</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-lg"
                                        placeholder="e.g. My Awesome Shop"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 ml-1 text-slate-700 dark:text-slate-200">Category</label>
                                    <CategorySelector
                                        selected={formData.category}
                                        onSelect={(cat) => setFormData({ ...formData, category: cat })}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={nextStep}
                                disabled={!formData.storeName}
                                className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Next: Contact Info →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-5 relative z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">2</span>
                                Owner Details
                            </h2>

                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        placeholder="919876543210"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1 ml-1">For order notifications.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">Email Address <span className="text-blue-500 text-xs font-normal">(Login ID)</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">Store URL Handle</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-slate-500 font-medium">flipminis.in/@</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full pl-28 pr-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-mono text-sm tracking-wide text-blue-700 dark:text-blue-400 font-bold"
                                            placeholder="my-shop"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 ml-1">Unique store link.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button onClick={prevStep} className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!formData.whatsapp || !formData.email || !formData.username || !formData.password}
                                    className="flex-[2] py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Next: Location →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-5 relative z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">3</span>
                                Location & Branding
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">Full Address</label>
                                    <textarea
                                        name="address_full"
                                        value={formData.address_full}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm resize-none"
                                        rows={3}
                                        placeholder="Shop No, Street, Landmark..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 mt-2">
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-200">Banner Image URL (Optional)</label>
                                    <input
                                        type="url"
                                        name="banner_url"
                                        value={formData.banner_url}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button onClick={prevStep} className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="flex-[2] py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Next: Select Plan →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col gap-6 relative z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">4</span>
                                Select Plan
                            </h2>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div
                                    onClick={() => setFormData({ ...formData, plan: 'monthly' })}
                                    className={`cursor-pointer border-2 rounded-2xl p-5 text-center transition-all duration-200 ${formData.plan === 'monthly' ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 scale-105 shadow-xl ring-2 ring-blue-500 ring-opacity-50' : 'border-slate-200 dark:border-slate-700 bg-white/40 hover:border-blue-300 hover:bg-white/60'}`}
                                >
                                    <div className="font-bold text-lg mb-1 text-slate-800 dark:text-white">Monthly</div>
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">₹200</div>
                                    <div className="text-xs text-slate-500 font-medium mt-1">per month</div>
                                </div>
                                <div
                                    onClick={() => setFormData({ ...formData, plan: 'yearly' })}
                                    className={`cursor-pointer border-2 rounded-2xl p-4 text-center transition-all duration-200 relative overflow-hidden ${formData.plan === 'yearly' ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 scale-105 shadow-xl ring-2 ring-blue-500 ring-opacity-50' : 'border-slate-200 dark:border-slate-700 bg-white/40 hover:border-blue-300 hover:bg-white/60'}`}
                                >
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold shadow-sm">SAVE ₹400</div>
                                    <div className="font-bold text-lg mb-1 text-slate-800 dark:text-white">Yearly</div>
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">₹2000</div>
                                    <div className="text-xs text-slate-500 font-medium mt-1">per year</div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button onClick={prevStep} className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={handleRazorpayPayment}
                                    disabled={loading}
                                    className="flex-[2] py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay <span className="underline decoration-white/30 decoration-2 underline-offset-2">₹{formData.plan === 'monthly' ? '200' : '2000'}</span> & Launch 🚀
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-center text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-500">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                                Secure payment via Razorpay.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function CategorySelector({ selected, onSelect }: { selected: string, onSelect: (cat: string) => void }) {
    const [categories, setCategories] = useState<string[]>(['General', 'Fashion', 'Apparel', 'Electronics', 'Food', 'Grocery', 'Health', 'Services']);
    const [customCat, setCustomCat] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCats() {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    if (data.categories && data.categories.length > 0) {
                        setCategories(data.categories);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        }
        fetchCats();
    }, []);

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomCat(e.target.value);
        if (e.target.value.trim()) {
            onSelect(e.target.value.trim()); // Capitalize/Format if needed
        }
    };

    const handlePillClick = (cat: string) => {
        setIsCustom(false);
        onSelect(cat);
    };

    const handleCustomClick = () => {
        setIsCustom(true);
        onSelect(customCat || '');
    };

    // Filter categories to show top popular + alphabetized, limit to 8-10 visible to save space?
    // For now, show all but maybe scrollable container if too many used in future
    const displayCategories = categories.slice(0, 10);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {displayCategories.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => handlePillClick(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${selected === cat && !isCustom
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200 dark:ring-blue-900'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:text-blue-500'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={handleCustomClick}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${isCustom
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200 dark:ring-blue-900'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:text-blue-500'
                        }`}
                >
                    + Custom
                </button>
            </div>

            {isCustom && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                        type="text"
                        value={customCat}
                        onChange={handleCustomChange}
                        placeholder="Type your category (e.g. Handmade Crafts)"
                        className="w-full px-5 py-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800 dark:text-white"
                        autoFocus
                    />
                    <p className="text-xs text-slate-500 mt-1 ml-1">This will be added to the public category list.</p>
                </div>
            )}
        </div>
    );
}

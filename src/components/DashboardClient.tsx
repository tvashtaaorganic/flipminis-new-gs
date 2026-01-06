'use client';

import React, { useState, useEffect } from 'react';
import { Product, Store } from '@/types';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './DashboardSidebar';

interface Props {
    initialProducts: Product[];
    store: Store;
}

interface FormData {
    name: string;
    category: string;
    images: string[];
    price: string;
    offerPrice: string;
    stock: string;
    hasVariants: boolean;
    variantType: string;
    variants: Array<{ name: string; price: string; offerPrice: string; stock: string }>;
    active: boolean;
    description: string;
    metaTitle: string;
    metaDescription: string;
    isTrending: boolean;
    variantType2?: string; // Secondary variant type
    hasDoubleVariant?: boolean;
}

export default function DashboardClient({ initialProducts, store }: Props) {
    const router = useRouter();
    const [activeView, setActiveView] = useState('overview');
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    // Subscription Logic
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (store.subscription_end) {
            const end = new Date(store.subscription_end);
            const now = new Date();
            const diffTime = end.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(diffDays);
        }
    }, [store.subscription_end]);


    // Form State (Reused)
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '', category: 'General', images: [''], price: '', offerPrice: '', stock: '10',
        hasVariants: false, variantType: 'Size', variantType2: 'Color', hasDoubleVariant: false, variants: [{ name: '', price: '', offerPrice: '', stock: '10' }],
        active: true, description: '', metaTitle: '', metaDescription: '', isTrending: false,
    });

    // Settings Form State
    const [settingsForm, setSettingsForm] = useState<Store>(store);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        setSettingsForm(store);
    }, [store]);

    const handleSaveSettings = async () => {
        setLoading(true);
        setSuccessMessage(false);
        try {
            const res = await fetch('/api/dashboard/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ store: settingsForm })
            });

            if (res.ok) {
                setSuccessMessage(true);
                router.refresh();
                setTimeout(() => setSuccessMessage(false), 3000);
            } else {
                const data = await res.json();
                alert(`Failed to save settings: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Error saving settings. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Category Logic
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

    // Auto SEO Logic
    useEffect(() => {
        if (formData.name && !formData.metaTitle) {
            setFormData(prev => ({ ...prev, metaTitle: prev.name }));
        }
        if (formData.description && !formData.metaDescription) {
            setFormData(prev => ({ ...prev, metaDescription: prev.description.substring(0, 160) }));
        }
    }, [formData.name, formData.description]);

    const resetForm = () => {
        setFormData({
            name: '', category: 'General', images: [''], price: '', offerPrice: '', stock: '10',
            hasVariants: false, variantType: 'Size', variants: [{ name: '', price: '', offerPrice: '', stock: '10' }],
            active: true, description: '', metaTitle: '', metaDescription: '', isTrending: false,
        });
        setEditingId(null);
    };

    const handleViewChange = (view: string) => {
        if (view === 'add_product') resetForm();
        setActiveView(view);
    };

    const handleEditClick = (p: Product) => {
        setEditingId(p.product_id);
        const isDouble = p.variant_type && p.variant_type.includes(' - ');
        const [t1, t2] = isDouble && p.variant_type ? p.variant_type.split(' - ') : [p.variant_type || 'Size', 'Color'];

        setFormData({
            name: p.name,
            category: p.category,
            images: p.images && p.images.length > 0 ? p.images : [''],
            price: p.price.toString(),
            offerPrice: p.offer_price ? p.offer_price.toString() : '',
            stock: p.stock.toString(),
            hasVariants: p.has_variants,
            variantType: t1,
            variantType2: t2,
            hasDoubleVariant: !!isDouble,
            variants: p.variants && p.variants.length > 0 ? p.variants.map(v => ({
                name: v.name,
                price: v.price?.toString() || '',
                offerPrice: v.offer_price?.toString() || '',
                stock: v.stock?.toString() || '0'
            })) : [{ name: '', price: '', offerPrice: '', stock: '10' }],
            active: p.active,
            description: p.description || '',
            metaTitle: p.meta_title || '',
            metaDescription: p.meta_description || '',
            isTrending: p.is_trending || false,
        });
        setActiveView('add_product');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSyncAnalytics = async () => {
        setSyncing(true);
        setSyncSuccess(false);
        try {
            const res = await fetch('/api/cron');
            if (res.ok) {
                setSyncSuccess(true);
                router.refresh();
                setTimeout(() => setSyncSuccess(false), 3000);
            } else {
                alert('Sync failed. Please try again.');
            }
        } catch (e) {
            console.error(e);
            alert('Error syncing analytics.');
        } finally {
            setSyncing(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const validImages = formData.images.filter(img => img.trim() !== '');
        const payload = {
            product_id: editingId,
            name: formData.name,
            category: formData.category,
            image_url: validImages[0] || '',
            images: validImages,
            price: formData.hasVariants ? 0 : Number(formData.price),
            offer_price: formData.hasVariants ? 0 : (formData.offerPrice ? Number(formData.offerPrice) : undefined),
            stock: formData.hasVariants ? 0 : Number(formData.stock),
            has_variants: formData.hasVariants,
            variant_type: formData.hasVariants ? (formData.hasDoubleVariant ? `${formData.variantType} - ${formData.variantType2}` : formData.variantType) : undefined,
            variants: formData.hasVariants ? formData.variants.map(v => ({
                name: v.name,
                price: parseFloat(v.price) || 0,
                offer_price: parseFloat(v.offerPrice) || undefined,
                stock: parseInt(v.stock) || 0
            })) : undefined,
            active: formData.active,
            description: formData.description,
            meta_title: formData.metaTitle,
            meta_description: formData.metaDescription,
            is_trending: formData.isTrending,
        };

        try {
            const res = await fetch('/api/products', {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                resetForm();
                router.refresh();
                setActiveView('products');
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving product');
        } finally {
            setLoading(false);
        }
    };

    // Helper functions for form updates
    const handleAutoMeta = () => {
        if (!formData.description) return;

        // Smart "AI-like" formatting: Flatten multilines, remove empty lines, truncate
        const cleanDesc = formData.description
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(', '); // Join with comma and space for readability

        const truncated = cleanDesc.length > 157 ? cleanDesc.substring(0, 157) + '...' : cleanDesc;
        setFormData(prev => ({ ...prev, metaDescription: truncated }));
    };

    const updateVariant = (idx: number, field: string, val: string) => {
        const newVars = [...formData.variants];
        newVars[idx] = { ...newVars[idx], [field]: val };
        setFormData({ ...formData, variants: newVars });
    };
    const addVariantRow = () => setFormData({ ...formData, variants: [...formData.variants, { name: '', price: '', offerPrice: '', stock: '10' }] });
    const removeVariant = (idx: number) => { if (formData.variants.length > 1) setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== idx) }) };

    // Image Handlers
    const handleAddImage = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleQuickStatusToggle = async () => {
        // Toggle based on settingsForm, NOT formData
        const currentStatus = settingsForm.is_open !== false; // handle null/undefined as true
        const newStatus = !currentStatus;

        // Optimistic UI update
        const newSettings = { ...settingsForm, is_open: newStatus };
        setSettingsForm(newSettings);

        try {
            const res = await fetch('/api/dashboard/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ store: newSettings })
            });

            if (res.ok) {
                router.refresh();
            } else {
                setSettingsForm(settingsForm); // Revert to old state
                console.error("Failed to toggle status");
            }
        } catch (e) {
            setSettingsForm(settingsForm); // Revert
            console.error(e);
        }
    };

    // --- Views ---

    const OverviewView = () => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Store Status:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settingsForm.is_open !== false}
                            onChange={handleQuickStatusToggle}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {settingsForm.is_open !== false ? 'Open' : 'Closed'}
                        </span>
                    </label>
                </div>
            </div>

            {/* Subscription Card */}
            <div className={`p-6 rounded-2xl border ${daysRemaining !== null && daysRemaining <= 5 ? 'bg-red-50 border-red-200' : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white'}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className={`text-lg font-bold ${daysRemaining !== null && daysRemaining <= 5 ? 'text-red-700' : 'text-white'}`}>Store Subscription</h3>
                        <p className={`text-sm opacity-90 ${daysRemaining !== null && daysRemaining <= 5 ? 'text-red-600' : 'text-blue-100'}`}>
                            {store.subscription_start ? `Started: ${store.subscription_start}` : 'Start Date: N/A'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-extrabold">
                            {daysRemaining !== null ? (daysRemaining > 0 ? daysRemaining : 0) : '--'}
                        </div>
                        <div className="text-xs uppercase tracking-wide opacity-80 font-bold">Days Remaining</div>
                    </div>
                </div>
                {/* Expiry Warning & Renewal */}
                {daysRemaining !== null && daysRemaining <= 5 && (
                    <div className="mt-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                        <div className="font-bold text-sm mb-3">
                            {daysRemaining <= 0 ? '⚠️ Your subscription has expired. Store is Hidden.' : '⚠️ Subscription ending soon.'}
                        </div>
                        <a
                            href="https://razorpay.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-white text-blue-600 font-bold py-2.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            {daysRemaining <= 0 ? 'Pay Now to Reactivate' : 'Renew Subscription'}
                        </a>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Products</div>
                    <div className="text-2xl font-extrabold text-slate-800 dark:text-white">{products.length}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Views</div>
                    <div className="text-2xl font-extrabold text-blue-600">{store.view_count || 0}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">WhatsApp Clicks</div>
                    <div className="text-2xl font-extrabold text-green-600">{store.whatsapp_click_count || 0}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Product Enquiries</div>
                    <div className="text-2xl font-extrabold text-purple-600">
                        {products.reduce((acc, p) => acc + (p.enquiry_count || 0), 0)}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveView('add_product')}
                    className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                    + Add New Product
                </button>
                <button
                    onClick={handleSyncAnalytics}
                    disabled={syncing}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                    {syncing ? 'Syncing...' : syncSuccess ? 'Synced! ✅' : '↻ Sync Latest Stats'}
                </button>
            </div>
        </div>
    );

    const AnalyticsView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics <span className="text-sm font-normal text-slate-500 ml-2">(Lifetime Stats)</span></h2>
                {/* <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-600">
                    <option value="all">Lifetime</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="month">Last 30 Days</option>
                </select> */}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <div className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">Store Views</div>
                    <div className="text-2xl font-black mt-1">{store.view_count || 0}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-800">
                    <div className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">Store WA Clicks</div>
                    <div className="text-2xl font-black mt-1">{store.whatsapp_click_count || 0}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-800">
                    <div className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase">Product Enquiries</div>
                    <div className="text-2xl font-black mt-1">
                        {products.reduce((acc, p) => acc + (p.enquiry_count || 0), 0)}
                    </div>
                </div>
                {/* Placeholders for future calculated metrics */}
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 opacity-60">
                    <div className="text-slate-500 text-xs font-bold uppercase">Conversion Rate</div>
                    <div className="text-2xl font-black mt-1">--%</div>
                </div>
            </div>

            {/* Product Performance Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 font-bold">Top Products</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-5 py-3">Product</th>
                                <th className="px-5 py-3">Views</th>
                                <th className="px-5 py-3">Enquiries</th>
                                <th className="px-5 py-3">Trending</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {[...products].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 10).map(p => (
                                <tr key={p.product_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">{p.name}</td>
                                    <td className="px-5 py-3 text-blue-600 font-bold">{p.view_count || 0}</td>
                                    <td className="px-5 py-3 text-green-600 font-bold">{p.enquiry_count || 0}</td>
                                    <td className="px-5 py-3">{p.is_trending ? '🔥' : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const ProductsView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Products</h2>
                <button onClick={() => setActiveView('add_product')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-sm">+ Add New</button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map(product => (
                    <div key={product.product_id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all flex flex-col hover:-translate-y-1 overflow-hidden">
                        <div className="aspect-square bg-white relative border-b border-slate-100 overflow-hidden">
                            {product.image_url ? (
                                <img src={product.image_url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt={product.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button onClick={() => handleEditClick(product)} className="bg-white p-2 rounded-full text-blue-600 hover:text-blue-700 shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="flex flex-col mb-2">
                                <h3 className="font-bold text-slate-800 line-clamp-1 mb-1" title={product.name}>{product.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 text-lg">
                                        {product.has_variants && product.variants && product.variants.length > 0 ? (() => {
                                            const prices = product.variants.map(v => Number(v.offer_price || v.price || 0));
                                            const min = Math.min(...prices);
                                            const max = Math.max(...prices);
                                            return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
                                        })() : `₹${product.offer_price || product.price}`}
                                    </span>
                                    {(!product.has_variants && Number(product.offer_price) > 0 && Number(product.offer_price) < Number(product.price)) && (
                                        <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 mb-4 font-medium">
                                <span className="inline-block bg-slate-100 px-2 py-1 rounded-md mr-2">{product.category}</span>
                                <span className={`${(product.has_variants ? product.variants?.reduce((acc, v) => acc + Number(v.stock || 0), 0) : Number(product.stock)) === 0 ? 'text-red-500 font-bold' : 'text-slate-600'}`}>
                                    Stock: {product.has_variants ? product.variants?.reduce((acc, v) => acc + Number(v.stock || 0), 0) : product.stock}
                                </span>
                            </div>
                            <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100">
                                <div className="flex gap-3 text-xs font-bold text-slate-400">
                                    <span title="Total Views">👁 {product.view_count || 0}</span>
                                    <span title="Total Enquiries">💬 {product.enquiry_count || 0}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.active ? 'Active' : 'Hidden'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)]">
            <DashboardSidebar
                activeView={activeView}
                setActiveView={handleViewChange}
                storeName={store.store_name}
                username={store.username}
            />

            <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto mt-16 md:mt-0">
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Header with Title & actions */}
                    {activeView === 'overview' && <OverviewView />}
                    {activeView === 'products' && <ProductsView />}
                    {activeView === 'add_product' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleAddProduct} className="space-y-8 max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                {/* Basic Details */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700">Product Name</label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Cotton T-Shirt" required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {uniqueCategories.map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, category: cat })}
                                                    className={`px-4 py-2 rounded-full text-sm font-bold border ${formData.category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: '' })} // Clear to trigger custom input view logic if we had separate mode, but here we just check value
                                                className={`px-4 py-2 rounded-full text-sm font-bold border ${!uniqueCategories.includes(formData.category) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:border-blue-300'}`}
                                            >
                                                + Custom / New
                                            </button>
                                        </div>
                                        {/* Show input if category is not in the existing list OR if user wants to type specific new one */}
                                        {(!uniqueCategories.includes(formData.category) || formData.category === '') && (
                                            <input
                                                type="text"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all animate-in fade-in slide-in-from-top-1"
                                                placeholder="Type New Category Name..."
                                                autoFocus
                                                required
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Images Section */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-slate-700">Product Images</label>
                                    <div className="space-y-3">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="flex gap-3 items-center">
                                                {/* Thumbnail Preview */}
                                                <div className="w-14 h-14 shrink-0 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                                                    {img ? (
                                                        <img src={img} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                    ) : (
                                                        <span className="text-xl">🖼️</span>
                                                    )}
                                                </div>
                                                <input
                                                    type="url"
                                                    value={img}
                                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="https://image-url.com/..."
                                                />
                                                {formData.images.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveImage(index)} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={handleAddImage} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 px-2 py-1">
                                        + Add Another Image URL
                                    </button>

                                    {/* Image Upload Helper */}
                                    <div className="mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-sm font-bold text-slate-700 mb-3">How to Upload & Get Image Link?</p>
                                        <div className="text-xs text-slate-500 mb-4 space-y-1.5 font-medium">
                                            <p>1. Click the button below to go to <strong>Cloudinary</strong>.</p>
                                            <p>2. Login or Sign up for a free account.</p>
                                            <p>3. Upload your product image there.</p>
                                            <p>4. Copy the <strong>"URL"</strong> of the uploaded image.</p>
                                            <p>5. Paste the link in the box above.</p>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <a
                                                href="https://cloudinary.com/console/media_library/folders/all"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-blue-200 shadow-sm"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
                                                Go to Cloudinary & Upload
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 outline-none" placeholder=" Detailed product description..." />
                                </div>

                                {/* Output & SEO */}
                                <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase text-slate-500">SEO Meta Title</label>
                                        <input type="text" value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" placeholder="Specific title for Google Search" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-xs font-bold uppercase text-slate-500">SEO Meta Description</label>
                                            <button
                                                type="button"
                                                onClick={handleAutoMeta}
                                                className="text-xs font-bold text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                                                title="Generate from Description"
                                            >
                                                ✨ Auto-Fill
                                            </button>
                                        </div>
                                        <input type="text" value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" placeholder="Short summary for search results" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" checked={formData.isTrending} onChange={e => setFormData({ ...formData, isTrending: e.target.checked })} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                        <label className="font-bold text-slate-700">Mark as Trending / Hot 🔥</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                                        <label className="font-bold text-slate-700">Product Active (Visible)</label>
                                    </div>
                                </div>

                                {/* Pricing & Variants */}
                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-slate-800">Pricing & Variants</h3>
                                        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full">
                                            <input type="checkbox" checked={formData.hasVariants} onChange={e => setFormData({ ...formData, hasVariants: e.target.checked })} className="w-5 h-5 text-blue-600" />
                                            <label className="font-bold text-sm text-slate-700">This product has variants</label>
                                        </div>
                                    </div>

                                    {!formData.hasVariants ? (
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-slate-500">Regular Price (₹)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.price}
                                                    onChange={e => (parseFloat(e.target.value) >= 0 || e.target.value === '') && setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold"
                                                    placeholder="0"
                                                    required={!formData.hasVariants}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-slate-500">Offer Price (₹)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.offerPrice}
                                                    onChange={e => (parseFloat(e.target.value) >= 0 || e.target.value === '') && setFormData({ ...formData, offerPrice: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-green-600"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-slate-500">Stock Qty</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.stock}
                                                    onChange={e => (parseFloat(e.target.value) >= 0 || e.target.value === '') && setFormData({ ...formData, stock: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold"
                                                    placeholder="10"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Variant Type Selection */}
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-4 items-center">
                                                    <label className="text-sm font-bold text-slate-700 mr-2">Variant 1:</label>
                                                    {['Size', 'Color', 'Material', 'Weight'].map(type => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, variantType: type })}
                                                            className={`px-4 py-2 rounded-full text-sm font-bold border ${formData.variantType === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, variantType: 'Custom' })}
                                                            className={`px-4 py-2 rounded-full text-sm font-bold border ${!['Size', 'Color', 'Material', 'Weight'].includes(formData.variantType) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                                        >
                                                            Custom
                                                        </button>
                                                        {!['Size', 'Color', 'Material', 'Weight'].includes(formData.variantType) && (
                                                            <input type="text" value={formData.variantType === 'Custom' ? '' : formData.variantType} onChange={e => setFormData({ ...formData, variantType: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-32" placeholder="Type Name" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Double Variant Toggle */}
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.hasDoubleVariant}
                                                        onChange={e => setFormData({ ...formData, hasDoubleVariant: e.target.checked })}
                                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                                    />
                                                    <label className="text-sm font-bold text-slate-700">Add Second Variant (e.g. Size + Color)</label>
                                                </div>

                                                {/* Variant 2 Selection */}
                                                {formData.hasDoubleVariant && (
                                                    <div className="flex flex-wrap gap-4 items-center bg-purple-50 p-3 rounded-xl border border-purple-100">
                                                        <label className="text-sm font-bold text-slate-700 mr-2">Variant 2:</label>
                                                        {['Color', 'Size', 'Material', 'Style'].map(type => (
                                                            <button
                                                                key={type}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, variantType2: type })}
                                                                className={`px-4 py-2 rounded-full text-sm font-bold border ${formData.variantType2 === type ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                        <input
                                                            type="text"
                                                            value={['Color', 'Size', 'Material', 'Style'].includes(formData.variantType2 || '') ? '' : formData.variantType2}
                                                            onChange={e => setFormData({ ...formData, variantType2: e.target.value })}
                                                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-32 bg-white"
                                                            placeholder="Custom..."
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="overflow-hidden border border-slate-200 rounded-xl">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left">{formData.variantType}</th>
                                                            {formData.hasDoubleVariant && <th className="px-4 py-3 text-left">{formData.variantType2 || 'Variant 2'}</th>}
                                                            <th className="px-4 py-3 text-left">Price</th>
                                                            <th className="px-4 py-3 text-left">Offer Price</th>
                                                            <th className="px-4 py-3 text-left">Stock</th>
                                                            <th className="px-4 py-3"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {formData.variants.map((v, i) => {
                                                            const parts = v.name.includes(' - ') ? v.name.split(' - ') : [v.name, ''];
                                                            const val1 = parts[0] || '';
                                                            const val2 = parts.length > 1 ? parts.slice(1).join(' - ') : '';

                                                            return (
                                                                <tr key={i} className="bg-white">
                                                                    <td className="p-2">
                                                                        <input
                                                                            placeholder={`e.g. ${formData.variantType === 'Size' ? 'XL' : 'Red'}`}
                                                                            value={val1}
                                                                            onChange={e => {
                                                                                const newVal = formData.hasDoubleVariant ? `${e.target.value} - ${val2}` : e.target.value;
                                                                                updateVariant(i, 'name', newVal);
                                                                            }}
                                                                            className="w-full p-2 border border-slate-200 rounded-lg"
                                                                        />
                                                                    </td>
                                                                    {formData.hasDoubleVariant && (
                                                                        <td className="p-2">
                                                                            <input
                                                                                placeholder={`e.g. ${formData.variantType2 === 'Color' ? 'Red' : 'Option'}`}
                                                                                value={val2}
                                                                                onChange={e => {
                                                                                    const newVal = `${val1} - ${e.target.value}`;
                                                                                    updateVariant(i, 'name', newVal);
                                                                                }}
                                                                                className="w-full p-2 border border-slate-200 rounded-lg bg-purple-50/50 border-purple-100"
                                                                            />
                                                                        </td>
                                                                    )}
                                                                    <td className="p-2"><input type="number" min="0" placeholder="0" value={v.price} onChange={e => (parseFloat(e.target.value) >= 0 || e.target.value === '') && updateVariant(i, 'price', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg" /></td>
                                                                    <td className="p-2"><input type="number" min="0" placeholder="0" value={v.offerPrice} onChange={e => (parseFloat(e.target.value) >= 0 || e.target.value === '') && updateVariant(i, 'offerPrice', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-green-600" /></td>
                                                                    <td className="p-2"><input type="number" min="0" placeholder="10" value={v.stock} onChange={e => (parseFloat(e.target.value) >= 0 || e.target.value === '') && updateVariant(i, 'stock', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg" /></td>
                                                                    <td className="p-2 text-center">
                                                                        <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">🗑️</button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <div className="p-3 bg-slate-50 border-t border-slate-100">
                                                    <button type="button" onClick={addVariantRow} className="w-full py-2 border-2 border-dashed border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">+ Add Variant Row</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-slate-100">
                                    <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5">{loading ? 'Saving Product...' : 'Save Product'}</button>
                                    <button type="button" onClick={() => { resetForm(); setActiveView('products'); }} className="px-8 py-4 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeView === 'analytics' && <AnalyticsView />}
                    {activeView === 'settings' && (
                        <div className="max-w-4xl mx-auto pb-20">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">⚙️</span>
                                    Store Settings
                                </h2>
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={loading}
                                    className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${successMessage ? 'bg-green-500 text-white shadow-green-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : successMessage ? (
                                        <>Saved! ✅</>
                                    ) : (
                                        <>Save Changes</>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Section 1: Store Profile */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Store Profile
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Store Name</label>
                                            <input
                                                type="text"
                                                value={settingsForm.store_name}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, store_name: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">WhatsApp Number</label>
                                            <input
                                                type="text"
                                                value={settingsForm.whatsapp}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                                            <input
                                                type="text"
                                                value={settingsForm.category}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, category: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Store Status</label>
                                            <div className="flex items-center gap-4 py-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={settingsForm.is_open !== false}
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, is_open: e.target.checked })}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        {settingsForm.is_open !== false ? 'Open for Business' : 'Temporarily Closed'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Location */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Location & Address
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Full Address</label>
                                            <textarea
                                                value={settingsForm.address_full || ''}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, address_full: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all resize-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">City</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.city || ''}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">State</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.state || ''}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, state: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Country</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.country || ''}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, country: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Pincode</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.pincode || ''}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, pincode: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Appearance */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Appearance
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Banner Image URL</label>
                                            <p className="text-xs text-slate-500 mb-2">
                                                Paste the direct link to your banner image here. The image should be hosted publicly.
                                            </p>
                                            <div className="flex gap-4">
                                                <input
                                                    type="url"
                                                    value={settingsForm.banner_url || ''}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, banner_url: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                                    placeholder="https://..."
                                                />
                                            </div>

                                            {/* Image Upload Helper */}
                                            <div className="mt-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">How to Upload & Get Image Link?</p>
                                                <div className="text-xs text-slate-500 mb-4 space-y-1.5 font-medium">
                                                    <p>1. Click the button below to go to <strong>Cloudinary</strong>.</p>
                                                    <p>2. Login or Sign up for a free account.</p>
                                                    <p>3. Upload your banner image there.</p>
                                                    <p>4. Copy the <strong>"URL"</strong> of the uploaded image.</p>
                                                    <p>5. Paste the link in the <strong>"Banner Image URL"</strong> box above.</p>
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    <a
                                                        href="https://cloudinary.com/console/media_library/folders/all"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-blue-200 shadow-sm"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
                                                        Go to Cloudinary & Upload
                                                    </a>
                                                </div>
                                            </div>
                                            {settingsForm.banner_url && (
                                                <div className="mt-4 w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 relative">
                                                    <img src={settingsForm.banner_url} alt="Store Banner" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Configuration */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                        Configuration
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Response Time Text</label>
                                            <input
                                                type="text"
                                                value={settingsForm.response_time || ''}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, response_time: e.target.value })}
                                                placeholder="e.g. Replies within 2 hours"
                                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">WhatsApp Message Template</label>
                                            <p className="text-xs text-slate-500 mb-2">Use {'{{product}}'}, {'{{price}}'}, {'{{link}}'} as placeholders.</p>
                                            <textarea
                                                value={settingsForm.whatsapp_template || ''}
                                                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_template: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

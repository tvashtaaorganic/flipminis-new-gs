'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Store, Product } from '@/types';
import StoreCard from '@/components/StoreCard';

interface ShopClientProps {
    stores: Store[];
    products: Product[];
}

export default function ShopClient({ stores, products }: ShopClientProps) {
    const [inputSearchQuery, setInputSearchQuery] = useState('');
    const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

    const handleSearch = () => {
        setAppliedSearchQuery(inputSearchQuery);
    };

    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedCity, setSelectedCity] = useState('All Cities');

    // 1. Get Unique Categories & Cities
    const categories = useMemo(() => {
        const unique = new Set(stores.map(s => s.category).filter(Boolean));
        return ['All Categories', ...Array.from(unique)];
    }, [stores]);

    const cities = useMemo(() => {
        const unique = new Set(stores.map(s => s.city).filter(Boolean));
        return ['All Cities', ...Array.from(unique)];
    }, [stores]);

    // 2. Filter Logic
    const filteredStores = useMemo(() => {
        return stores.filter(store => {
            const matchCategory = selectedCategory === 'All Categories' || store.category === selectedCategory;
            const matchCity = selectedCity === 'All Cities' || (store.city && store.city.toLowerCase() === selectedCity.toLowerCase());

            const query = appliedSearchQuery.toLowerCase();
            const matchSearch = !query ||
                store.store_name.toLowerCase().includes(query) ||
                store.category.toLowerCase().includes(query) ||
                (store.city && store.city.toLowerCase().includes(query)) ||
                // Also search in products of this store
                products.some(p => p.store_id === store.store_id && p.name.toLowerCase().includes(query));

            return matchCategory && matchCity && matchSearch;
        });
    }, [stores, products, selectedCategory, selectedCity, appliedSearchQuery]);

    // 3. Stats
    const totalStores = stores.length;
    const totalProducts = products.length;
    const verifiedStores = stores.filter(s => s.verified).length;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">

            {/* Blue Banner Section */}
            <div className="bg-blue-600 w-full py-16 px-4 text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 relative z-10">
                    Create Your Online Store - Sell via WhatsApp
                </h1>
                <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10">
                    Build your complete online business in minutes with professional tools. Simplify ordering. Boost sales.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative z-10">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                        className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden p-1"
                    >
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search stores, products, or cities..."
                                className="w-full py-3 px-4 pl-12 text-slate-800 placeholder-slate-400 focus:outline-none text-lg bg-transparent"
                                value={inputSearchQuery}
                                onChange={(e) => setInputSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 text-white relative z-10">
                    <div className="text-center">
                        <div className="text-3xl font-bold">{totalStores}+</div>
                        <div className="text-sm text-blue-200">Active Stores</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{totalProducts}+</div>
                        <div className="text-sm text-blue-200">Products</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{verifiedStores}+</div>
                        <div className="text-sm text-blue-200">Verified Stores</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md p-6 md:p-8 min-h-[500px]">

                    {/* Filters */}
                    <div className="flex flex-col gap-6 mb-8">
                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* City Dropdown */}
                        <div className="flex items-center gap-4">
                            <div className="relative min-w-[200px]">
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="appearance-none w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2.5 pl-10 pr-8 rounded-xl focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 ml-auto">
                                Showing {filteredStores.length} stores
                            </div>
                        </div>
                    </div>

                    {/* Store Grid */}
                    {filteredStores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filteredStores.map(store => (
                                <StoreCard key={store.store_id} store={store} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No stores found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Products Section */}
            {products.length > 0 && appliedSearchQuery === '' && selectedCategory === 'All Categories' && selectedCity === 'All Cities' && (
                <section className="container mx-auto px-4 py-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Featured Products</h2>
                        <p className="text-slate-500">Handpicked items just for you</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {products.slice(0, 12).map(product => {
                            const store = stores.find(s => s.store_id === product.store_id);

                            // Calculate Discount Logic
                            let discount = 0;
                            if (product.has_variants && product.variants?.length) {
                                discount = Math.max(...product.variants.map(v => v.offer_price ? Math.round(((v.price - v.offer_price) / v.price) * 100) : 0));
                            } else if (product.offer_price && product.offer_price < product.price) {
                                discount = Math.round(((product.price - product.offer_price) / product.price) * 100);
                            }

                            return (
                                <Link
                                    key={product.product_id}
                                    href={`/${store?.username}/p/${product.product_id}`}
                                    className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="aspect-square relative bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center p-2">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-300 text-xs">No Image</div>
                                        )}
                                        {/* Discount Badge */}
                                        {discount > 0 && (
                                            <div className="absolute top-0 left-0 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm z-10">
                                                {discount}% OFF
                                            </div>
                                        )}
                                        {/* Hot Badge */}
                                        {product.is_trending && (
                                            <div className="absolute top-0 right-0 p-1">
                                                <div className="bg-orange-100 text-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200">
                                                    Hot
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2.5 flex flex-col flex-grow">
                                        <h3 className="font-medium text-xs md:text-sm text-slate-800 dark:text-white line-clamp-2 mb-1.5 leading-[1.3] min-h-[2.6em] group-hover:text-blue-600 transition-colors">{product.name}</h3>

                                        <div className="mt-auto pt-1.5 border-t border-dashed border-slate-100 dark:border-slate-800">
                                            <div className="flex flex-col gap-0.5">
                                                {product.has_variants ? (
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                                                            ₹{Math.min(...(product.variants?.map(v => v.offer_price || v.price) || [0]))}
                                                        </span>
                                                        <span className="text-[10px] text-blue-600 font-semibold">+Options</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {product.offer_price && product.offer_price < product.price ? (
                                                            <div className="flex flex-col leading-none">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-bold text-sm text-slate-900 dark:text-white">₹{product.offer_price}</span>
                                                                    <span className="text-[10px] text-slate-400 line-through">₹{product.price}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-sm text-slate-900 dark:text-white">₹{product.price}</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Search Results: Products */}
            {products.length > 0 && appliedSearchQuery !== '' && (
                <section className="container mx-auto px-4 py-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Matching Products</h2>
                        <p className="text-slate-500">Products matching "{appliedSearchQuery}"</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {products
                            .filter(p => p.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) && p.active)
                            .slice(0, 12)
                            .map(product => {
                                const store = stores.find(s => s.store_id === product.store_id);

                                // Calculate Discount Logic
                                let discount = 0;
                                if (product.has_variants && product.variants?.length) {
                                    discount = Math.max(...product.variants.map(v => v.offer_price ? Math.round(((v.price - v.offer_price) / v.price) * 100) : 0));
                                } else if (product.offer_price && product.offer_price < product.price) {
                                    discount = Math.round(((product.price - product.offer_price) / product.price) * 100);
                                }

                                return (
                                    <Link
                                        key={product.product_id}
                                        href={`/${store?.username}/p/${product.product_id}`}
                                        className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 dark:border-slate-800"
                                    >
                                        <div className="aspect-square relative bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center p-2">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300 text-xs">No Image</div>
                                            )}
                                            {/* Discount Badge */}
                                            {discount > 0 && (
                                                <div className="absolute top-0 left-0 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm z-10">
                                                    {discount}% OFF
                                                </div>
                                            )}
                                            {/* Hot Badge */}
                                            {product.is_trending && (
                                                <div className="absolute top-0 right-0 p-1">
                                                    <div className="bg-orange-100 text-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200">
                                                        Hot
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2.5 flex flex-col flex-grow">
                                            <h3 className="font-medium text-xs md:text-sm text-slate-800 dark:text-white line-clamp-2 mb-1.5 leading-[1.3] min-h-[2.6em] group-hover:text-blue-600 transition-colors">{product.name}</h3>

                                            <div className="mt-auto pt-1.5 border-t border-dashed border-slate-100 dark:border-slate-800">
                                                <div className="flex flex-col gap-0.5">
                                                    {product.has_variants ? (
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                                                                ₹{Math.min(...(product.variants?.map(v => v.offer_price || v.price) || [0]))}
                                                            </span>
                                                            <span className="text-[10px] text-blue-600 font-semibold">+Options</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {product.offer_price && product.offer_price < product.price ? (
                                                                <div className="flex flex-col leading-none">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="font-bold text-sm text-slate-900 dark:text-white">₹{product.offer_price}</span>
                                                                        <span className="text-[10px] text-slate-400 line-through">₹{product.price}</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="font-bold text-sm text-slate-900 dark:text-white">₹{product.price}</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-1 truncate">{store?.store_name}</div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                    {products.filter(p => p.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) && p.active).length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No products found matching "{appliedSearchQuery}"
                        </div>
                    )}
                </section>
            )}

            {/* CTA Banner */}
            <div className="w-full bg-blue-600 py-16 text-center text-white mt-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">Want Your Store Listed Here?</h2>
                    <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">Create your own online store in minutes and get discovered by thousands of customers.</p>
                    <Link href="/onboard" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1">
                        Create Your Store
                    </Link>
                </div>
            </div>

        </div>
    );
}

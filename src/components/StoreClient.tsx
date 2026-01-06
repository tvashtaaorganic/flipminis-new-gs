'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, Store, Variant } from '@/types';
import Link from 'next/link';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Props {
    store: Store;
    products: Product[];
    categories: string[];
}

function VerifiedBadge() {
    return (
        <span className="inline-flex items-center gap-1 ml-2" title="Verified Seller">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        </span>
    );
}

export default function StoreClient({ store, products, categories }: Props) {
    const { trackView, trackEvent } = useAnalytics();

    // Track Store View
    useEffect(() => {
        trackView({ store_id: store.store_id });
    }, [store.store_id]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [mainImage, setMainImage] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

    // Search & Filter
    const [inputSearchQuery, setInputSearchQuery] = useState('');
    const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

    const handleSearch = () => {
        setAppliedSearchQuery(inputSearchQuery);
    };

    const [activeCategory, setActiveCategory] = useState<string>('all');
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToCategory = (cat: string) => {
        setActiveCategory(cat);
        if (typeof window !== 'undefined') {
            // If searching, we might not want to scroll, but let's keep it for now or just filter
        }
    };

    const scrollTabs = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Filter Products based on Search
    const visibleProducts = products.filter(p => {
        if (!p.active) return false;
        if (!appliedSearchQuery) return true;
        return p.name.toLowerCase().includes(appliedSearchQuery.toLowerCase());
    });

    // Group products
    const productsByCategory = categories.reduce((acc, cat) => {
        acc[cat] = visibleProducts.filter(p => p.category === cat);
        return acc;
    }, {} as Record<string, Product[]>);

    const calculateDiscount = (product: Product, variant: Variant | null) => {
        // Card view calculation (max discount)
        if (product.has_variants && product.variants?.length) {
            const maxDisc = Math.max(...product.variants.map(v => v.offer_price ? Math.round(((v.price - v.offer_price) / v.price) * 100) : 0));
            return maxDisc > 0 ? maxDisc : 0;
        } else if (product.offer_price && product.offer_price < product.price) {
            return Math.round(((product.price - product.offer_price) / product.price) * 100);
        }
        return 0;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans flex flex-col">
            {/* Store Closed Banner */}
            {store.is_open === false && (
                <div className="bg-red-600 text-white text-center py-2 px-4 text-xs md:text-sm font-bold sticky top-0 z-50">
                    🚫 Business is currently closed. Orders will still be received but processed only when the business opens.
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all duration-300">
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Store Info */}
                        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-md shrink-0">
                                {store.store_name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center">
                                    <h1 className="font-bold text-lg md:text-xl leading-none text-gray-900 dark:text-white capitalize truncate">
                                        {store.store_name}
                                    </h1>
                                    {store.verified && <VerifiedBadge />}
                                </div>
                                <div className="flex items-center gap-2 text-xs md:text-sm mt-0.5">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium truncate">@{store.username}</span>
                                    {!!store.rating && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <span className="flex items-center gap-0.5 text-orange-500 font-bold">
                                                ★ {store.rating}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Search / Cart (Placeholder for now) */}
                        <div className="flex items-center gap-3 shrink-0">
                            {store.whatsapp && (
                                <a
                                    href={`https://wa.me/${store.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEvent('whatsapp_click', { store_id: store.store_id })}
                                    className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm font-bold hover:bg-green-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                    <span className="inline">Chat</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Banner Area */}
                {
                    store.banner_url ? (
                        <div className="w-full h-32 md:h-56 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden mb-6 shadow-sm relative group">
                            <img src={store.banner_url} alt={store.store_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h1 className="text-xl md:text-3xl font-bold shadow-sm">{store.store_name}</h1>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-28 md:h-48 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-1 relative z-10">{store.store_name}</h2>
                            {store.description && <p className="text-white/90 text-xs md:text-sm max-w-lg leading-relaxed px-4 line-clamp-2 relative z-10">{store.description}</p>}
                        </div>
                    )
                }

                {/* Store Description & Address */}
                {(store.banner_url || store.address_full || store.city) && (
                    <div className="text-center mb-8 max-w-4xl mx-auto space-y-2">
                        {store.description && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                                {store.description}
                            </p>
                        )}
                        {(store.address_full || store.city) && (
                            <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {store.address_full || store.city ? (
                                    [store.address_full, store.city, store.state, store.pincode].filter(Boolean).join(', ')
                                ) : (
                                    'Location not available'
                                )}
                            </p>
                        )}
                    </div>
                )}

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-8 px-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                        className="relative flex items-center bg-white rounded-full border border-gray-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm p-0.5"
                    >
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={inputSearchQuery}
                                onChange={(e) => setInputSearchQuery(e.target.value)}
                                className="w-full py-2.5 px-4 pl-10 bg-transparent focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors text-sm m-0.5"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Sticky Category Tabs with Navigation */}
                {categories.length > 0 && (
                    <div className="sticky top-[72px] md:top-[80px] z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm py-3 mb-6 border-b border-gray-100 dark:border-slate-800 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:border-none md:p-0 md:mb-10 transition-all">
                        <div className="relative group max-w-full md:max-w-4xl mx-auto flex items-center">
                            {/* Left Arrow */}
                            <button
                                onClick={() => scrollTabs('left')}
                                className="flex absolute left-0 z-10 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 -ml-2 md:-ml-4 transition-colors"
                                aria-label="Scroll Left"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            {/* Tabs Container */}
                            <div
                                ref={scrollRef}
                                className="flex gap-3 overflow-x-auto hide-scrollbar w-full px-8 py-1 scroll-smooth justify-center md:justify-start"
                            >
                                <button
                                    onClick={() => scrollToCategory('all')}
                                    className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === 'all'
                                        ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-black shadow-md'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-gray-300'
                                        }`}
                                >
                                    All ({products.filter(p => p.active).length})
                                </button>
                                {categories.map(cat => {
                                    const count = products.filter(p => p.category === cat && p.active).length;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => scrollToCategory(cat)}
                                            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === cat
                                                ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-black shadow-md'
                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {cat} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => scrollTabs('right')}
                                className="flex absolute right-0 z-10 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 -mr-2 md:-mr-4 transition-colors"
                                aria-label="Scroll Right"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="text-6xl mb-4">📦</div>
                        <p>No products available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-12 min-h-[50vh]">
                        {categories.map(category => {
                            // Filter logic: Only show if active is 'all' OR matches category
                            if (activeCategory !== 'all' && activeCategory !== category) return null;

                            // Hide category if no products match the search filter
                            if (productsByCategory[category].length === 0) return null;

                            return (
                                <section key={category} id={category} className="scroll-mt-32 md:scroll-mt-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            {category}
                                            <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                                {productsByCategory[category].length}
                                            </span>
                                        </h2>
                                        <div className="h-px bg-gray-200 dark:bg-slate-700 flex-grow"></div>
                                    </div>

                                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar">
                                        {productsByCategory[category].map(product => {
                                            const discount = calculateDiscount(product, null);
                                            return (
                                                <div key={product.product_id} className="min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] snap-start h-auto flex-shrink-0">
                                                    <Link
                                                        href={`/${store.username}/p/${product.product_id}`}
                                                        className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 transition-all block h-full flex flex-col relative"
                                                    >
                                                        {/* Image Container - Square Aspect Ratio */}
                                                        <div className="aspect-square relative bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center p-2">
                                                            {product.image_url ? (
                                                                <img
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-slate-50 dark:bg-slate-800">
                                                                    <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                                </div>
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

                                                        {/* Details */}
                                                        <div className="p-2.5 flex flex-col flex-grow">
                                                            <h3 className="font-medium text-xs md:text-sm text-slate-800 dark:text-white line-clamp-2 mb-1.5 leading-[1.3] min-h-[2.6em] group-hover:text-blue-600 transition-colors">
                                                                {product.name}
                                                            </h3>

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
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

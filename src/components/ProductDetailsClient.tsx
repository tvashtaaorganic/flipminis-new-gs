'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Store, Variant } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ProductDetailsClientProps {
    store: Store;
    product: Product;
    similarProducts: Product[];
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

export default function ProductDetailsClient({ store, product, similarProducts }: ProductDetailsClientProps) {
    const { trackView, trackEvent } = useAnalytics();

    useEffect(() => {
        trackView({ store_id: store.store_id, product_id: product.product_id });
    }, [store.store_id, product.product_id]);

    const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);
    const [activeImage, setActiveImage] = useState(allImages[0]);

    // Variant State
    const initialVariant = product.has_variants && product.variants && product.variants.length > 0
        ? product.variants[0]
        : null;
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(initialVariant);

    // Tab State
    const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Price Logic
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentOfferPrice = selectedVariant ? selectedVariant.offer_price : product.offer_price;
    const displayPrice = (currentOfferPrice && currentOfferPrice < currentPrice) ? currentOfferPrice : currentPrice;
    const originalPrice = currentPrice;
    const hasOffer = (currentOfferPrice && currentOfferPrice < currentPrice) || false;
    const discountPercentage = hasOffer && originalPrice > 0
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : 0;

    // WhatsApp construction
    const productNameWithVariant = selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name;
    const productLink = `https://flipminis.in/${store.username}/p/${product.product_id}`;
    let messageText = `Hi ${store.store_name}, I want to order:\nProduct: ${productNameWithVariant}\nPrice: ₹${displayPrice}\nLink: ${productLink}`;
    if (store.whatsapp_template) {
        messageText = store.whatsapp_template
            .replace(/{{product}}/g, productNameWithVariant)
            .replace(/{{price}}/g, `₹${displayPrice}`)
            .replace(/{{link}}/g, productLink)
            .replace(/{{store_name}}/g, store.store_name);
    }
    const whatsappMessage = encodeURIComponent(messageText);
    const enquiryMessage = encodeURIComponent(`Hi, I have a query about: ${productNameWithVariant}`);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-20">
            {/* Store Closed Banner */}
            {store.is_open === false && (
                <div className="bg-red-600 text-white text-center py-2 px-4 text-xs md:text-sm font-bold sticky top-0 z-50">
                    🚫 Business is currently closed. Orders will still be received but processed only when the business opens.
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href={`/${store.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                            {store.store_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center">
                                <h1 className="font-bold text-lg leading-none text-gray-900 dark:text-white capitalize line-clamp-1">{store.store_name}</h1>
                                {store.verified && <VerifiedBadge />}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-blue-600 dark:text-blue-400 font-medium">@{store.username}</span>
                            </div>
                        </div>
                    </Link>
                    <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 uppercase tracking-wide hidden md:block">
                        Flipminis.in
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md overflow-hidden mb-12 border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* LEFT: Image Gallery - Sticky & Compact */}
                        <div className="p-0 md:p-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 relative md:sticky md:top-5 md:self-start">
                            {discountPercentage > 0 && (
                                <div className="absolute top-6 left-6 z-10 bg-rose-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg animate-pulse">
                                    {discountPercentage}% OFF
                                </div>
                            )}

                            {product.is_trending && (
                                <div className="absolute top-6 right-6 z-10 bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                    🔥 Trending
                                </div>
                            )}

                            <div className="w-full h-[450px] flex items-center justify-center p-4">
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain drop-shadow transition-all duration-300 hover:scale-105"
                                />
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto py-2 w-full justify-center hide-scrollbar">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden items-center justify-center p-1 bg-white dark:bg-slate-800 transition-all ${activeImage === img
                                                ? 'border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                                }`}
                                        >
                                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: DETAILS */}
                        <div className="p-6 md:p-10 flex flex-col h-full bg-white dark:bg-slate-900">
                            {/* Category & Title */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="inline-block px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                    <span className="text-slate-300 text-xs">•</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                        In Stock: {selectedVariant ? selectedVariant.stock : product.stock}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-1 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                                        ₹{displayPrice}
                                    </span>
                                    {hasOffer && (
                                        <span className="text-xl text-slate-400 line-through decoration-slate-400/50">
                                            ₹{originalPrice}
                                        </span>
                                    )}
                                </div>
                                {hasOffer && (
                                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        You save ₹{originalPrice - displayPrice} ({discountPercentage}%)
                                    </p>
                                )}
                            </div>

                            {/* Variants Selection - Styled like Pills/Tags */}
                            {product.has_variants && product.variants && product.variants.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                                            Select {product.variant_type || 'Option'}
                                        </h3>
                                        {selectedVariant && (
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                Selected: {selectedVariant.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((variant) => {
                                            const isSelected = selectedVariant?.name === variant.name;
                                            return (
                                                <button
                                                    key={variant.name}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={`group relative min-w-[3.5rem] px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 overflow-hidden ${isSelected
                                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                                                        }`}
                                                >
                                                    <span className="relative z-10">{variant.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Tabs for Description / Info */}
                            <div className="mb-8 flex-grow">
                                <div className="flex border-b border-gray-200 dark:border-slate-700 mb-4">
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors mr-6 ${activeTab === 'description'
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-800'
                                            }`}
                                    >
                                        Description
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shipping')}
                                        className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors mr-6 ${activeTab === 'shipping'
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-800'
                                            }`}
                                    >
                                        Shipping
                                    </button>
                                </div>

                                <div className="min-h-[100px] text-slate-600 dark:text-slate-300 text-sm leading-relaxed animate-in fade-in duration-300">
                                    {activeTab === 'description' && (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <p className={`whitespace-pre-wrap transition-all ${isDescriptionExpanded ? '' : 'line-clamp-4'}`}>
                                                {product.description || 'No description available.'}
                                            </p>
                                            {product.description && product.description.length > 200 && (
                                                <button
                                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                                    className="text-blue-600 font-bold mt-2 hover:underline text-sm"
                                                >
                                                    {isDescriptionExpanded ? 'View Less' : 'View More'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {activeTab === 'shipping' && (
                                        <div className="space-y-2">
                                            <p>🚚 <strong>Delivery:</strong> Usually ships within {store.response_time || '24 hours'}.</p>
                                            <p>💰 <strong>Payment:</strong> Pay directly to seller via UPI/Cash after chatting.</p>
                                            <p>🛡️ <strong>Policy:</strong> Returns and exchanges are handled directly by the store owner.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="grid grid-cols-2 gap-4">
                                    <a
                                        href={`https://wa.me/${store.whatsapp}?text=${enquiryMessage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackEvent('enquiry_click', { store_id: store.store_id, product_id: product.product_id })}
                                        className="flex items-center justify-center w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Enquiry
                                    </a>
                                    <a
                                        href={`https://wa.me/${store.whatsapp}?text=${whatsappMessage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackEvent('whatsapp_click', { store_id: store.store_id, product_id: product.product_id })}
                                        className="flex items-center justify-center w-full px-4 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 transition-all transform active:scale-95 flex-col md:flex-row gap-1 leading-none"
                                    >
                                        <span className="flex items-center gap-2 text-base">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                            Order Now
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Similar Products</h2>
                            <Link href={`/${store.username}`} className="text-blue-600 font-semibold hover:underline">View Store</Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                            {similarProducts.map(sp => {
                                let spPrice = sp.price;
                                let spOriginalPrice = sp.price;
                                let spHasOffer = false;

                                if (sp.has_variants && sp.variants && sp.variants.length > 0) {
                                    spPrice = Math.min(...sp.variants.map(v => v.offer_price || v.price));
                                    spOriginalPrice = Math.min(...sp.variants.map(v => v.price));
                                } else if (sp.offer_price && sp.offer_price < sp.price) {
                                    spPrice = sp.offer_price;
                                    spHasOffer = true;
                                }

                                const spDiscount = (spHasOffer || (sp.has_variants)) && spOriginalPrice > spPrice
                                    ? Math.round(((spOriginalPrice - spPrice) / spOriginalPrice) * 100)
                                    : 0;

                                return (
                                    <div key={sp.product_id} className="min-w-[140px] w-[140px] md:min-w-[180px] md:w-[180px] snap-start h-auto flex-shrink-0">
                                        <Link
                                            href={`/${store.username}/p/${sp.product_id}`}
                                            className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 transition-all block h-full flex flex-col relative"
                                        >
                                            <div className="aspect-square relative bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center p-2">
                                                {sp.image_url ? (
                                                    <img
                                                        src={sp.image_url}
                                                        alt={sp.name}
                                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-slate-50 dark:bg-slate-800">
                                                        <span className="text-xs">No Image</span>
                                                    </div>
                                                )}

                                                {spDiscount > 0 && (
                                                    <div className="absolute top-0 left-0 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm z-10">
                                                        {spDiscount}% OFF
                                                    </div>
                                                )}

                                                {sp.is_trending && (
                                                    <div className="absolute top-0 right-0 p-1">
                                                        <div className="bg-orange-100 text-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200">
                                                            Hot
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2.5 flex flex-col flex-grow">
                                                <h3 className="font-medium text-xs md:text-sm text-slate-800 dark:text-white line-clamp-2 mb-1.5 leading-[1.3] min-h-[2.6em] group-hover:text-blue-600 transition-colors">
                                                    {sp.name}
                                                </h3>
                                                <div className="mt-auto pt-1.5 border-t border-dashed border-slate-100 dark:border-slate-800">
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                                                                ₹{spPrice}{sp.has_variants ? '+' : ''}
                                                            </span>
                                                            {(spHasOffer || (sp.has_variants && spOriginalPrice > spPrice)) && (
                                                                <span className="text-[10px] text-slate-400 line-through">₹{spOriginalPrice}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

import Link from 'next/link';
import { getCachedStores, getCachedProducts } from '@/lib/data';
import StoreCard from '@/components/StoreCard';
import Header from '@/components/Header';

export const revalidate = 600; // 10 minutes
export const dynamicParams = true;

interface Props {
    params: Promise<{ category: string }>;
}

const slugify = (text: string) => text.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

export async function generateStaticParams() {
    const stores = await getCachedStores();
    const products = await getCachedProducts();

    // Get unique categories from both stores and products
    const storeCategories = stores.map(s => s.category).filter(Boolean);
    const productCategories = products.map(p => p.category).filter(Boolean);

    const allCategories = Array.from(new Set([...storeCategories, ...productCategories]));

    return allCategories.map(category => ({ category: slugify(category) }));
}

export async function generateMetadata({ params }: Props) {
    const { category } = await params;
    // We try to prettify the slug for the title
    const displayCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
        title: `${displayCategory} | Flipminis`,
        description: `Shop for ${displayCategory} products and find top stores.`,
    };
}

export async function CategoryPage({ params }: Props) {
    const { category } = await params; // This is the slug, e.g., 'fashion-store'

    // Fetch data cached
    const stores = await getCachedStores();
    const products = await getCachedProducts();

    // Filter by converting store category to slug and comparing
    const activeStores = stores.filter(s => {
        if (!s.category || s.status !== 'active') return false;
        return slugify(s.category) === category.toLowerCase();
    });

    // Filter products by category
    const activeProducts = products.filter(p => {
        if (!p.category || !p.active) return false;
        return slugify(p.category) === category.toLowerCase();
    });

    // Try to find the "Original" Display Name
    let displayCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (activeStores.length > 0) {
        displayCategory = activeStores[0].category;
    } else if (activeProducts.length > 0) {
        displayCategory = activeProducts[0].category;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Header />

            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-16 relative">
                    {/* Background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative z-10 capitalize">
                        {displayCategory}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Explore products and stores in the {displayCategory} category.
                    </p>
                </div>

                {activeStores.length === 0 && activeProducts.length === 0 ? (
                    <div className="text-center py-20 px-4 max-w-2xl mx-auto rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="text-6xl mb-6">🔍</div>
                        <h2 className="text-2xl font-bold mb-3">No results found in "{displayCategory}"</h2>
                        <p className="text-slate-500 mb-8">
                            This category is currently empty. Be the first to launch a store here!
                        </p>
                        <Link href="/onboard" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                            <span>+</span> Create {displayCategory} Store
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Stores Section */}
                        {activeStores.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-3xl">🏪</span> Stores
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {activeStores.map(store => (
                                        <StoreCard key={store.store_id} store={store} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Products Section */}
                        {activeProducts.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-3xl">📦</span> Products
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                    {activeProducts.map(product => {
                                        // Calculate price to display
                                        let displayPrice = product.price;
                                        let originalPrice = product.price;
                                        let hasOffer = false;

                                        if (product.has_variants && product.variants && product.variants.length > 0) {
                                            displayPrice = Math.min(...product.variants.map(v => v.offer_price || v.price));
                                            originalPrice = Math.min(...product.variants.map(v => v.price));
                                            hasOffer = product.variants.some(v => v.offer_price && v.offer_price < v.price);
                                        } else if (product.offer_price && product.offer_price < product.price) {
                                            displayPrice = product.offer_price;
                                            hasOffer = true;
                                        }

                                        const discount = hasOffer && originalPrice > 0
                                            ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
                                            : 0;

                                        // Find store username for the link
                                        const store = stores.find(s => s.store_id === product.store_id);
                                        const username = store ? store.username : 'store';

                                        return (
                                            <Link
                                                key={product.product_id}
                                                href={`/${username}/p/${product.product_id}`}
                                                className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-slate-700 transition-all hover:-translate-y-1 block"
                                            >
                                                <div className="aspect-[4/5] relative bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center p-0">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                    )}
                                                    {discount > 0 && (
                                                        <div className="absolute top-2 left-2">
                                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                                {discount}% OFF
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="font-medium text-sm md:text-base text-gray-800 dark:text-white line-clamp-2 h-10 mb-1 leading-snug">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-baseline gap-2">
                                                        {product.has_variants ? (
                                                            <span className="font-bold text-gray-900 dark:text-white">₹{displayPrice}+</span>
                                                        ) : hasOffer ? (
                                                            <>
                                                                <span className="font-bold text-gray-900 dark:text-white">₹{displayPrice}</span>
                                                                <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                                                            </>
                                                        ) : (
                                                            <span className="font-bold text-gray-900 dark:text-white">₹{displayPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Upsell */}
                        <div className="text-center py-12 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                Own a {displayCategory} business?
                            </p>
                            <Link href="/onboard" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all">
                                List Your Store for Free &rarr;
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
export default CategoryPage;

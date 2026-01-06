import { Metadata } from 'next';
import { getCachedStores, getCachedStoreByUsername, getCachedStoreProducts } from '@/lib/data';
import { getPayments } from '@/lib/googleSheets';
import StoreClient from '@/components/StoreClient';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 300; // 5 minutes cache
export const dynamicParams = true;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://flipminis.in";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const stores = await getCachedStores();
    return stores
        .filter(s => s.status === 'active')
        .map(store => ({
            // We now generate direct paths e.g. /tvashtaa
            slug: store.username,
        }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Normalize: remove leading @ if present (backward compatibility)
    const username = decodeURIComponent(slug).startsWith('@')
        ? decodeURIComponent(slug).substring(1)
        : decodeURIComponent(slug);

    const store = await getCachedStoreByUsername(username);

    if (!store) return { title: 'Store Not Found' };

    const title = `${store.store_name} | Flipminis`;
    const description = store.description || `Shop at ${store.store_name} directly on WhatsApp. Order online, pay locally.`;
    const url = `${BASE_URL}/${store.username}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            siteName: 'Flipminis',
            images: [
                {
                    url: store.banner_url || `${BASE_URL}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: store.store_name,
                },
            ],
            type: 'website',
        },
        alternates: {
            canonical: url,
        },
    };
}


export default async function StorePage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    if (decodedSlug.startsWith('@')) {
        redirect(`/${decodedSlug.substring(1)}`);
    }

    const username = decodedSlug;

    const store = await getCachedStoreByUsername(username);

    if (!store || store.status !== 'active') {
        notFound();
    }

    // Check Subscription
    const payments = await getPayments(store.store_id);
    if (payments.length > 0) {
        const latestPayment = payments.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0];
        const endDate = new Date(latestPayment.end_date);
        if (endDate < new Date()) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Store Unavailable</h1>
                    <p className="text-gray-600 max-w-md">
                        This store is currently inactive due to subscription expiry. Please contact the store owner.
                    </p>
                </div>
            );
        }
    }

    const products = await getCachedStoreProducts(store.store_id);
    const categories = Array.from(new Set(products.map(p => p.category)));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": store.store_name,
        "image": store.banner_url || `${BASE_URL}/logo.png`,
        "telephone": store.whatsapp,
        "url": `${BASE_URL}/${store.username}`,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": store.address_full || "",
            "addressLocality": store.city || "",
            "addressRegion": store.state || "",
            "postalCode": store.pincode || "",
            "addressCountry": store.country || "IN"
        },
        "description": store.description
    };


    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StoreClient store={store} products={products} categories={categories} />
        </>
    );
}

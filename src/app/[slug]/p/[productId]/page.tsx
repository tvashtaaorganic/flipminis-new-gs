import { Metadata } from 'next';
import { getCachedStoreByUsername, getCachedStoreProducts } from '@/lib/data';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import ProductDetailsClient from '@/components/ProductDetailsClient';

export const revalidate = 300; // 5 minutes cache
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://flipminis.in";

interface Props {
    params: Promise<{
        slug: string;
        productId: string;
    }>
}

async function getData(slug: string, productId: string) {
    // Normalize: remove leading @ if present
    const cleanSlug = decodeURIComponent(slug).startsWith('@')
        ? decodeURIComponent(slug).replace('@', '')
        : decodeURIComponent(slug);

    const store = await getCachedStoreByUsername(cleanSlug);

    if (!store) return null;

    const products = await getCachedStoreProducts(store.store_id);
    const product = products.find(p => p.product_id === productId);

    if (!product) return null;

    return { store, product, allProducts: products };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const data = await getData(resolvedParams.slug, resolvedParams.productId);
    if (!data) return { title: 'Product Not Found' };

    const { product, store } = data;
    const title = product.meta_title || `${product.name} | ${store.store_name}`;
    const description = product.meta_description || product.description?.slice(0, 160) || `Buy ${product.name} from ${store.store_name} directly on WhatsApp.`;
    const url = `${BASE_URL}/${store.username}/p/${product.product_id}`;

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
                    url: product.image_url || `${BASE_URL}/og-image.png`,
                    width: 800,
                    height: 800,
                    alt: product.name,
                }
            ],
            type: 'website',
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const resolvedParams = await params;

    // Redirect logic: If url starts with @, clean it up
    const decodedSlug = decodeURIComponent(resolvedParams.slug);
    if (decodedSlug.startsWith('@')) {
        redirect(`/${decodedSlug.substring(1)}/p/${resolvedParams.productId}`);
    }

    const data = await getData(resolvedParams.slug, resolvedParams.productId);

    if (!data) {
        return notFound();
    }

    const { store, product, allProducts } = data;

    // Filter Similar Products
    const similarProducts = allProducts
        .filter(p => p.category === product.category && p.product_id !== product.product_id && p.active)
        .slice(0, 10);

    // Product Schema
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.image_url ? [product.image_url] : [],
        "description": product.description || `Buy ${product.name} from ${store.store_name}`,
        "sku": product.product_id,
        "brand": {
            "@type": "Brand",
            "name": store.store_name
        },
        "offers": {
            "@type": "Offer",
            "url": `${BASE_URL}/${store.username}/p/${product.product_id}`,
            "priceCurrency": "INR", // Assuming INR based on previous conversations
            "price": product.offer_price || product.price,
            "availability": (product.stock && Number(product.stock) > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": store.store_name
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailsClient
                store={store}
                product={product}
                similarProducts={similarProducts}
            />
            <Footer />
        </div>
    );
}

import { MetadataRoute } from 'next';
import { getCachedStores, getCachedProducts } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flipminis.in';

export const revalidate = 1800; // 30 minutes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const stores = await getCachedStores();
    const products = await getCachedProducts();

    // 1. Static Routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/onboard`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // 2. Category Routes
    const categories = Array.from(new Set([...stores.map(s => s.category), ...products.map(p => p.category)])).filter(Boolean);
    const categoryRoutes = categories.map(cat => ({
        url: `${BASE_URL}/category/${cat.toLowerCase().replace(/ /g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 3. Store Routes
    const storeRoutes = stores
        .filter(s => s.status === 'active')
        .map(store => ({
            url: `${BASE_URL}/${store.username}`,
            lastModified: new Date(store.created_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

    // 4. Product Routes
    const productRoutes = products
        .filter(p => p.active)
        .map(product => {
            const store = stores.find(s => s.store_id === product.store_id);
            const username = store ? store.username : 'store';
            return {
                url: `${BASE_URL}/${username}/p/${product.product_id}`,
                lastModified: new Date(), // Ideal if product had updated_at
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });

    return [...routes, ...categoryRoutes, ...storeRoutes, ...productRoutes];
}

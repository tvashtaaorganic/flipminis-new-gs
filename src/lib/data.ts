import { unstable_cache } from 'next/cache';
import { getStores as fetchStores, getProducts as fetchProducts } from './googleSheets';
import { Product, Store } from '@/types';

// Cache TTLs (in seconds)
const CACHE_TTL = {
    HOMEPAGE: 600, // 10 minutes
    CATEGORY: 600, // 10 minutes
    STORE: 300,    // 5 minutes
    PRODUCT: 300,  // 5 minutes
    SITEMAP: 1800  // 30 minutes
};

// 1. Cached Stores (Global)
export const getCachedStores = unstable_cache(
    async () => {
        console.log('Fetching stores from Google Sheets...');
        return await fetchStores();
    },
    ['stores-data-v1'], // Versioned key
    { revalidate: CACHE_TTL.HOMEPAGE, tags: ['stores'] }
);

// 2. Cached Products (Global - fetches ALL products to minimize API calls)
const getCachedAllProducts = unstable_cache(
    async () => {
        console.log('Fetching ALL products from Google Sheets...');
        return await fetchProducts(); // Fetch all (no storeId filter)
    },
    ['all-products-data-v1'],
    { revalidate: CACHE_TTL.PRODUCT, tags: ['products'] }
);

// Helpers
export async function getCachedProducts(): Promise<Product[]> {
    return await getCachedAllProducts();
}

export async function getCachedStoreProducts(storeId: string): Promise<Product[]> {
    const allProducts = await getCachedAllProducts();
    return allProducts.filter(p => p.store_id === storeId);
}

export async function getCachedProductById(productId: string): Promise<Product | undefined> {
    const allProducts = await getCachedAllProducts();
    return allProducts.find(p => p.product_id === productId);
}

export async function getCachedStoreByUsername(username: string): Promise<Store | undefined> {
    const stores = await getCachedStores();
    return stores.find(s => s.username?.toLowerCase() === username.toLowerCase());
}

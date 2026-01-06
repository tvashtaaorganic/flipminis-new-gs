import { getCachedStores, getCachedProducts } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flipminis.in';
const MAX_URLS_PER_SITEMAP = 1000;

export const revalidate = 1800; // 30 minutes
export const dynamic = 'force-dynamic'; // Skip pre-rendering

export async function GET(request: Request, { params }: { params: { page: string } }) {
    const page = parseInt(params.page);

    const stores = await getCachedStores();
    const products = await getCachedProducts();
    const activeProducts = products.filter(p => p.active);

    // Calculate pagination
    const startIndex = (page - 1) * MAX_URLS_PER_SITEMAP;
    const endIndex = startIndex + MAX_URLS_PER_SITEMAP;
    const paginatedProducts = activeProducts.slice(startIndex, endIndex);

    const sitemap = paginatedProducts.map(product => {
        const store = stores.find(s => s.store_id === product.store_id);
        const username = store ? store.username : 'store';
        return {
            url: `${BASE_URL}/${username}/p/${product.product_id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        };
    });

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.toISOString()}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=1800, s-maxage=1800',
        },
    });
}

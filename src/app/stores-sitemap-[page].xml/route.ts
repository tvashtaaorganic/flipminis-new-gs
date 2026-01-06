import { getCachedStores } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flipminis.in';
const MAX_URLS_PER_SITEMAP = 1000;

export const revalidate = 1800; // 30 minutes

export async function GET(request: Request, { params }: { params: { page: string } }) {
    const page = parseInt(params.page);

    const stores = await getCachedStores();
    const activeStores = stores.filter(s => s.status === 'active');

    // Calculate pagination
    const startIndex = (page - 1) * MAX_URLS_PER_SITEMAP;
    const endIndex = startIndex + MAX_URLS_PER_SITEMAP;
    const paginatedStores = activeStores.slice(startIndex, endIndex);

    const sitemap = paginatedStores.map(store => ({
        url: `${BASE_URL}/${store.username}`,
        lastModified: new Date(store.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

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

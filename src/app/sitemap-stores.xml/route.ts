import { getCachedStores } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flipminis.in';
const MAX_URLS_PER_SITEMAP = 1000;

export const revalidate = 1800; // 30 minutes

export async function GET() {
    const stores = await getCachedStores();
    const activeStores = stores.filter(s => s.status === 'active');

    // Calculate how many sitemap files we need
    const totalPages = Math.ceil(activeStores.length / MAX_URLS_PER_SITEMAP);

    // Generate Sitemap Index XML
    const sitemaps = Array.from({ length: totalPages }, (_, i) => ({
        loc: `${BASE_URL}/stores-sitemap-${i + 1}.xml`,
        lastmod: new Date().toISOString(),
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=1800, s-maxage=1800',
        },
    });
}

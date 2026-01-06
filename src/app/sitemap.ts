import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flipminis.in';

export default function sitemap(): MetadataRoute.Sitemap {
    // Main sitemap index - returns references to sub-sitemaps
    return [
        {
            url: `${BASE_URL}/sitemap-static.xml`,
            lastModified: new Date(),
        },
        {
            url: `${BASE_URL}/sitemap-stores.xml`,
            lastModified: new Date(),
        },
        {
            url: `${BASE_URL}/sitemap-products.xml`,
            lastModified: new Date(),
        },
    ];
}

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://flipminis.in';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/_next/', '/admin/', '/*.json$'],
            },
            // Block AI Training Bots
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web', 'cohere-ai', 'Omgilibot', 'FacebookBot'],
                disallow: ['/'],
            },
            // Block Image Scrapers
            {
                userAgent: ['Googlebot-Image', 'Bingbot', 'Slurp'],
                disallow: ['/'],
            },
            // Block SEO/Scraping Bots
            {
                userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'BLEXBot', 'DataForSeoBot'],
                disallow: ['/'],
            },
        ],
        sitemap: [
            `${BASE_URL}/sitemap.xml`,
            `${BASE_URL}/sitemap-static.xml`,
            `${BASE_URL}/sitemap-stores.xml`,
            `${BASE_URL}/sitemap-products.xml`,
        ],
    };
}

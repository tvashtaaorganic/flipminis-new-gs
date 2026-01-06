import { NextRequest, NextResponse } from 'next/server';
import { logAnalyticsEvent } from '@/lib/googleSheets';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { store_id, product_id, action_type } = body;

        if (!store_id || !action_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Visitor ID Strategy
        // We expect the client to trigger this, but we verify cookie.
        const cookieStore = await cookies();
        let visitor_id = cookieStore.get('visitor_id')?.value;

        // If no cookie, we generate one, but we must return it to be set by client or middleware.
        // For API routes, setting Set-Cookie header works.
        const newVisitor = !visitor_id;
        if (!visitor_id) {
            visitor_id = crypto.randomUUID();
        }

        // 2. IP Hashing
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const ip_hash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 12);

        // 3. Bot Detection (Simple)
        const ua = req.headers.get('user-agent') || '';
        if (/bot|googlebot|crawler|spider|robot|crawling/i.test(ua)) {
            return NextResponse.json({ status: 'ignored_bot' });
        }

        // 4. Log Event
        // In a real batch system, we would push to a Redis queue here.
        // For simplified Google Sheets backend, we append directly (or use a buffer map if stateful server).
        await logAnalyticsEvent({
            visitor_id,
            store_id,
            product_id,
            action_type,
            user_agent: ua,
            ip_hash
        });

        const response = NextResponse.json({ success: true });

        // Set cookie if new (persists for 30 days)
        if (newVisitor) {
            response.cookies.set('visitor_id', visitor_id, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                httpOnly: true, // Secure
            });
        }

        return response;

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

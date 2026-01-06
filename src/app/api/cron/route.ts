import { NextResponse } from 'next/server';
import { runAnalyticsJob } from '@/lib/googleSheets';

export const maxDuration = 60; // Allow 60 seconds execution

export async function GET(req: Request) {
    // Basic auth using a secret query param
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // In production, use env var. For now allow simple call.
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await runAnalyticsJob();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Cron Job Failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

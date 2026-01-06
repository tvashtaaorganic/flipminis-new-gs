import { NextRequest, NextResponse } from 'next/server';
import { updateStore } from '@/lib/googleSheets';

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { store } = body;

        if (!store || !store.store_id) {
            return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
        }

        const success = await updateStore(store);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
        }
    } catch (error) {
        console.error('Settings API Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

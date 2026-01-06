import { NextResponse } from 'next/server';
import { getStores } from '@/lib/googleSheets';

export async function GET() {
    try {
        const stores = await getStores();
        const categories = Array.from(new Set(stores.map(store => store.category).filter(Boolean)));

        // Ensure "General" is always present if list not empty, or just default list
        const defaultCategories = ['General', 'Fashion', 'Electronics', 'Food', 'Services'];
        const uniqueCategories = Array.from(new Set([...defaultCategories, ...categories]));

        return NextResponse.json({ categories: uniqueCategories });
    } catch (error) {
        return NextResponse.json({ categories: [] }, { status: 500 });
    }
}

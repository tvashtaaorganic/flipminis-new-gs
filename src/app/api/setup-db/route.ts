import { NextResponse } from 'next/server';
import { sheets, SPREADSHEET_ID } from '@/lib/googleSheets';

export async function GET() {
    try {
        if (!sheets || !SPREADSHEET_ID) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
        }

        // 1. Get existing sheets
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const existingUtils = meta.data.sheets?.map(s => s.properties?.title) || [];
        const requests: any[] = [];
        const sheetsToCreate = ['STORES', 'PRODUCTS', 'USERS', 'PAYMENTS'];

        // 2. Create missing sheets
        sheetsToCreate.forEach(sheetName => {
            if (!existingUtils.includes(sheetName)) {
                requests.push({
                    addSheet: {
                        properties: {
                            title: sheetName,
                        },
                    },
                });
            }
        });

        if (requests.length > 0) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: { requests },
            });
        }

        // 3. Add Headers to each sheet (if likely empty)
        // We'll blindly update cell A1:Z1 for simplicity to ensure headers are there.
        // This overwrites headers but that's fine for setup.
        const headers: Record<string, string[]> = {
            'STORES': ['store_id', 'username', 'store_name', 'whatsapp', 'category', 'plan', 'status', 'created_at'],
            'PRODUCTS': ['product_id', 'store_id', 'name', 'price', 'image_url', 'category', 'active'],
            'USERS': ['username', 'password_hash', 'store_id', 'role'],
            'PAYMENTS': ['store_id', 'plan', 'start_date', 'end_date', 'payment_id', 'status'],
        };

        const valueUpdates = Object.entries(headers).map(([sheetName, rowValues]) => ({
            range: `${sheetName}!A1`,
            values: [rowValues],
        }));

        // Execute header updates sequentially or parallel
        for (const update of valueUpdates) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: update.range,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: update.values },
            });
        }

        return NextResponse.json({
            success: true,
            createdSheets: requests.map(r => r.addSheet.properties.title),
            message: 'Database structure initialized successfully.'
        });

    } catch (error: any) {
        console.error('Setup DB Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

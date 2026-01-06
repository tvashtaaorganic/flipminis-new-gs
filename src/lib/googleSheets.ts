import { google } from 'googleapis';
import { Store, Product, User, Payment } from '@/types';

// Utility to clean the private key (handle newline characters)
const getPrivateKey = () => {
    const key = process.env.GOOGLE_PRIVATE_KEY;
    if (!key) return '';
    return key.replace(/\\n/g, '\n');
};

const getAuth = () => {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !key) {
        return null;
    }

    return new google.auth.GoogleAuth({
        credentials: {
            client_email: email,
            private_key: getPrivateKey(),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

const auth = getAuth();
// Only initialize sheets if auth is present, otherwise methods should fail gracefully
export const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;
export const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Helper to determine range based on sheet name
const getRange = (sheetName: string) => `${sheetName}!A2:Z`;

/**
 * FETCHING DATA
 */

export async function getStores(): Promise<Store[]> {
    try {
        if (!sheets || !SPREADSHEET_ID) {
            console.warn('Google Sheets credentials missing. Returning empty stores.');
            return [];
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: getRange('STORES'),
        });

        const rows = response.data.values || [];
        return rows.map((row) => ({
            store_id: row[0],
            username: row[1],
            store_name: row[2],
            whatsapp: row[3],
            category: row[4],
            plan: row[5] as Store['plan'],
            status: row[6] as Store['status'],
            created_at: row[7],
            email: row[8],
            banner_url: row[9] || '', // Column J
            verified: row[10]?.toString().toUpperCase() === 'TRUE', // K
            response_time: row[11] || 'Replies within 24 hours', // L
            city: row[12] || '', // M
            state: row[13] || '', // N
            country: row[14] || '', // O
            pincode: row[15] || '', // P
            address_full: row[16] || '', // Q
            is_open: row[17] !== 'FALSE', // R (Default to open if missing)
            view_count: Number(row[18]) || 0, // S
            whatsapp_click_count: Number(row[19]) || 0, // T
            rating: Number(row[20]) || 0, // U
            total_reviews: Number(row[21]) || 0, // V
            whatsapp_template: row[22] || '', // W
            subscription_start: row[23] || '', // X
            subscription_end: row[24] || '', // Y
        }));
    } catch (error) {
        console.error('Error fetching stores:', error);
        return [];
    }
}

// Product Columns: ID, StoreID, Name, Price, Image, Category, Active, OfferPrice, Stock, HasVariants, VariantType, VariantsJSON, ImagesJSON
export async function getProducts(storeId?: string): Promise<Product[]> {
    try {
        if (!sheets || !SPREADSHEET_ID) {
            console.warn('Google Sheets credentials missing. Returning empty products.');
            return [];
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'PRODUCTS!A2:S', // Updated range to S
        });

        const rows = response.data.values || [];
        const allProducts = rows.map((row) => ({
            product_id: row[0],
            store_id: row[1],
            name: row[2],
            price: Number(row[3]),
            image_url: row[4],
            category: row[5],
            active: row[6]?.toString().toUpperCase() === 'TRUE',
            offer_price: row[7] ? Number(row[7]) : undefined,
            stock: row[8] ? Number(row[8]) : 0,
            has_variants: row[9]?.toString().toUpperCase() === 'TRUE',
            variant_type: row[10] || undefined,
            variants: row[11] ? JSON.parse(row[11]) : [],
            images: row[12] ? JSON.parse(row[12]) : [],
            description: row[13] || '',
            meta_title: row[14] || '',
            meta_description: row[15] || '',
            view_count: Number(row[16]) || 0, // Q
            enquiry_count: Number(row[17]) || 0, // R
            is_trending: row[18]?.toString().toUpperCase() === 'TRUE', // S
        }));

        if (storeId) {
            return allProducts.filter((p) => p.store_id === storeId);
        }
        return allProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

/**
 * WRITING DATA
 */

export async function getPayments(storeId?: string): Promise<Payment[]> {
    try {
        if (!sheets || !SPREADSHEET_ID) return [];

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'PAYMENTS!A2:F',
        });

        const rows = response.data.values || [];
        const payments = rows.map(row => ({
            store_id: row[0],
            plan: row[1],
            start_date: row[2],
            end_date: row[3],
            payment_id: row[4],
            status: row[5],
        }));

        if (storeId) {
            return payments.filter(p => p.store_id === storeId);
        }
        return payments;
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
}

export async function addStore(store: Store) {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const values = [
            [
                store.store_id,
                store.username,
                store.store_name,
                store.whatsapp,
                store.category,
                store.plan,
                store.status,
                new Date().toISOString(),
                store.email || '',
                store.banner_url || '',
                store.verified ? 'TRUE' : 'FALSE',
                store.response_time || 'Replies within 2 hours',
                store.city || '',
                store.state || '',
                store.country || '',
                store.pincode || '',
                store.address_full || '',
                store.is_open === false ? 'FALSE' : 'TRUE',
                store.view_count || 0,
                store.whatsapp_click_count || 0,
                store.rating || 0,
                store.total_reviews || 0,
                store.whatsapp_template || '',
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'STORES!A:W', // Extended range to W
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        return true;
    } catch (error) {
        console.error('Error adding store:', error);
        return false;
    }
}

export async function updateStore(store: Store) {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'STORES!A:A',
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex((row) => row[0] === store.store_id);

        if (rowIndex === -1) return false;

        const realRowIndex = rowIndex + 1; // 1-based

        const values = [
            [
                store.store_id,
                store.username,
                store.store_name,
                store.whatsapp,
                store.category,
                store.plan,
                store.status,
                store.created_at,
                store.email || '',
                store.banner_url || '',
                store.verified ? 'TRUE' : 'FALSE',
                store.response_time || 'Replies within 2 hours',
                store.city || '',
                store.state || '',
                store.country || '',
                store.pincode || '',
                store.address_full || '',
                store.is_open === false ? 'FALSE' : 'TRUE',
                store.view_count || 0,
                store.whatsapp_click_count || 0,
                store.rating || 0,
                store.total_reviews || 0,
                store.whatsapp_template || '',
                store.subscription_start || '',
                store.subscription_end || '',
            ],
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `STORES!A${realRowIndex}:Y${realRowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });

        return true;
    } catch (error) {
        console.error('Error updating store:', error);
        return false;
    }
}

export async function addProduct(product: Product) {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const values = [
            [
                product.product_id,
                product.store_id,
                product.name,
                product.price,
                product.image_url,
                product.category,
                product.active ? 'TRUE' : 'FALSE',
                product.offer_price || '',
                product.stock || 0,
                product.has_variants ? 'TRUE' : 'FALSE',
                product.variant_type || '',
                product.variants ? JSON.stringify(product.variants) : '',
                product.images ? JSON.stringify(product.images) : '[]',
                product.description || '',
                product.meta_title || '',
                product.meta_description || '',
                product.view_count || 0,
                product.enquiry_count || 0,
                product.is_trending ? 'TRUE' : 'FALSE',
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'PRODUCTS!A:S', // Updated to S
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        return true;
    } catch (error) {
        console.error('Error adding product:', error);
        return false;
    }
}

export async function updateProduct(product: Product) {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        // 1. Find the row index
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'PRODUCTS!A:A', // Fetch IDs only
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex((row) => row[0] === product.product_id);

        if (rowIndex === -1) {
            console.error('Product not found for update');
            return false;
        }

        const realRowIndex = rowIndex + 1; // 1-based index (A1 notation)

        const values = [
            [
                product.product_id,
                product.store_id,
                product.name,
                product.price,
                product.image_url,
                product.category,
                product.active ? 'TRUE' : 'FALSE',
                product.offer_price || '',
                product.stock || 0,
                product.has_variants ? 'TRUE' : 'FALSE',
                product.variant_type || '',
                product.variants ? JSON.stringify(product.variants) : '',
                product.images ? JSON.stringify(product.images) : '[]',
                product.description || '',
                product.meta_title || '',
                product.meta_description || '',
                product.view_count || 0,
                product.enquiry_count || 0,
                product.is_trending ? 'TRUE' : 'FALSE',
            ],
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `PRODUCTS!A${realRowIndex}:S${realRowIndex}`, // Updated range to S
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        return true;

    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

export async function logAnalyticsEvent(event: {
    visitor_id: string;
    store_id: string;
    product_id?: string;
    action_type: 'view' | 'whatsapp_click' | 'enquiry_click';
    user_agent?: string;
    ip_hash?: string;
}) {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const values = [
            [
                new Date().toISOString(),
                event.visitor_id,
                event.store_id,
                event.product_id || '',
                event.action_type,
                event.user_agent || '',
                event.ip_hash || ''
            ]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'ANALYTICS_EVENTS!A:G',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });
        return true;
    } catch (error) {
        // Fail silently for analytics to not break app
        console.error('Analytics Error:', error);
        return false;
    }
}

export async function runAnalyticsJob() {
    try {
        if (!sheets || !SPREADSHEET_ID) throw new Error('Sheets not initialized');

        // 1. Fetch Events
        const eventsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'ANALYTICS_EVENTS!A:G',
        });

        const events = eventsResponse.data.values || [];
        if (events.length <= 1) return { message: 'No new events' }; // Header only or empty

        // Skip header
        const rawEvents = events.slice(1);

        // 2. Aggregate Counts
        const storeViews: Record<string, number> = {};
        const storeClicks: Record<string, number> = {};
        const productViews: Record<string, number> = {};
        const productEnquiries: Record<string, number> = {};

        // Deduplication Set: visitor_id + store_id + date(YYYY-MM-DD)
        const processedViews = new Set<string>();

        rawEvents.forEach(row => {
            const [timestamp, visitorId, storeId, productId, type] = row;
            // Simple date key for 24h dedup logic
            const dateKey = timestamp.split('T')[0];
            const dedupKey = `${visitorId}_${storeId}_${productId || 'store'}_${dateKey}`;

            if (type === 'view') {
                if (!processedViews.has(dedupKey)) {
                    processedViews.add(dedupKey);
                    if (productId) {
                        productViews[productId] = (productViews[productId] || 0) + 1;
                    } else {
                        storeViews[storeId] = (storeViews[storeId] || 0) + 1;
                    }
                }
            } else if (type === 'whatsapp_click') {
                if (productId) {
                    storeClicks[storeId] = (storeClicks[storeId] || 0) + 1;
                }
            } else if (type === 'enquiry_click') {
                if (productId) {
                    productEnquiries[productId] = (productEnquiries[productId] || 0) + 1;
                }
            }
        });

        // 3. Prepare Updates
        // We need to know which Row ID corresponds to which Store ID / Product ID.
        // We fetch current data to map IDs.
        const [storesParams, productsParams] = await Promise.all([
            sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'STORES!A:T' }), // Read up to T (Clicks)
            sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'PRODUCTS!A:R' }) // Read up to R (Enquiry)
        ]);

        const storeRows = storesParams.data.values || [];
        const productRows = productsParams.data.values || [];

        const dataToUpdate: any[] = [];

        // Map Stores
        // Header is row 1 (index 0). Data starts row 2 (index 1).
        storeRows.forEach((row, index) => {
            if (index === 0) return; // Skip header
            const storeId = row[0]; // A
            const currentViews = Number(row[18] || 0); // S (Index 18)
            const currentClicks = Number(row[19] || 0); // T (Index 19)

            const addedViews = storeViews[storeId] || 0;
            const addedClicks = storeClicks[storeId] || 0;

            if (addedViews > 0 || addedClicks > 0) {
                const rowIndex = index + 1; // 1-based index
                dataToUpdate.push({
                    range: `STORES!S${rowIndex}:T${rowIndex}`,
                    values: [[currentViews + addedViews, currentClicks + addedClicks]]
                });
            }
        });

        // Map Products
        productRows.forEach((row, index) => {
            if (index === 0) return;
            const productId = row[0]; // A
            const currentViews = Number(row[16] || 0); // Q (Index 16)
            const currentEnquiries = Number(row[17] || 0); // R (Index 17)

            const addedViews = productViews[productId] || 0;
            const addedEnquiries = productEnquiries[productId] || 0;

            if (addedViews > 0 || addedEnquiries > 0) {
                const rowIndex = index + 1;
                dataToUpdate.push({
                    range: `PRODUCTS!Q${rowIndex}:R${rowIndex}`,
                    values: [[currentViews + addedViews, currentEnquiries + addedEnquiries]]
                });
            }
        });

        // 4. Batch Update
        if (dataToUpdate.length > 0) {
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    valueInputOption: 'USER_ENTERED',
                    data: dataToUpdate
                }
            });
        }

        // 5. Clear Analytics Events (Optional: Archive instead of clear?)
        // For now, we clear them to prevent doubleCounting next run.
        // To be safe, we should only delete the rows we read, but for simplicity we clear all except header.
        // A safer approach in prod is to mark them 'processed' or move them.
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: 'ANALYTICS_EVENTS!A2:G10000', // Clear data
        });

        return {
            success: true,
            updatedStores: Object.keys(storeViews).length,
            updatedProducts: Object.keys(productViews).length
        };

    } catch (error) {
        console.error('Job Error:', error);
        throw error;
    }
}

export async function addUser(user: User) {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const values = [
            [
                user.email,
                user.username,
                user.password_hash,
                user.store_id,
                user.role,
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'USERS!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        return true;
    } catch (error) {
        console.error('Error adding user:', error);
        return false;
    }
}

export async function addPayment(payment: Payment) {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const values = [
            [
                payment.store_id,
                payment.plan,
                payment.start_date,
                payment.end_date,
                payment.payment_id,
                payment.status,
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'PAYMENTS!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        return true;
    } catch (error) {
        console.error('Error adding payment:', error);
        return false;
    }
}

// Check if Handle (Username) is unique. Column B.
export async function checkUsernameUnique(username: string): Promise<boolean> {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'USERS!B:B',
        });

        const rows = response.data.values || [];
        const existingUsernames = rows.flat();
        return !existingUsernames.includes(username);
    } catch (error) {
        console.error('Error checking username:', error);
        return false;
    }
}

export async function checkEmailUnique(email: string): Promise<boolean> {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'USERS!A:A',
        });

        const rows = response.data.values || [];
        const existingEmails = rows.flat();
        return !existingEmails.includes(email);
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
}

export async function getUser(username: string): Promise<User | null> {
    try {
        if (!sheets || !SPREADSHEET_ID) return null;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'USERS!A:E', // Updated range to A:E
        });

        const rows = response.data.values || [];
        // Assuming Row structure: email, username, password_hash, store_id, role
        const userRow = rows.find(r => r[1] === username); // Check username at index 1

        if (!userRow) return null;

        return {
            email: userRow[0], // Added email
            username: userRow[1],
            password_hash: userRow[2],
            store_id: userRow[3],
            role: userRow[4] as User['role'], // Updated index for role
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}


export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        if (!sheets || !SPREADSHEET_ID) return null;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'USERS!A:E',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return null;

        // Skip header
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            // Format: Email, Username, Hash, StoreId, Role
            if (row[0] === email) {
                return {
                    email: row[0],
                    username: row[1],
                    password_hash: row[2],
                    store_id: row[3],
                    role: row[4] as 'seller' | 'admin',
                };
            }
        }

        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

// Check if STORE URL/Handle is unique (Username column in STORES/USERS)
// We treat `username` as `handle` now.
export async function checkHandleUnique(handle: string): Promise<boolean> {
    try {
        if (!sheets || !SPREADSHEET_ID) return false;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'USERS!B:B', // Column B is now Username/Handle
        });

        const rows = response.data.values;
        if (!rows) return true;

        const flatRows = rows.flat();
        return !flatRows.includes(handle);
    } catch (error) {
        console.error('Error checking handle:', error);
        return false;
    }
}

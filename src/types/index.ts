export interface Store {
    store_id: string;
    username: string;
    store_name: string;
    whatsapp: string;
    category: string;
    plan: 'free' | 'monthly' | 'yearly';
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
    email?: string;
    banner_url?: string;
    // New Fields
    verified?: boolean;         // Verified Badge
    response_time?: string;     // e.g. "Replies within 1 hour"
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    address_full?: string;
    is_open?: boolean;          // Open/Closed Toggle
    view_count?: number;        // Analytics
    whatsapp_click_count?: number;
    // Layer 5
    rating?: number;            // e.g. 4.5
    total_reviews?: number;     // e.g. 150
    whatsapp_template?: string; // Custom message
    subscription_start?: string; // ISO Date
    subscription_end?: string;   // ISO Date
    description?: string;
}

export interface Variant {
    name: string; // e.g. "XL", "Red"
    price: number;
    offer_price?: number;
    stock: number;
}

export interface Product {
    product_id: string;
    store_id: string;
    name: string;
    price: number;
    offer_price?: number;
    stock: number;
    description?: string;
    image_url: string;
    images?: string[];
    category: string;
    active: boolean;
    has_variants: boolean;
    variant_type?: string;
    variants?: Variant[];
    meta_title?: string;
    meta_description?: string;
    // New Fields
    view_count?: number;
    enquiry_count?: number;
    is_trending?: boolean;
}

export interface User {
    email: string;
    username: string; // Keeps the store handle reference
    password_hash: string;
    store_id: string;
    role: 'admin' | 'seller';
}

export interface Payment {
    store_id: string;
    plan: string;
    start_date: string;
    end_date: string;
    payment_id: string;
    status: string;
}

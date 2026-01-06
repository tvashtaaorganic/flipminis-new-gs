import { NextRequest, NextResponse } from 'next/server';
import { addProduct, updateProduct, getProducts } from '@/lib/googleSheets';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const {
            name,
            price,
            imageUrl,
            image_url, // Client sends this now
            category,
            offer_price,
            stock,
            has_variants,
            variant_type,
            variants,
            images,
            description,
            meta_title,
            meta_description,
            is_trending
        } = body;

        if (!name || (!price && !has_variants) || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newProduct: Product = {
            product_id: uuidv4(),
            store_id: session.storeId,
            name,
            price: Number(price) || 0,
            image_url: image_url || imageUrl || '',
            category,
            active: true,
            offer_price: Number(offer_price) || undefined,
            stock: Number(stock) || 0,
            has_variants: Boolean(has_variants),
            variant_type: variant_type || undefined,
            variants: variants || [],
            images: images || [],
            description: description || '',
            meta_title: meta_title || '',
            meta_description: meta_description || '',
            is_trending: Boolean(is_trending),
            view_count: 0,
            enquiry_count: 0
        };

        const success = await addProduct(newProduct);
        if (!success) {
            return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
        }

        return NextResponse.json({ success: true, product: newProduct });
    } catch (error) {
        console.error('Add Product Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            product_id,
            name,
            price,
            imageUrl,
            image_url,
            category,
            offer_price,
            stock,
            has_variants,
            variant_type,
            variants,
            images,
            active,
            description,
            meta_title,
            meta_description,
            is_trending
        } = body;

        if (!product_id || !name || (!price && !has_variants) || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch existing product to preserve counts
        // This is a bit expensive but ensures data integrity for counts.
        // We fetch all products for the store.
        const existingProducts = await getProducts(session.storeId);
        const existingProduct = existingProducts.find(p => p.product_id === product_id);

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const updatedProduct: Product = {
            product_id,
            store_id: session.storeId, // Ensure it stays in same store
            name,
            price: Number(price) || 0,
            image_url: image_url || imageUrl || '',
            category,
            active: active !== undefined ? active : true,
            offer_price: Number(offer_price) || undefined,
            stock: Number(stock) || 0,
            has_variants: Boolean(has_variants),
            variant_type: variant_type || undefined,
            variants: variants || [],
            images: images || [],
            description: description || '',
            meta_title: meta_title || '',
            meta_description: meta_description || '',
            is_trending: is_trending !== undefined ? Boolean(is_trending) : existingProduct.is_trending || false,
            // Preserve counts
            view_count: existingProduct.view_count || 0,
            enquiry_count: existingProduct.enquiry_count || 0
        };

        const success = await updateProduct(updatedProduct);
        if (!success) {
            return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
        }

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Update Product Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

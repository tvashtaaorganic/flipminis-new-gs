import { NextRequest, NextResponse } from 'next/server';
import { addStore, addUser, addPayment, checkUsernameUnique, checkEmailUnique } from '@/lib/googleSheets';
import { Store, User, Payment } from '@/types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { storeName, whatsapp, category, username, password, plan, paymentId, email, address_full, city, state, pincode, country, banner_url } = body;

        // Basic Validation
        if (!storeName || !whatsapp || !category || !username || !password || !plan || !email) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Username (Handle) Uniqueness
        const isHandleUnique = await checkUsernameUnique(username);
        if (!isHandleUnique) {
            return NextResponse.json({ error: 'Store Handle (Username) already taken. Please choose another.' }, { status: 409 });
        }

        // Email Uniqueness
        const isEmailUnique = await checkEmailUnique(email);
        if (!isEmailUnique) {
            return NextResponse.json({ error: 'Email already registered. Please login instead.' }, { status: 409 });
        }

        const storeId = uuidv4();
        const passwordHash = await bcrypt.hash(password, 10);

        const newStore: Store = {
            store_id: storeId,
            username, // Handle
            store_name: storeName,
            whatsapp,
            category,
            plan,
            status: 'active',
            created_at: new Date().toISOString(),
            email, // Save Email
            // New Fields
            banner_url: banner_url || '',
            address_full: address_full || '',
            city: city || '',
            state: state || '',
            pincode: pincode || '',
            country: country || 'India',
        };

        const newUser: User = {
            email,
            username,
            password_hash: passwordHash,
            store_id: storeId,
            role: 'seller',
        };

        // Calculate End Date
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (plan === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        const newPayment: Payment = {
            store_id: storeId,
            plan,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            payment_id: paymentId || 'manual',
            status: 'success',
        };

        // Parallel write - if one fails we have inconsistent state but for MVP it's acceptable
        const [storeAdded, userAdded, paymentAdded] = await Promise.all([
            addStore(newStore),
            addUser(newUser),
            addPayment(newPayment)
        ]);

        if (!storeAdded || !userAdded) {
            console.error('Failed to create store or user', { storeAdded, userAdded });
            return NextResponse.json({ error: 'Failed to create store or user' }, { status: 500 });
        }

        // Auto-Login: Set Cookie
        const token = await signToken({
            storeId: storeId,
            username: username,
            role: 'seller',
        });

        const response = NextResponse.json({ success: true, storeId, username });

        response.cookies.set('wstore_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

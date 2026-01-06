import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-me';

export interface JWTPayload {
    storeId: string;
    username: string;
    role: string;
}

export function signToken(payload: JWTPayload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, SECRET_KEY) as JWTPayload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('wstore_token')?.value;

    if (!token) return null;
    return verifyToken(token);
}

import Link from 'next/link';
import { cookies } from 'next/headers';
import HeaderClient from '@/components/HeaderClient';

export default async function Header() {
    const cookieStore = await cookies();
    const isLoggedIn = !!cookieStore.get('wstore_token');

    return <HeaderClient isLoggedIn={isLoggedIn} />;
}

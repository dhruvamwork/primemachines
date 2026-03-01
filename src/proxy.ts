import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
    const res = NextResponse.next();

    // Protect the admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin-login') {
        const adminAuthCookie = req.cookies.get('admin_auth');

        if (!adminAuthCookie) {
            const loginUrl = new URL('/admin-login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Protect the vendor dashboard routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
        const vendorAuthCookie = req.cookies.get('vendor_auth');
        const supabaseAuthCookie = req.cookies.getAll().find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

        // Only allow access if a Supabase auth cookie or vendor_auth cookie exists
        if (!supabaseAuthCookie && !vendorAuthCookie) {
            const loginUrl = new URL('/vendor-login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};

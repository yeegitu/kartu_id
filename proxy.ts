import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/';

  // Proteksi route admin
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "default-secret-key-ganti-ini"
      );
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Redirect ke dashboard jika sudah login
  if (isLoginPage && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "default-secret-key-ganti-ini"
      );
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } catch (error) {
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// jose (not jsonwebtoken) is used here because middleware runs on the Edge
// runtime, which doesn't support Node's crypto module that jsonwebtoken needs.
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me');

async function getRole(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('cvtechub_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.role as string) || null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRole(req);

  const requiresAuth = ['/checkout', '/orders'].some((p) => pathname.startsWith(p));
  const requiresVendor = pathname.startsWith('/vendor');

  if (requiresVendor) {
    if (!role) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    if (role !== 'vendor' && role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } else if (requiresAuth && !role) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendor/:path*', '/checkout/:path*', '/orders/:path*'],
};

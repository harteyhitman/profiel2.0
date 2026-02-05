import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for token in cookies (for SSR) or authorization header
  const token = request.cookies.get('authToken')?.value || 
    request.headers.get('authorization')?.replace('Bearer ', '');

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/new-password', '/verify-account'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Dashboard routes that require authentication
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Note: Since we're using localStorage (client-side), we can't check it in middleware
  // The AuthContext will handle client-side redirects
  // This middleware only handles cookie-based tokens for SSR scenarios

  // If accessing dashboard, let it through - client-side AuthContext will handle redirects
  // If accessing auth pages, let them through - client-side will handle redirects if logged in

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

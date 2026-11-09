import { clerkMiddleware } from '@clerk/nextjs/server';

const isPublicRoute = (pathname: string) =>
  ['/sign-in', '/sign-up'].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const isApiRoute = (pathname: string) =>
  ['/api', '/trpc'].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  if (!isApiRoute(pathname) && !isPublicRoute(pathname)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/sign-in', request.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
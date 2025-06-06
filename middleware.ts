import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Your NextAuth config
import { Role } from "@prisma/client"; // Import your Role enum
import {
  publicRoutes,
  authRoutes,
  adminRoutesPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/lib/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;

  // Allow NextAuth specific API paths and public asset paths
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(adminRoutesPrefix);

  if (isAuthRoute) {
    if (isLoggedIn) {
      // If logged in and trying to access login/signup, redirect to dashboard
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url)
      );
    }
    // Allow access to login/signup if not logged in
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    // If not logged in and not a public route, redirect to login
    let callbackUrl = pathname;
    if (request.nextUrl.search) {
      callbackUrl += request.nextUrl.search;
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // At this point, user is either logged in or accessing a public route
  if (isLoggedIn) {
    if (isAdminRoute && userRole !== Role.ADMIN) {
      // Logged in, trying to access admin route without admin role
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    // Add more specific role checks for dashboard sub-routes if needed here
  }
  // If all checks pass, allow the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  // Match all routes except for static files, _next internal files, and favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg).*)"],
};

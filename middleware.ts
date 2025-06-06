import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Your NextAuth config
import { Role } from "@prisma/client"; // Import your Role enum

export async function middleware(request: NextRequest) {
  const session = await auth(); // Retrieves the session, which includes the decoded JWT
  const { pathname } = request.nextUrl;

  // Define admin routes
  const adminRoutes = ["/admin"]; // Add more specific admin paths like /admin/users, /admin/settings

  // Check if the current path starts with any of the admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!session?.user) {
      // Not logged in, redirect to login page
      // Preserve the intended destination for redirect after login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.user.role !== Role.ADMIN) {
      // Logged in but not an admin, redirect to an unauthorized page or home
      // You can create a specific /unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Add other general protections if needed, e.g., all /dashboard routes require login

  return NextResponse.next(); // Continue to the requested page if authorized
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"], // Protect all routes under /admin and /profile
};

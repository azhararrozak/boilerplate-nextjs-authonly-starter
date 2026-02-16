import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const authOnlyRoutes = ["/login", "/register"];
  const isPublicRoute =
    pathname === "/" ||
    publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthOnlyRoute = authOnlyRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthApiRoute = pathname.startsWith("/api/auth");

  // Allow public routes and auth API routes through
  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  // Get session by checking the cookie
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // If user is NOT authenticated
  if (!session) {
    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // Redirect to login for protected routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user IS authenticated
  const userRole = (session.user as { role?: string }).role;

  // Redirect away from login/register if already authenticated
  if (isAuthOnlyRoute) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect /dashboard — admin only
  if (pathname.startsWith("/dashboard") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

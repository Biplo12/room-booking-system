import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("access_token");
  const accessToken = request.cookies.get("access_token")?.value;

  const protectedPaths = ["/admin", "/user", "/book"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && accessToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-admin`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!data.data?.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/book/:path*"],
};

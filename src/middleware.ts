import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // We only care about proxy paths
  if (
    pathname.startsWith("/apiv1/") ||
    pathname.startsWith("/lmsapiv1/") ||
    pathname.startsWith("/uploads/") ||
    pathname.startsWith("/files/")
  ) {
    const requestHeaders = new Headers(req.headers);

    if (token?.accessToken) {
      requestHeaders.set("Authorization", `Bearer ${token.accessToken}`);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check admin-only paths
  const adminPaths = [
    "/dashboard",
    "/users",
    "/events",
    "/tasks",
    "/leaderboard",
    "/settings",
  ];

  const isAdminPath = adminPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/lms", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/apiv1/:path*",
    "/lmsapiv1/:path*",
    "/uploads/:path*",
    "/files/:path*",
    "/dashboard/:path*",
    "/users/:path*",
    "/events/:path*",
    "/tasks/:path*",
    "/leaderboard/:path*",
    "/settings/:path*",
  ],
};

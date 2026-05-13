// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ✅ Allow public routes (no authentication required)
        const publicPaths = ["/", "/login", "/register"];
        if (publicPaths.includes(pathname)) {
          return true;
        }

        // ✅ Allow static files and API routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.includes(".")
        ) {
          return true;
        }

        // ✅ Require authentication for protected routes
        return !!token;
      },
    },
  },
);

// ✅ Only protect specific routes, not everything
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/levels/:path*",
    "/topics/:path*",
    "/quiz/:path*",
    "/profile/:path*",
    "/progress/:path*",
  ],
};

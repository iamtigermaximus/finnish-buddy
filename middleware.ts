// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to protected routes only if authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // User is authenticated if token exists
        return !!token;
      },
    },
  },
);

// Routes that require authentication
export const config = {
  matcher: [
    "/:path*",
    "/dashboard/:path*",
    "/levels/:path*",
    "/topics/:path*",
    "/quiz/:path*",
    "/profile/:path*",
  ],
};

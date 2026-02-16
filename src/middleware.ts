import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const only_non_auth_paths = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow login & Next.js internals
  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  if (!token && only_non_auth_paths.includes(pathname)) {
    return NextResponse.next();
  }

  // Block if not authenticated
  if (token && only_non_auth_paths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && (pathname.startsWith("/new") || pathname.startsWith("/edit"))) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${pathname}`, req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|css|js)).*)"],
};

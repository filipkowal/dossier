import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  addTrailingSlash,
  getIdFromPathname,
  getLocale,
  isLoginPage,
  pathnameIsMissingLocale,
  isLoggedIn,
} from "./utils";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request.headers);

  // Skip file requests

  if (PUBLIC_FILE.test(pathname)) return;

  if (
    pathname.includes("/images") ||
    pathname.includes("/fonts") ||
    pathname.includes("sentry")
  )
    return;

  // Add locale to path if missing

  if (pathnameIsMissingLocale(pathname)) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname ? `/${pathname}` : ""}`, request.url)
    );
  }

  // Auth redirection

  const id = getIdFromPathname(pathname);
  const isAuthorized = await isLoggedIn(id, request.cookies.get(`token-${id}`));

  if (isAuthorized === 404) {
    return NextResponse.rewrite(new URL(`/not-found`, request.url));
  }

  // Redirect to login if not authorized
  if (!isLoginPage(pathname) && !isAuthorized) {
    const pathSegments = pathname.split("/");

    console.log("pathSegments: ", pathSegments);
    // Redirect to /login if not on login or expired page
    if (pathSegments.length < 4) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const newPath = `/${pathSegments[1]}/${pathSegments[2]}/login/`;
    const url = new URL(newPath, request.nextUrl.origin);

    console.log(
      `redirecting back to ${url}, isLoginPage:`,
      isLoginPage(pathname),
      ", isLoggedIn:",
      isAuthorized,
      ", token: ",
      request.cookies.get(`token-${id}`)
    );

    return NextResponse.redirect(url);
  }

  // Redirect to home if authorized and on login page
  if (isLoginPage(pathname) && isAuthorized) {
    console.log('redirecting further to "/"');
    return NextResponse.redirect(request.url.replace("/login", ""));
  }
  // Otherwise, continue

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

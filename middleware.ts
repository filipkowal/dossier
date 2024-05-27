import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { isLoggedIn } from "./utils";

const PUBLIC_FILE = /\.(.*)$/;

export function getLocale(headers: Headers): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  let expectedLanguages = new Negotiator({
    headers: negotiatorHeaders,
  }).languages();
  // @ts-ignore locales are readonly
  const availableLocales: string[] = i18n.locales;
  return matchLocale(
    expectedLanguages?.length === 1 && expectedLanguages[0] === "*" // Negotiator returns ["*"] if no Accept-Language header is present
      ? ["en"]
      : expectedLanguages,
    availableLocales,
    i18n.defaultLocale
  );
}

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

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname ? `/${pathname}` : ""}`, request.url)
    );
  }

  // Auth redirection

  const isLoginPage = i18n.locales.some((locale) =>
    pathname.match(new RegExp(`\/${locale}\/[a-z0-9-]+\/login`))
  );
  const isAuthorized =
    request.cookies.has("token") && (await isLoggedIn()) === true;
  const reqUrlTrailingSlash = request.url.endsWith("/")
    ? request.url
    : `${request.url}/`;

  // Redirect to login if not authorized
  // if (!isLoginPage && !isAuthorized) {
  //   const url = new URL(`login`, reqUrlTrailingSlash);
  //   console.log(reqUrlTrailingSlash, url.pathname);
  //   return NextResponse.redirect(url);
  // }

  // Redirect to home if authorized and on login page
  if (isLoginPage && isAuthorized)
    return NextResponse.redirect(request.url.replace("/login", ""));

  // Otherwise, continue

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

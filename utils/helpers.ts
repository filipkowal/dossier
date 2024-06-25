import { NextRequest } from "next/server";
import type { Locale } from "../i18n-config";
import { i18n } from "../i18n-config";
import { isLoggedIn } from "./fetchers";
import Negotiator from "negotiator";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  de: () => import("../dictionaries/de.json").then((module) => module.default),
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[i18n.locales.includes(locale) ? locale : i18n.defaultLocale]();

export type Dictionary = ReturnType<typeof getDictionary> extends Promise<
  infer T
>
  ? T
  : never;

export function addTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

export async function isReqAuthorized(id?: string, cookie?: RequestCookie) {
  return cookie && id && (await isLoggedIn(id, cookie)) === true;
}

export function getIdFromPathname(pathname: string, locale?: string) {
  return pathname
    .match(new RegExp(`\/${locale}\/[a-z0-9-]+`))?.[0]
    .replace(`/${locale}/`, "");
}

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

export function isLoginPage(pathname: string) {
  return i18n.locales.some((locale) =>
    pathname.match(new RegExp(`\/${locale}\/[a-z0-9-]+\/login`))
  );
}

export function pathnameIsMissingLocale(pathname: string) {
  return i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
}

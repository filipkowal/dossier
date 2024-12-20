import type { Locale } from "../i18n-config";
import { i18n } from "../i18n-config";
import Negotiator from "negotiator";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { logout } from "./fetchers";
import { ReadonlyURLSearchParams } from "next/navigation";

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

export function addHighComma(value?: string) {
  if (!value) return "";

  let commaSeparated = value.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return commaSeparated;
}

export function getIdFromPathname(pathname: string) {
  const localePattern = i18n.locales.map((locale) => `\/${locale}\/`).join("|");
  const regex = new RegExp(`(${localePattern})[a-z0-9-]+`);

  const id = pathname
    .match(regex)?.[0]
    .replace(new RegExp(`\/(${i18n.locales.join("|")})\/`), "");

  if (!id) {
    throw new Error("No id found in pathname: " + pathname);
  }

  return id;
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

export async function logoutAndRedirect(
  id: string,
  locale: Locale,
  router: AppRouterInstance
) {
  try {
    await logout(id);
  } catch (error) {
    throw error;
  }

  router.push(`/${locale}/${id}/login`);
  router.refresh();
}

export function updateSearchParams(
  key: string,
  value: string | null,
  searchParams: ReadonlyURLSearchParams | null,
  router: AppRouterInstance
) {
  // Create a new URLSearchParams object based on the current searchParams
  const params = new URLSearchParams(searchParams?.toString());

  if (value) {
    // If a value is provided, set or update the parameter
    params.set(key, value);
  } else {
    // If value is null, remove the parameter
    params.delete(key);
  }

  // Update the URL with the new search parameters
  router.push(`?${params.toString()}`, { scroll: false });
}

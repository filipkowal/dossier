import type { Locale } from "../i18n-config";
import { i18n } from "../i18n-config";
import Negotiator from "negotiator";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { logout } from "./fetchers";
import { ReadonlyURLSearchParams } from "next/navigation";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { PDFDocument } from "pdf-lib";

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

export async function staticImageDataToBuffer(
  staticImageData: {
    src: string;
  },
  cookie: RequestCookie | undefined
) {
  if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  // Ensure the src is an absolute URL
  const absoluteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${staticImageData.src}`;

  try {
    const response = await fetch(absoluteUrl, {
      headers: {
        Cookie: cookie ? `${cookie.name}=${cookie.value}` : "",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch image: ${response.statusText} - ${errorText}`
      );
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

export async function tc(promise: Promise<any>) {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, error];
  }
}

export function splitTextIntoLines(text: string, maxChars: number): string[] {
  // First split by newlines to preserve bullet point structure
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    // Skip more than one empty line
    if (!paragraph.trim()) {
      if (lines[lines.length - 1] !== "") {
        lines.push("");
      }
      continue;
    }

    // Check if this is a list item
    const regex = /^((\d+\.)\s*)|^(•\s*)/;
    const listItemPrefix = paragraph.trim().match(regex);
    const prefix = listItemPrefix?.[0] ?? "";

    if (prefix) {
      // Extract the bullet point prefix (including any indentation)

      const content = paragraph.slice(prefix?.length);

      // Add extra space around the prefix
      const spacedPrefix = "  " + prefix + "  ";

      // Split the content while preserving the prefix
      const words = content.split(" ");
      let currentLine = spacedPrefix;

      for (const word of words) {
        const nextLine = currentLine + word;
        if (nextLine.length > maxChars && currentLine !== spacedPrefix) {
          lines.push(currentLine);
          // indent the next line of the list item
          currentLine = " ".repeat(spacedPrefix.length) + word + " ";
        } else {
          currentLine += word + " ";
        }
      }

      if (currentLine) lines.push(currentLine);
    } else {
      // For regular text, split by character count
      const words = paragraph.split(" ");
      let currentLine = "";

      for (const word of words) {
        const nextLine = currentLine + word;
        if (nextLine.length > maxChars && currentLine) {
          lines.push(currentLine);
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      }

      if (currentLine) lines.push(currentLine);
    }
  }

  return lines;
}

export async function mergePdfs(
  newPdfPromise: Promise<PDFDocument>,
  pdfDossierPromise: Promise<Response | null> | undefined
) {
  let pdfDossierBytes: ArrayBuffer | undefined;
  let newPdf: PDFDocument | undefined = undefined;

  try {
    [pdfDossierBytes, newPdf] = await Promise.all([
      await (await pdfDossierPromise)?.arrayBuffer(),
      await newPdfPromise,
    ]);
  } catch (error) {
    throw error;
  }

  // Load the original PDF
  const existingPdfDoc = pdfDossierBytes
    ? await PDFDocument.load(pdfDossierBytes)
    : null;

  // Merge the existing PDF into the new PDF
  if (existingPdfDoc) {
    const copiedPages = await newPdf.copyPages(
      existingPdfDoc,
      existingPdfDoc.getPageIndices()
    );
    copiedPages.forEach((page) => newPdf.addPage(page));
  }

  // Serialize the merged PDF
  const mergedPdfBytes = await newPdf.save();

  return mergedPdfBytes;
}

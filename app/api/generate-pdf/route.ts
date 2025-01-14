import { NextRequest } from "next/server";
import { getCandidate, getPdfDossierUrl, Locale, mergePdfs } from "@/utils";
import createNewPdf from "./createNewPdf";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const locale: Locale = searchParams.get("locale") as Locale;
    const id = searchParams.get("id");
    const cookie = req.cookies.get(`token-${id}`);

    if (!locale || !id) {
      return new Response("Missing locale or id", {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const pdfDossierUrl = await getPdfDossierUrl(locale, id, cookie);

    const pdfDossierPromise = pdfDossierUrl
      ? fetch(pdfDossierUrl, {
          headers: {
            Cookie: cookie ? `${cookie.name}=${cookie.value}` : "",
          },
        }).catch((error) => {
          console.error("PDF Dossier Fetch Error:", error);
          return null;
        })
      : undefined;

    const candidate = await getCandidate(locale, id, cookie);

    const newPdf = createNewPdf(candidate, locale);
    const mergedPdf = await mergePdfs(newPdf, pdfDossierPromise);

    return new Response(mergedPdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${candidate.firstName}-${candidate.lastName}-Dossier.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);

    return new Response("Failed to generate PDF", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

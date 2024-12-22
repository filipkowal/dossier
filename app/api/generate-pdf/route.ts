import { PDFDocument, rgb } from "pdf-lib";
import { Candidate, getCandidate, getPdfDossierUrl, Locale } from "@/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const locale: Locale = searchParams.get("locale") as Locale;
    const id = searchParams.get("id");
    const cookie = req.cookies.get(`token-${id}`);
    if (!locale || !id) {
      return new Response("Missing locale or id", { status: 400 });
    }

    const pdfDossierUrl = await getPdfDossierUrl(locale, id, cookie);

    console.log("pdfDossierUrl", pdfDossierUrl);
    const pdfDossierPromise = pdfDossierUrl
      ? fetch(pdfDossierUrl, {
          headers: { Cookie: cookie ? `${cookie.name}=${cookie.value}` : "" },
        })
      : undefined;

    const candidate = await getCandidate(locale, id, cookie);

    const newPdf = await createNewPdf(candidate);

    // return new Response(Buffer.from(mergedPdfBytes), {
    //   headers: {
    //     "Content-Type": "application/pdf",
    //     "Content-Disposition": `attachment; filename=${candidate.firstName}-${candidate.lastName}-dossier.pdf`,
    //   },
    // });

    let pdfDossierBytes: ArrayBuffer | undefined;
    try {
      const pdfDossier = await pdfDossierPromise;
      pdfDossierBytes = await pdfDossier?.arrayBuffer();
    } catch (error) {
      console.log(error);
    }

    console.log("pdfDossierBytes", pdfDossierBytes);

    return new Response(await newPdf.save(), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${candidate.firstName}-${candidate.lastName}-Dossier.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return error;
  }
}

async function createNewPdf(candidate: Candidate) {
  // Step 1: Create a new PDF document for the candidate details
  const newPdf = await PDFDocument.create();
  const newPage = newPdf.addPage([595, 842]); // A4 size
  const { width, height } = newPage.getSize();

  // Add candidate details
  newPage.drawText("Candidate Details", {
    x: 50,
    y: height - 50,
    size: 24,
    color: rgb(0, 0, 0),
  });

  let yPosition = height - 100;
  const details = [
    `Name: ${candidate.firstName} ${candidate.lastName}`,
    `Gender: ${candidate.gender === "m" ? "Male" : "Female"}`,
    `Vacancy Title: ${candidate.vacancyTitle}`,
    `Current Position: ${candidate.currentPosition}`,
    `Employer: ${candidate.employerName}`,
    `Phone: ${candidate.phoneNumber}`,
    `Email: ${candidate.email}`,
    `Desired Salary: ${candidate.desiredSalary}`,
    `Notice Period: ${candidate.noticePeriod}`,
    `Desired Workload: ${candidate.desiredWorkload}`,
  ];

  for (const detail of details) {
    newPage.drawText(detail, {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  }

  return newPdf;
}

async function mergePdfs(
  newPdf: PDFDocument,
  pdfDossierPromise: Promise<Response> | undefined
) {
  // Step 2: Await the fetch of the original PDF dossier
  let pdfDossierBytes: ArrayBuffer | undefined;
  try {
    const pdfDossier = await pdfDossierPromise;
    console.log(
      "pdfDossier length",
      (await pdfDossier?.arrayBuffer())?.byteLength
    );
    pdfDossierBytes = await pdfDossier?.arrayBuffer();
  } catch (error) {
    console.log(error);
  }

  // Step 3: Load the original PDF
  const existingPdfDoc = pdfDossierBytes
    ? await PDFDocument.load(pdfDossierBytes)
    : null;

  // Step 4: Merge the existing PDF into the new PDF
  if (existingPdfDoc) {
    const copiedPages = await newPdf.copyPages(
      existingPdfDoc,
      existingPdfDoc.getPageIndices()
    );
    copiedPages.forEach((page) => newPdf.addPage(page));
  }

  // Step 5: Serialize the merged PDF
  const mergedPdfBytes = await newPdf.save();

  return mergedPdfBytes;
}

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Candidate,
  fetchImage,
  getCandidate,
  getPdfDossierUrl,
  Locale,
  staticImageDataToBuffer,
  tc,
} from "@/utils";
import { NextRequest } from "next/server";
import logoImg from "@/public/logo.png";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

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

    const pdfDossierPromise = pdfDossierUrl
      ? fetch(pdfDossierUrl, {
          headers: { Cookie: cookie ? `${cookie.name}=${cookie.value}` : "" },
        })
      : undefined;

    const candidate = await getCandidate(locale, id, cookie);

    const newPdf = createNewPdf(candidate, cookie);

    const mergedPdf = await mergePdfs(newPdf, pdfDossierPromise);

    console.log(mergedPdf);

    return new Response(mergedPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${candidate.firstName}-${candidate.lastName}-Dossier.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return Response.error();
  }
}

async function createNewPdf(
  candidate: Candidate,
  cookie: RequestCookie | undefined
) {
  // Step 1: Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  // Step 2: Load a standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  async function addCandImage() {
    if (process.env.NODE_ENV === "development") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    const candidateImageUrl = candidate.candidateImage || ""; // Replace with candidate's image URL

    const candidateImageBase64 = await fetchImage(candidateImageUrl, cookie);

    const mimeType = candidateImageBase64.substring(
      candidateImageBase64.indexOf(":") + 1,
      candidateImageBase64.indexOf(";")
    );

    const base64Data = candidateImageBase64.split(",")[1]; // Remove the data URL prefix
    const imageBuffer = Buffer.from(base64Data, "base64");

    let image;
    console.log("MIME TYPE: ", mimeType);
    if (mimeType.includes("png")) {
      image = await pdfDoc.embedPng(imageBuffer);
    } else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
      image = await pdfDoc.embedJpg(imageBuffer);
    } else {
      throw new Error("Unsupported image format");
    }

    // Draw the candidate image
    const imageDims = image.scale(0.6);
    page.drawImage(image, {
      x: width - 120,
      y: height - 150,
      width: imageDims.width,
      height: imageDims.height,
    });
  }

  await addCandImage();

  async function addLogo() {
    // Fetch and embed the logo
    const [logoBuffer, error] = await tc(
      staticImageDataToBuffer(logoImg, cookie)
    );
    if (error) throw new Error("Error converting logo:\n" + error);
    const logo = await pdfDoc.embedPng(logoBuffer);

    // Draw the logo
    const logoDims = logo.scale(0.5);
    page.drawImage(logo, {
      x: 50,
      y: height - 100,
      width: logoDims.width,
      height: logoDims.height,
    });
  }
  await addLogo();

  // Add candidate name and vacancy
  const headerY = height - 50;
  page.drawText("Candidate:", {
    x: 200,
    y: headerY,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${candidate.firstName} ${candidate.lastName}`, {
    x: 270,
    y: headerY,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Vacancy:", {
    x: 200,
    y: headerY - 20,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  candidate?.vacancyTitle &&
    page.drawText(candidate?.vacancyTitle, {
      x: 270,
      y: headerY - 20,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

  // Step 4: Add the "Professional Details" section
  const professionalDetailsY = headerY - 80;
  page.drawText("Professional Details", {
    x: 50,
    y: professionalDetailsY,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  const details = [
    `Desired salary: ${candidate.desiredSalary}`,
    `Notice period: ${candidate.noticePeriod}`,
    `Current position: ${candidate.currentPosition}`,
  ];

  let detailsY = professionalDetailsY - 20;
  for (const detail of details) {
    page.drawText(detail, {
      x: 50,
      y: detailsY,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    detailsY -= 15;
  }

  // Step 5: Add the "Relevant Experience" section
  const interviewSummaryText = candidate.interviewSummary;
  const interviewSummaryY = detailsY - 20;
  let interviewSummaryYPos = interviewSummaryY - 20;

  if (interviewSummaryText) {
    page.drawText("Interview Summary", {
      x: 50,
      y: interviewSummaryY,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    const interviewSummaryLines = splitTextIntoLines(interviewSummaryText, 80); // Split text into lines for wrapping
    for (const line of interviewSummaryLines) {
      page.drawText(line, {
        x: 50,
        y: interviewSummaryYPos,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      interviewSummaryYPos -= 15;
    }
  }

  const reasonText = candidate.reasonForChange;
  const reasonY = interviewSummaryYPos - 20;
  let reasonYPos = reasonY - 20;
  if (reasonText) {
    // Step 6: Add the "Reason for Change" section
    page.drawText("Reason for Change", {
      x: 50,
      y: reasonY,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    const reasonLines = splitTextIntoLines(reasonText, 80); // Split text into lines for wrapping
    for (const line of reasonLines) {
      page.drawText(line, {
        x: 50,
        y: reasonYPos,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      reasonYPos -= 15;
    }
  }

  // Step 7: Return the created PDF
  return pdfDoc;
}

// Helper Function: Split text into lines
function splitTextIntoLines(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxChars) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

async function mergePdfs(
  newPdfPromise: Promise<PDFDocument>,
  pdfDossierPromise: Promise<Response> | undefined
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

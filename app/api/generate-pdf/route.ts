import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib";
import {
  addHighComma,
  Candidate,
  fetchImage,
  getCandidate,
  getPdfDossierUrl,
  Locale,
  staticImageDataToBuffer,
  tc,
} from "@/utils";
import { NextRequest } from "next/server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { readFileSync } from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { convert } from "html-to-text";

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
  console.log(candidate);
  // Step 1: Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  // Step 2: Load a standard font

  const stolzlPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Stolzl-Medium.ttf"
  );
  const merriweatherPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Merriweather-Regular.ttf"
  );

  const stolzlBytes = readFileSync(path.resolve(__dirname, stolzlPath));
  const merriweatherBytes = readFileSync(
    path.resolve(__dirname, merriweatherPath)
  );

  const font = await pdfDoc.embedFont(merriweatherBytes);
  const boldFont = await pdfDoc.embedFont(stolzlBytes);

  const ml = 50;
  const mt = 71;
  const headingSize = 14;
  const textSize = 12;
  const lineHeight = 23;
  const headingLineHeight = 30;
  const convertOptions = {
    wordwrap: null,
    preserveNewlines: false,
  };
  const maxChars = 75;

  function getPageAndY(y: number): [PDFPage, number] {
    if (y < 50) {
      return [pdfDoc.addPage([595, 842]), height - mt];
    }
    return [page, y];
  }

  // async function addCandImage() {
  //   if (process.env.NODE_ENV === "development") {
  //     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  //   }

  //   const candidateImageUrl = candidate.candidateImage || ""; // Replace with candidate's image URL

  //   const candidateImageBase64 = await fetchImage(candidateImageUrl, cookie);

  //   const mimeType = candidateImageBase64.substring(
  //     candidateImageBase64.indexOf(":") + 1,
  //     candidateImageBase64.indexOf(";")
  //   );

  //   const base64Data = candidateImageBase64.split(",")[1]; // Remove the data URL prefix
  //   const imageBuffer = Buffer.from(base64Data, "base64");

  //   let image;
  //   if (mimeType.includes("png")) {
  //     image = await pdfDoc.embedPng(imageBuffer);
  //   } else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
  //     image = await pdfDoc.embedJpg(imageBuffer);
  //   } else {
  //     throw new Error("Unsupported image format");
  //   }

  //   // Draw the candidate image
  //   const imageDims = image.scale(0.6);
  //   page.drawImage(image, {
  //     x: width - 120,
  //     y: height - 150,
  //     width: imageDims.width,
  //     height: imageDims.height,
  //   });
  // }

  // await addCandImage();

  // Add the logo on top of the black square
  const logoPath = path.join(process.cwd(), "public", "logo-black-sm.png");
  const logoBytes = readFileSync(logoPath);
  const logo = await pdfDoc.embedPng(logoBytes);
  const logoDims = logo.scale(0.5);
  page.drawImage(logo, {
    x: 11,
    y: height - 40,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Add candidate name and vacancy
  const headerY = height - mt;
  page.drawText("Candidate:", {
    x: ml,
    y: headerY,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${candidate.firstName} ${candidate.lastName}`, {
    x: ml + 130,
    y: headerY,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Vacancy:", {
    x: ml,
    y: headerY - headingLineHeight,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  candidate?.vacancyTitle &&
    page.drawText(candidate?.vacancyTitle, {
      x: ml + 130,
      y: headerY - headingLineHeight,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

  // Step 4: Add the "Professional Details" section
  const proDetailsHeadingY = headerY - headingLineHeight * 3;
  page.drawText("Professional & Personal Details", {
    x: ml,
    y: proDetailsHeadingY,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  const proDetails: [string, string | undefined][] = [
    [`Current position: `, candidate.currentPosition],
    [`Notice period: `, candidate.noticePeriod],
    [`Desired salary: `, `CHF ${addHighComma(candidate.desiredSalary)}`],
    [`Desired workload: `, `${candidate.desiredWorkload}%`],
  ];

  let proDetailsY = proDetailsHeadingY - headingLineHeight;
  for (const detail of proDetails) {
    if (!detail[1]) continue;

    page.drawText(detail[0], {
      x: ml,
      y: proDetailsY,
      size: 12,
      font,
      color: rgb(0, 0, 0),
      maxWidth: maxChars * 7,
    });
    page.drawText(detail[1], {
      x: ml + 130,
      y: proDetailsY,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // go to the next line
    proDetailsY -= lineHeight;
    if (detail.length > 75) {
      // if the line is too long and wrapped, go to next line
      proDetailsY -= lineHeight;
    }
  }
  if (candidate.birthDate) {
    page.drawText("Birth Date:", {
      x: ml,
      y: proDetailsY,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      candidate?.candidateAge
        ? candidate.birthDate + ` (${candidate.candidateAge})`
        : candidate.birthDate,
      {
        x: ml + 130,
        y: proDetailsY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    );
    proDetailsY -= lineHeight;
  }

  const contactDetailsHeadingY = proDetailsY - headingLineHeight;
  let contactDetailsY = contactDetailsHeadingY - headingLineHeight;
  page.drawText("Contact", {
    x: ml,
    y: contactDetailsHeadingY,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  const contactDetails = [
    candidate.email,
    candidate.phoneNumber,
    candidate.linkedIn?.substring(25),
  ];
  const address = [
    candidate.address?.street,
    candidate.address?.zip + " " + candidate.address?.city,
    candidate.address?.country,
  ];

  const columnGap = 30;
  const columnWidth = 240;

  for (const detail of contactDetails) {
    if (!detail) continue;

    page.drawText(detail, {
      x: ml,
      y: contactDetailsY,
      size: 12,
      font,
      color: rgb(0, 0, 0),
      maxWidth: columnWidth,
      wordBreaks: [""],
    });
    contactDetailsY -= lineHeight;
    if (detail.length * 7 > columnWidth) {
      contactDetailsY -= lineHeight;
    }
  }

  let addressY = contactDetailsHeadingY - headingLineHeight;
  for (const detail of address) {
    if (!detail) continue;

    page.drawText(detail, {
      x: ml + columnWidth + columnGap,
      y: addressY,
      size: 12,
      font,
      color: rgb(0, 0, 0),
      maxWidth: columnWidth,
      wordBreaks: [""],
    });
    addressY -= lineHeight;
    if (detail.length * 7 > columnWidth) {
      addressY -= lineHeight;
    }
  }

  // Step 5: Add the "Relevant Experience" section
  const interviewSummaryHeadingY = contactDetailsY - headingLineHeight;
  let interviewSummaryY = interviewSummaryHeadingY - headingLineHeight;

  const interviewSummaryHtml = candidate.interviewSummary;
  const interviewSummaryText = interviewSummaryHtml
    ? convert(interviewSummaryHtml, convertOptions)
    : null;

  if (interviewSummaryText) {
    page.drawText("Interview Summary", {
      x: ml,
      y: interviewSummaryHeadingY,
      size: headingSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    const interviewSummaryLines = splitTextIntoLines(
      interviewSummaryText,
      maxChars
    );
    for (const line of interviewSummaryLines) {
      page.drawText(line, {
        x: ml,
        y: interviewSummaryY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      interviewSummaryY -= lineHeight;
      [page, interviewSummaryY] = getPageAndY(interviewSummaryY);
    }
  }

  const reasonHtml = candidate.reasonForChange;
  const reasonText = reasonHtml ? convert(reasonHtml, convertOptions) : null;

  const reasonHeadingY = interviewSummaryY - headingLineHeight;
  let reasonY = reasonHeadingY - headingLineHeight;
  if (reasonText) {
    // Step 6: Add the "Reason for Change" section
    page.drawText("Reason for Change", {
      x: ml,
      y: reasonHeadingY,
      size: headingSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    [page, reasonY] = getPageAndY(reasonY);

    const reasonLines = splitTextIntoLines(reasonText, maxChars); // Split text into lines for wrapping
    for (const line of reasonLines) {
      page.drawText(line, {
        x: ml,
        y: reasonY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      reasonY -= lineHeight;
      [page, reasonY] = getPageAndY(reasonY);
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

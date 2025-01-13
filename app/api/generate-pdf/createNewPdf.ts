import { PDFDocument, rgb } from "pdf-lib";
import { Candidate } from "@/utils";
import { readFileSync } from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import {
  ml,
  mt,
  textSize,
  headingLineHeight,
  lineHeight,
  secondColumnX,
  maxChars,
} from "./constants";
import getHelpers from "./getHelpers";

export default async function createNewPdf(candidate: Candidate) {
  // Create a new PDF document

  let pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { height: pageHeight } = page.getSize();

  // Load fonts

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

  const { drawHeading, drawText, drawLongParagraph, getNextLineY, getTexts } =
    getHelpers(font, boldFont, pageHeight);

  const {
    proDetails,
    birthDate,
    contactDetails,
    address,
    interviewSummary,
    reason,
  } = getTexts(candidate);

  // Add dt logo

  const logoPath = path.join(process.cwd(), "public", "logo-black-sm.png");
  const logoBytes = readFileSync(logoPath);
  const logo = await pdfDoc.embedPng(logoBytes);
  const logoDims = logo.scale(0.4);
  page.drawImage(logo, {
    x: 14,
    y: pageHeight - 37,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Add candidate name and vacancy

  let currentY = pageHeight - mt;

  drawHeading(page, "Candidate:", currentY);
  drawHeading(
    page,
    `${candidate.firstName} ${candidate.lastName}`,
    currentY,
    secondColumnX,
    18
  );

  if (candidate.vacancyTitle) {
    currentY = currentY - headingLineHeight;

    drawHeading(page, "Vacancy:", currentY);
    drawHeading(page, candidate.vacancyTitle, currentY, secondColumnX, 18);
  }

  // Add the "Personal & Professional Details" section

  currentY = currentY - headingLineHeight - lineHeight;

  drawHeading(page, "Professional & Personal Details", currentY);

  currentY = currentY - headingLineHeight;

  for (const detail of proDetails) {
    if (!detail[1]) continue;

    drawText(page, detail[0], currentY);
    drawText(page, detail[1], currentY, secondColumnX);

    currentY = getNextLineY(currentY, detail.length > maxChars);
  }

  if (birthDate) {
    drawText(page, "Birth Date:", currentY);
    drawText(page, birthDate, currentY, secondColumnX);

    currentY -= lineHeight;
  }

  // Add the "Contact" section

  currentY = currentY - headingLineHeight;

  drawHeading(page, "Contact", currentY);

  currentY = currentY - headingLineHeight;
  let addressY = currentY;

  const columnGap = 30;
  const columnWidth = 240;

  for (const detail of contactDetails) {
    if (!detail) continue;

    page.drawText(detail, {
      x: ml,
      y: currentY,
      size: textSize,
      font,
      color: rgb(0, 0, 0),
      maxWidth: columnWidth,
      wordBreaks: [""],
    });

    currentY = getNextLineY(currentY, detail.length * 7 > columnWidth);
  }

  for (const detail of address) {
    if (!detail) continue;

    page.drawText(detail, {
      x: ml + columnWidth + columnGap,
      y: addressY,
      size: textSize,
      font,
      color: rgb(0, 0, 0),
      maxWidth: columnWidth,
      wordBreaks: [""],
    });

    addressY = getNextLineY(addressY, detail.length * 7 > columnWidth);
  }

  // Set the currentY to the lowest of the two columns
  currentY = Math.min(currentY, addressY);

  // Add the "Relevant Experience" section

  currentY = currentY - headingLineHeight;

  [pdfDoc, page, currentY] = drawLongParagraph(
    interviewSummary,
    "Interview Summary",
    currentY,
    page,
    pdfDoc
  );

  // Add the "Reason for Change" section

  currentY = currentY - headingLineHeight;

  [pdfDoc, page, currentY] = drawLongParagraph(
    reason,
    "Reason for Change",
    currentY,
    page,
    pdfDoc
  );

  return pdfDoc;
}

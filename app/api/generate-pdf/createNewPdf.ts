import { PDFDocument, rgb } from "pdf-lib";
import { Candidate, getDictionary, Locale, User } from "@/utils";
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
  secondColumnXTitle,
} from "./constants";
import getHelpers from "./getHelpers";

export default async function createNewPdf(
  candidate: Candidate,
  locale: Locale,
  user: User
) {
  const dict = await getDictionary(locale);
  const d = dict.candidate;

  // Create a new PDF document

  let pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { height: pageHeight, width: pageWidth } = page.getSize();

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

  const {
    drawHeading,
    drawText,
    drawLongParagraph,
    getNextLineY,
    getTexts,
    drawWrappedText,
    drawWrappedHeading,
  } = getHelpers(font, boldFont, pageHeight);

  const {
    proDetails,
    birthDate,
    contactDetails,
    address,
    interviewSummary,
    reason,
  } = getTexts(candidate, user);

  // Add dt logo

  const logoPath = path.join(process.cwd(), "public", "logo-black-name-sm.png");
  const logoBytes = readFileSync(logoPath);
  const logo = await pdfDoc.embedPng(logoBytes);
  const logoDims = logo.scale(0.4);
  page.drawImage(logo, {
    x: ml,
    y: pageHeight - 40,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Add candidate name and vacancy

  let currentY = pageHeight - mt;

  drawHeading(page, `${d.candidate}:`, currentY);
  let linesDrawn = 0;
  [pdfDoc, page, currentY, linesDrawn] = drawWrappedHeading(
    pdfDoc,
    page,
    `${candidate.firstName} ${candidate.lastName}`,
    currentY,
    secondColumnXTitle,
    18,
    pageWidth - ml - secondColumnXTitle
  );
  // If multiple lines were drawn for the name, add only the extra spacing beyond the first line
  currentY += lineHeight; // undo first line's decrement; keep extra lines' spacing only

  if (candidate.vacancyTitle) {
    currentY = currentY - headingLineHeight;

    drawHeading(page, `${d.vacancy}:`, currentY);
    [pdfDoc, page, currentY, linesDrawn] = drawWrappedHeading(
      pdfDoc,
      page,
      candidate.vacancyTitle,
      currentY,
      secondColumnXTitle,
      18,
      pageWidth - ml - secondColumnXTitle
    );
    currentY += lineHeight; // undo first line's decrement for the title
  }

  // Add the "Personal & Professional Details" section

  currentY = currentY - headingLineHeight - lineHeight;

  drawHeading(page, d.proAndPersonalDetails, currentY);

  currentY = currentY - headingLineHeight;

  for (const detail of proDetails) {
    if (!detail[1]) continue;

    drawText(page, `${d[detail[0]]}:`, currentY);
    [pdfDoc, page, currentY] = drawWrappedText(
      pdfDoc,
      page,
      detail[1],
      currentY,
      secondColumnX,
      textSize,
      pageWidth - ml - secondColumnX
    );
  }

  if (birthDate) {
    drawText(page, `${d.birthDate}:`, currentY);
    [pdfDoc, page, currentY] = drawWrappedText(
      pdfDoc,
      page,
      birthDate,
      currentY,
      secondColumnX,
      textSize,
      pageWidth - ml - secondColumnX
    );
  }

  // Add the "Contact Details" section

  currentY = currentY - headingLineHeight;

  drawHeading(page, d.contactDetails, currentY);

  currentY = currentY - headingLineHeight;
  let addressY = currentY;

  const columnGap = 30;
  const columnWidth = 240;

  for (const detail of contactDetails) {
    if (!detail) continue;

    [pdfDoc, page, currentY] = drawWrappedText(
      pdfDoc,
      page,
      detail,
      currentY,
      ml,
      textSize,
      columnWidth
    );
  }

  for (const detail of address) {
    if (!detail) continue;

    [pdfDoc, page, addressY] = drawWrappedText(
      pdfDoc,
      page,
      detail,
      addressY,
      ml + columnWidth + columnGap,
      textSize,
      columnWidth
    );
  }

  // Set the currentY to the lowest of the two columns
  currentY = Math.min(currentY, addressY);

  // Add the "interview summary" section

  currentY = currentY - headingLineHeight;

  [pdfDoc, page, currentY] = drawLongParagraph(
    interviewSummary,
    d.interviewSummary,
    currentY,
    page,
    pdfDoc
  );

  // Add the "Reason for Change" section

  currentY = currentY - headingLineHeight;

  [pdfDoc, page, currentY] = drawLongParagraph(
    reason,
    d.reasonForChange,
    currentY,
    page,
    pdfDoc
  );

  return pdfDoc;
}

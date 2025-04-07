import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import {
  headingSize,
  headingLineHeight,
  lineHeight,
  maxChars,
  ml,
  mt,
  textSize,
} from "./constants";
import { addHighComma, Candidate, splitTextIntoLines } from "@/utils";
import { convert } from "html-to-text";

const convertOptions = {
  wordwrap: null,
  selectors: [
    {
      selector: "ul",
      format: "unorderedList",
      options: {
        itemPrefix: "• ",
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "ol",
      format: "orderedList",
      options: {
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
  ],
};

export default function getHelpers(
  font: PDFFont,
  boldFont: PDFFont,
  pageHeight: number
) {
  function drawText(
    page: PDFPage,
    text: string,
    y: number,
    x: number = ml,
    size: number = textSize
  ) {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  }

  function drawHeading(
    page: PDFPage,
    text: string,
    y: number,
    x: number = ml,
    size: number = headingSize
  ) {
    page.drawText(text, {
      x,
      y,
      size,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  function drawLongParagraph(
    text: string | null,
    title: string,
    currentY: number,
    currentPage: PDFPage,
    pdfDoc: PDFDocument
  ): [PDFDocument, PDFPage, number] {
    let y = currentY;
    let page = currentPage;

    if (text) {
      drawHeading(page, title, y);

      y = y - headingLineHeight;

      const interviewSummaryLines = splitTextIntoLines(text || "", maxChars);

      for (const line of interviewSummaryLines) {
        const oneLine = line.replace(/\n/g, "");
        drawText(page, oneLine, y);
        [pdfDoc, page, y] = getPageAndY(pdfDoc, page, y);
      }
    }

    return [pdfDoc, page, y];
  }

  function getPageAndY(
    pdfDoc: PDFDocument,
    page: PDFPage,
    y: number
  ): [PDFDocument, PDFPage, number] {
    // If the text is too close to the bottom of the page, create a new page
    if (y < mt) {
      return [pdfDoc, pdfDoc.addPage([595, 842]), pageHeight - mt];
    }

    return [pdfDoc, page, y - lineHeight];
  }

  function getNextLineY(currentY: number, lineIsTooLong: boolean) {
    let y = currentY - lineHeight;

    if (lineIsTooLong) {
      return y - lineHeight;
    }

    return y;
  }

  function getTexts(candidate: Candidate) {
    const proDetails: [string, string | undefined][] = [
      [`Current position: `, candidate.currentPosition],
      [`Notice period: `, candidate.noticePeriod],
      [
        `Desired salary: `,
        candidate.desiredSalary &&
          `CHF ${addHighComma(candidate.desiredSalary)}`,
      ],
      [
        `Desired workload: `,
        candidate.desiredWorkload && `${candidate.desiredWorkload}%`,
      ],
    ].filter(
      (detail): detail is [string, string | undefined] =>
        typeof detail[1] === "string"
    );

    const birthDate =
      candidate.birthDate &&
      `${candidate.birthDate} (${candidate.candidateAge})`;

    const contactDetails = [
      candidate.email,
      candidate.phoneNumber,
      candidate.linkedIn?.substring(25),
    ].filter((detail): detail is string => typeof detail === "string");

    const address = [
      candidate.address?.street,
      candidate.address?.zip
        ? candidate.address?.zip + " " + candidate.address?.city
        : candidate.address?.city,
      candidate.address?.country,
    ].filter((detail): detail is string => typeof detail === "string");

    const interviewSummary =
      candidate.interviewSummary && candidate.interviewSummary.length > 0
        ? convert(candidate.interviewSummary, convertOptions)
        : null;

    const reason =
      candidate.reasonForChange && candidate.reasonForChange.length > 0
        ? convert(candidate.reasonForChange, convertOptions)
        : null;

    return {
      proDetails,
      birthDate,
      contactDetails,
      address,
      interviewSummary,
      reason,
    };
  }

  return {
    drawText,
    drawHeading,
    drawLongParagraph,
    getPageAndY,
    getNextLineY,
    getTexts,
  };
}

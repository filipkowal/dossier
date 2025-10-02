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
import {
  addHighComma,
  Candidate,
  Dictionary,
  splitTextIntoLines,
  User,
} from "@/utils";
import { convert } from "html-to-text";

const convertOptions = {
  wordwrap: null,
  selectors: [
    {
      selector: "p",
      format: "block",
      options: {
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "ul",
      format: "unorderedList",
      options: {
        itemPrefix: "• ",
        leadingLineBreaks: 1,
        trailingLineBreaks: 2,
      },
    },
    {
      selector: "ol",
      format: "orderedList",
      options: {
        leadingLineBreaks: 1,
        trailingLineBreaks: 2,
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

  function drawWrapped(
    pdfDoc: PDFDocument,
    page: PDFPage,
    text: string,
    y: number,
    x: number,
    size: number,
    maxWidth: number,
    isBold: boolean
  ): [PDFDocument, PDFPage, number, number] {
    const activeFont = isBold ? boldFont : font;
    let currentLine = "";
    let currentY = y;
    let linesDrawn = 0;

    const words = text.split(" ");

    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const lineWidth = activeFont.widthOfTextAtSize(testLine, size);
      if (lineWidth > maxWidth && currentLine) {
        if (currentY - lineHeight < mt) {
          page = pdfDoc.addPage([595, 842]);
          currentY = pageHeight - mt;
        }
        page.drawText(currentLine, {
          x,
          y: currentY,
          size,
          font: activeFont,
          color: rgb(0, 0, 0),
        });
        currentY -= lineHeight;
        linesDrawn += 1;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (currentY - lineHeight < mt) {
        page = pdfDoc.addPage([595, 842]);
        currentY = pageHeight - mt;
      }
      page.drawText(currentLine, {
        x,
        y: currentY,
        size,
        font: activeFont,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
      linesDrawn += 1;
    }

    return [pdfDoc, page, currentY, linesDrawn];
  }

  function drawWrappedText(
    pdfDoc: PDFDocument,
    page: PDFPage,
    text: string,
    y: number,
    x: number,
    size: number,
    maxWidth: number
  ): [PDFDocument, PDFPage, number, number] {
    return drawWrapped(pdfDoc, page, text, y, x, size, maxWidth, false);
  }

  function drawWrappedHeading(
    pdfDoc: PDFDocument,
    page: PDFPage,
    text: string,
    y: number,
    x: number,
    size: number,
    maxWidth: number
  ): [PDFDocument, PDFPage, number, number] {
    return drawWrapped(pdfDoc, page, text, y, x, size, maxWidth, true);
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
        // Ensure there is room for the next line; otherwise, start a new page
        if (y - lineHeight < mt) {
          page = pdfDoc.addPage([595, 842]);
          y = pageHeight - mt;
        }

        const oneLine = line.replace(/\n/g, "");
        drawText(page, oneLine, y);
        y = y - lineHeight;
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

  function getTexts(candidate: Candidate, user: User) {
    const proDetails: [keyof Dictionary["candidate"], string | undefined][] = [
      ["currentPosition", candidate.currentPosition],
      [`noticePeriod`, candidate.noticePeriod],
      // Only include salary if user has permission to view it
      ...(user.canViewSalary && candidate.desiredSalary
        ? [
            [
              `desiredSalary`,
              `CHF ${addHighComma(candidate.desiredSalary)}`,
            ] as [keyof Dictionary["candidate"], string],
          ]
        : []),
      [
        `desiredWorkload`,
        candidate.desiredWorkload && `${candidate.desiredWorkload}%`,
      ],
    ].filter(
      (detail): detail is [keyof Dictionary["candidate"], string | undefined] =>
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
    drawWrappedText,
    drawWrappedHeading,
    getPageAndY,
    getNextLineY,
    getTexts,
  };
}

import React, { useMemo } from "react";
import { Document, Page } from "react-pdf";

export default function PdfDocument({
  fileContent,
  numPages,
  parentWidth,
  onDocumentLoadSuccess,
}: {
  fileContent: string;
  numPages?: number;
  parentWidth?: number;
  onDocumentLoadSuccess: (data: { numPages: number }) => void;
}) {
  const fileData = useMemo(() => ({ data: atob(fileContent) }), [fileContent]);

  return (
    <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(numPages), (el, index) => {
        console.log("index", index + 1, numPages, fileData.data.length);
        return (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={parentWidth && parentWidth < 1000 ? parentWidth : 1000}
          />
        );
      })}
    </Document>
  );
}

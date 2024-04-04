import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

export default function PdfDocument({
  fileContent,
  parentWidth,
}: {
  fileContent: string;
  parentWidth?: number;
}) {
  const [numPages, setNumPages] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // set parentWidth here based on your logic
  };

  return (
    <Document file={fileContent} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          width={parentWidth && parentWidth < 1000 ? parentWidth : 1000}
        />
      ))}
    </Document>
  );
}

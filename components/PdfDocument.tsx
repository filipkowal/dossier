import React, { useMemo, useState } from "react";
import { Document, Page } from "react-pdf";

export default function PdfDocument({
  fileContent,
  parentWidth,
}: {
  fileContent: string;
  parentWidth?: number;
}) {
  const [numPages, setNumPages] = useState(0);

  const fileData = useMemo(() => ({ data: atob(fileContent) }), [fileContent]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // set parentWidth here based on your logic
  };

  return (
    <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess}>
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

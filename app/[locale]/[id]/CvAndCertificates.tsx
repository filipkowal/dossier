"use client";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const CvAndCertificates = ({
  cvAndCertificates,
}: {
  cvAndCertificates: string[];
}) => {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="w-full" id="cvAndCertificates">
      {cvAndCertificates.map((path, index) => (
        <Document file={path} key={index} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="w-full"
            />
          ))}
        </Document>
      ))}
    </div>
  );
};

export default CvAndCertificates;

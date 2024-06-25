"use client";
import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

interface PdfDocumentProps {
  fileUrl: string;
  parentWidth?: number;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ fileUrl, parentWidth }) => {
  const [numPages, setNumPages] = useState(0);
  const [fileContent, setFileContent] = useState<Blob | null>(null);

  useEffect(() => {
    async function fetchPdf() {
      try {
        const res = await fetch(fileUrl, { credentials: "include" });

        if (!res.ok) {
          throw new Error(`HTTP ERROR! ${fileUrl} status: ${res.status}`);
        }

        const blob = await res.blob();
        setFileContent(blob);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    }

    fetchPdf();
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (!fileContent) {
    return null;
  }

  return (
    <Document
      file={fileContent}
      onLoadError={(error) => console.error("Error loading document:", error)}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          width={parentWidth && parentWidth < 1000 ? parentWidth : 1000}
        />
      ))}
    </Document>
  );
};

export default PdfDocument;

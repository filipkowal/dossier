"use client";
import React, { useRef, useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Candidate, HttpError } from "@/utils";
import { PdfDocument } from "@/components";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const CvAndCertificates = ({
  cvAndCertificates,
}: {
  cvAndCertificates: Candidate["file"];
}) => {
  const [parentWidth, setParentWidth] = useState<number>();
  const [cvContent, setCvContent] = useState<Uint8Array>();

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (parentRef.current && parentRef.current.offsetWidth < 1000) {
        setParentWidth(parentRef.current.offsetWidth - 1);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial width

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function getCvContent() {
      if (!cvAndCertificates) return;

      const res = await fetch(cvAndCertificates, { credentials: "include" });

      if (!res.ok) {
        throw new HttpError(
          `HTTP ERROR! ${cvAndCertificates} status: ${res.status}`,
          res.status
        );
      }

      if (!res?.body) {
        throw new Error(`Failed to fetch ${cvAndCertificates}, no body`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setCvContent(uint8Array);
    }

    getCvContent();
  }, [cvAndCertificates]);

  return (
    <div className="w-full" id="cvAndCertificates" ref={parentRef}>
      {cvContent && (
        <PdfDocument fileContent={cvContent} parentWidth={parentWidth} />
      )}
    </div>
  );
};

export default CvAndCertificates;

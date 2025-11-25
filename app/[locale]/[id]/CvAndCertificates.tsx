"use client";
import React, { useRef, useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Candidate } from "@/utils";
import PdfDocument from "@/components/PdfDocument";

/**
 * Use the UMD worker build – pdf.js expects a classic worker script and will
 * silently keep a null transport if the ES module worker fails to load. That
 * manifests later as "sendWithPromise" being undefined. Pointing to the `.js`
 * build keeps the worker initialization happy both locally and in production.
 */
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const CvAndCertificates = ({
  cvAndCertificates,
}: {
  cvAndCertificates: Candidate["file"];
}) => {
  const [parentWidth, setParentWidth] = useState<number>();
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

  return (
    <div className="w-full" ref={parentRef}>
      <div
        className="relative top-0 left-0 -translate-y-[62px] w-full h-[1px] bg-transparent"
        id="cvAndCertificates"
      />
      {cvAndCertificates && (
        <PdfDocument fileUrl={cvAndCertificates} parentWidth={parentWidth} />
      )}
    </div>
  );
};

export default CvAndCertificates;

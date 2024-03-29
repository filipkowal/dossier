"use client";
import React, { useRef, useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Candidate } from "@/utils";
import PdfDocument from "@/components/PdfDocument";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const CvAndCertificates = ({
  cvAndCertificates,
}: {
  cvAndCertificates: Candidate["files"];
}) => {
  const [parentWidth, setParentWidth] = useState<number>();

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (parentRef.current && parentRef.current.offsetWidth < 1000) {
        setParentWidth(parentRef.current.offsetWidth);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial width

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full" id="cvAndCertificates" ref={parentRef}>
      {cvAndCertificates?.map(
        (file, index) =>
          typeof file.content === "string" && (
            <PdfDocument
              key={index}
              fileContent={file.content}
              parentWidth={parentWidth}
            />
          )
      )}
    </div>
  );
};

export default CvAndCertificates;

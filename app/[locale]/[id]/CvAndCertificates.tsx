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
  const [cvContent, setCvContent] = useState<string>("");

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
      console.log(cvAndCertificates);
      if (!cvAndCertificates) return;
      const res = await fetch(cvAndCertificates, { credentials: "include" });

      console.log("res.body", res?.body);

      if (!res.ok) {
        throw new HttpError(
          `HTTP ERROR! ${cvAndCertificates} status: ${res.status},
          res.status`,
          res.status
        );
      }

      try {
        const json = await res.json();

        console.log("json", json);
        setCvContent(json);
      } catch (error) {
        throw new Error(
          `Failed to parse ${cvAndCertificates} response as JSON`
        );
      }
    }

    getCvContent();
  }, [cvAndCertificates]);

  return (
    <div className="w-full" id="cvAndCertificates" ref={parentRef}>
      {typeof cvAndCertificates === "string" && (
        <PdfDocument fileContent={cvContent} parentWidth={parentWidth} />
      )}
    </div>
  );
};

export default CvAndCertificates;

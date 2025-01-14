"use client";
import { Button } from "@/components";
import LoadingEllipsis from "@/components/LoadingEllipsis";
import { Locale } from "@/i18n-config";
import DownloadIcon from "@/public/download.png";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PdfButton({
  locale,
  id,
}: {
  locale: Locale;
  id: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_BASE_URL + "/"
            : "/"
        }api/generate-pdf?locale=${locale}&id=${id}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          response.headers
            .get("Content-Disposition")
            ?.match(/filename=.*/)?.[0]
            ?.split("=")[1] || "candidate-dossier.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error(
          "Failed to generate PDF: " + // @fixme add error translations
            response.status +
            " - " +
            response.statusText
        );
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        "An error occurred while downloading the PDF. Please try again."
      ); // @fixme add error translations
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      name={"PDF"}
      type="invert"
      className="flex gap-2 ml-8"
      onClick={handleDownload}
    >
      {isDownloading ? (
        <LoadingEllipsis isLoading />
      ) : (
        <Image
          src={DownloadIcon}
          className="h-4 w-4 mt-1"
          alt="download as pdf"
        />
      )}
      PDF
    </Button>
  );
}

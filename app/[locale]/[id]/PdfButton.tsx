import { Button } from "@/components";
import { GetPdfDossierResponse } from "@/utils";
import DownloadIcon from "@/public/download.png";
import Image from "next/image";

export default async function PdfButton({
  pdfDossierPromise,
}: {
  pdfDossierPromise: Promise<GetPdfDossierResponse>;
}) {
  const pdfDossier = await pdfDossierPromise;

  if (!pdfDossier?.content) return null;

  return (
    <a
      href={pdfDossier.content}
      download="dossier.pdf"
      className="sm:w-1/3 xl:w-1/4 max-w-[32rem]"
    >
      <Button name={"PDF"} type="invert" className="flex gap-2 ml-8">
        <Image
          src={DownloadIcon}
          className="h-4 w-4 mt-1"
          alt="download as pdf"
        />
        PDF
      </Button>
    </a>
  );
}

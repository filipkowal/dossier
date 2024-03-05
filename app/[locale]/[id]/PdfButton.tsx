import Button from "@/components/Button";
import { GetPdfDossierResponse } from "@/utils";
import { Dictionary } from "@/utils/server";

export default async function PdfButton({
  dict,
  pdfDossierPromise,
}: {
  dict: Dictionary["mainButtons"];
  pdfDossierPromise: Promise<GetPdfDossierResponse>;
}) {
  const pdfDossier = await pdfDossierPromise;

  if (!pdfDossier?.content) return null;

  return (
    <a
      href={URL.createObjectURL(
        new Blob([pdfDossier.content], { type: "application/pdf" })
      )}
      download="dossier.pdf"
      className="sm:w-1/3 xl:w-1/4 max-w-[32rem] hidden sm:block"
    >
      <Button
        name="Pdf"
        className="w-full h-full bg-digitalent-gray-light hidden sm:block disabled:hover:bg-digitalent-gray-light"
      >
        {dict.downloadAsPDF}
      </Button>
    </a>
  );
}

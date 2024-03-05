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
    <Button
      name="Pdf"
      className="sm:w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light hidden sm:block disabled:hover:bg-digitalent-gray-light"
      disabled={!pdfDossier.content}
      onClick={() => {
        if (!pdfDossier.content) return;

        const blob = new Blob([pdfDossier.content], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dossier.pdf";
        a.click();
      }}
    >
      {dict.downloadAsPDF}
    </Button>
  );
}

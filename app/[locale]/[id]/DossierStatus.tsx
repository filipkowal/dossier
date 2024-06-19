import { Candidate } from "@/utils";

export default function DossierStatus({ candidate }: { candidate: Candidate }) {
  if (!candidate.dossierMessage?.length) return;

  return (
    <div className={`p-8 mb-8 border text-center font-title`}>
      {candidate.dossierMessage}
    </div>
  );
}

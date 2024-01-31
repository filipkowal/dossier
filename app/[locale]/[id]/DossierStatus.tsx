import { Candidate } from "@/utils";

export default function DossierStatus({ candidate }: { candidate: Candidate }) {
  if (
    candidate.dossierPhase === "candidateNotAssessed" ||
    !candidate.dossierMessage?.length
  )
    return;

  return (
    <div
      className={`p-8 mb-8 border text-center font-title ${
        candidate.dossierPhase === "candidateAccepted"
          ? "border-digitalent-green bg-digitalent-green"
          : "border-white"
      }`}
    >
      {candidate.dossierMessage}
    </div>
  );
}

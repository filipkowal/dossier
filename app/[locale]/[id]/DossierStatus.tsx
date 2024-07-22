"use client";
import { Candidate } from "@/utils";
import { useRefetch } from "./RefetchContext";

export default function DossierStatus({ candidate }: { candidate: Candidate }) {
  const { isRefetching, startRefetch, endRefetch } = useRefetch();

  if (!candidate.dossierMessage?.length || isRefetching) return;

  return (
    <div className={`p-8 mb-8 border text-center font-title`}>
      {candidate.dossierMessage}
    </div>
  );
}

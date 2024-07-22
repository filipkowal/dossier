"use client";
import { Candidate, getCandidate, Locale } from "@/utils";
import { useRefetch } from "./RefetchContext";
import { useEffect, useState } from "react";

export default function DossierStatus({
  candidate,
  params,
}: {
  candidate: Candidate;
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;

  const { isRefetching, startRefetch, endRefetch } = useRefetch();
  const [dossierMessage, setDossierMessage] = useState(
    candidate.dossierMessage
  );

  useEffect(() => {
    console.log("useEffect in DossierStatus: ", isRefetching);
    if (!isRefetching) return;

    async function getDossierMessage() {
      try {
        console.log("refetching: candidate");
        const c = await getCandidate(locale, id);
        setDossierMessage(c.dossierMessage || "");
        endRefetch();
      } catch (error) {
        endRefetch();
      }
    }

    getDossierMessage();
  }, [isRefetching]);

  if (!dossierMessage?.length || isRefetching) return;

  return (
    <div className={`p-8 mb-8 border text-center font-title`}>
      {dossierMessage}
    </div>
  );
}

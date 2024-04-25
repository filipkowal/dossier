"use client";
import { Candidate, Dictionary } from "@/utils";

export default function LongCandidateInfo({
  candidate,
  dict,
}: {
  candidate: Candidate;
  dict: Dictionary["candidate"];
}) {
  return (
    <>
      <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
        {dict.interviewSummary}
      </h2>
      <p
        dangerouslySetInnerHTML={{
          __html: candidate.interviewSummary || "",
        }}
      ></p>
      <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
        {dict.reasonForChange}
      </h2>
      <p
        dangerouslySetInnerHTML={{
          __html: candidate.reasonForChange || "",
        }}
      ></p>
      <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
        {dict.educationSummary}
      </h2>
      <div
        dangerouslySetInnerHTML={{
          __html: candidate.educationSummary || "",
        }}
      ></div>
    </>
  );
}

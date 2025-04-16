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
      <Section
        dict={dict}
        content={candidate.interviewSummary}
        name="interviewSummary"
      />
      <Section
        dict={dict}
        content={candidate.reasonForChange}
        name="reasonForChange"
      />
    </>
  );
}

function Section({
  dict,
  content,
  name,
}: {
  dict: Dictionary["candidate"];
  content?: string;
  name: "reasonForChange" | "interviewSummary" | "educationSummary";
}) {
  if (!content) return null;

  return (
    <>
      <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">{dict[name]}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: content || "",
        }}
        className="[&>ul]:my-2 [&>ol]:my-2"
      ></div>
    </>
  );
}

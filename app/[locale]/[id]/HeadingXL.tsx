import { Candidate, Dictionary } from "@/utils";

export function HeadingXL({
  dict,
  candidate,
}: {
  dict: Dictionary["candidate"];
  candidate: Candidate;
}) {
  return (
    <div className="hidden xl:flex flex-col pt-16 xl:pt-32 sm:px-16 2xl:px-32 bg-digitalent-blue text-white justify-end">
      <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16">
        <div className="text-digitalent-green">
          <h1>{dict.candidate}:</h1>
          <h1>{dict.vacancy}:</h1>
        </div>
        <div>
          <h1>
            {candidate.firstName} {candidate.lastName}
          </h1>
          <h1>{candidate.vacancyTitle}</h1>
        </div>
      </div>
    </div>
  );
}

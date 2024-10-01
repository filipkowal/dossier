import { Candidate, Dictionary } from "@/utils";

export default function Heading({
  dict,
  candidate,
}: {
  dict: Dictionary["candidate"];
  candidate: Candidate;
}) {
  return (
    <>
      <div className="flex flex-col md:hidden font-title text-2xl gap-12 mb-16">
        <div>
          <h1>
            {candidate.firstName} {candidate.lastName}
          </h1>
          <h1 className="text-base mt-4 text-digitalent-green">
            {" " + dict.candidatesFor}:
          </h1>
          <h1 className="text-xl">{candidate.vacancyTitle}</h1>
        </div>
      </div>

      <div className="hidden md:flex xl:hidden flex-col md">
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
    </>
  );
}

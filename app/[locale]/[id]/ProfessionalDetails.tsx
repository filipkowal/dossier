import {
  addHighComma,
  type Candidate,
  type Dictionary,
  type User,
} from "@/utils";
import { ReactNode } from "react";

export default function ProfessionalDetails({
  dict,
  candidate,
  user,
}: {
  dict: Dictionary;
  candidate: Candidate;
  user: User;
}) {
  const Detail = ({ title, value }: { title: string; value: ReactNode }) => (
    <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:justify-between sm:grid grid-cols-2">
      <p className="nowrap min-w-fit">{title}: </p>
      <p className="font-bold sm:font-normal">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <Detail
        title={dict.candidate.currentPosition}
        value={candidate.currentPosition}
      />
      <Detail
        title={dict.candidate.noticePeriod}
        value={candidate.noticePeriod}
      />
      {user.canViewSalary ? (
        <Detail
          title={dict.candidate.desiredSalary}
          value={`CHF ${addHighComma(candidate.desiredSalary)}`}
        />
      ) : (
        ""
      )}
      <Detail
        title={dict.candidate.desiredWorkload}
        value={`${candidate.desiredWorkload}%`}
      />
    </div>
  );
}

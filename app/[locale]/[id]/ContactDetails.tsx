import { CopyButton } from "@/components";
import { Candidate, Dictionary } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import LinkedInIcon from "@/public/linkedin.png";
import ShareIcon from "@/public/share.png";

export default function ContactDetails({
  candidate,
  dict,
}: {
  candidate: Candidate;
  dict: Dictionary;
}) {
  return (
    <div className="flex flex-col leading-7 lg:flex-row xl:flex-col lg:gap-16 xl:gap-8 sm:gap-8 sm:mt-8 justify-between xl:w-[19rem]">
      <div className="md:w-1/2 xl:w-full">
        <h2 className="text-xl font-title mb-4 sm:mb-8">
          {dict.candidate.contactDetails}
        </h2>
        {candidate?.phoneNumber ? <p>{candidate.phoneNumber}</p> : ""}
        {candidate.email ? (
          <div className="flex gap-2">
            <p className="overflow-hidden text-ellipsis">{candidate.email}</p>
            <CopyButton value={candidate.email} dict={dict.toastMessages} />
          </div>
        ) : (
          ""
        )}

        {candidate.linkedIn && (
          <Link
            href={candidate.linkedIn}
            target="_blank"
            className="block whitespace-nowrap overflow-hidden text-ellipsis max-w-[100%]"
          >
            <Image
              alt="linked-in"
              src={LinkedInIcon}
              className="inline mb-[0.3rem]"
              width={18}
            />{" "}
            {candidate.linkedIn?.replace(/\/$/, "").slice(27)}
            <Image
              alt="open-linkedin"
              src={ShareIcon}
              className="inline mb-[0.3rem] ml-2"
              width={20}
            />
          </Link>
        )}
      </div>
      <div className="md:w-1/2 xl:w-full">
        {candidate?.birthDate ? (
          <p className="whitespace-nowrap">
            {candidate.birthDate + " "}
            {candidate?.candidateAge ? "(" + candidate.candidateAge + ")" : ""}
          </p>
        ) : (
          ""
        )}

        {candidate?.address?.street ? (
          <p className="overflow-hidden text-ellipsis">
            {candidate.address?.street || ""}
          </p>
        ) : (
          ""
        )}
        {candidate?.address?.zip || candidate?.address?.city ? (
          <p className="overflow-hidden text-ellipsis">
            {(candidate.address?.zip ? candidate.address?.zip + " " : "") +
              (candidate?.address?.city || "")}
          </p>
        ) : (
          ""
        )}
        {candidate?.address?.country ? (
          <p>{candidate.address?.country || ""}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

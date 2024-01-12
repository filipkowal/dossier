import Button from "@/components/Button";
import { Locale } from "@/i18n-config";
import InviteSection from "./InviteSection";
import { getDictionary } from "@/utils/server";
import { getCandidate } from "@/utils";
import CvAndCertificates from "./CvAndCertificates";
import { cv } from "@/public/cv";

export default async function Home({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { id, locale } = params;
  const dict = await getDictionary(params.locale);
  const candidate = await getCandidate(locale, id);

  const MOCK_FILES = [cv];

  return (
    <div className="w-full grid grid-cols-[minmax(250px,1fr),2fr] pt-16">
      <div className="flex flex-col bg-digitalent-blue text-white items-end">
        <div className="flex flex-col justify-end h-[34vh] 3xl:h-[20vh] pt-16 px-32 w-[35rem]">
          <div className="rounded-full w-52 h-52 bg-digitalent-yellow" />
        </div>
        <div className="flex flex-col mt-16 px-32 w-[35rem]">
          <h2 className="text-xl font-title mb-8">
            {dict.candidate.contactDetails}
          </h2>
          <p>{candidate.phoneNumber}</p>
          <p>{candidate.email}</p>
          <p>{candidate.linkedIn}</p>
          <h2 className="text-xl font-title my-8">
            {dict.candidate.personalDetails}
          </h2>
          <p>{candidate.birthDate} (31 y/o)</p>
          <p>{candidate.address}</p>
          <h2 className="text-xl font-title my-8">
            {dict.candidate.languages}
          </h2>
          <p>{candidate.languages?.join("\n")}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col pt-16 px-32 bg-digitalent-blue text-white justify-end h-[34vh] 3xl:h-[20vh]">
          <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16">
            <div className="text-digitalent-green">
              <h1>{dict.candidate.candidate}:</h1>
              <h1>{dict.candidate.vacancy}:</h1>
            </div>
            <div>
              <h1>{candidate.name}</h1>
              <h1>{candidate.jobTitle}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-16 px-32">
          <div className="max-w-[48rem]">
            <h2 className="text-xl font-title mb-8 ">
              {dict.candidate.professionalDetails}
            </h2>
            <p>
              {dict.candidate.desiredSalary}: {candidate.desiredSalary}
            </p>
            <p>
              {dict.candidate.targetSalary}: {candidate.targetSalary}
            </p>
            <p>
              {dict.candidate.noticePeriod}: {candidate.noticePeriod}
            </p>
            <p>
              {dict.candidate.commuteDistanceToWork}: {candidate.distanceToWork}
            </p>
            <p>
              {dict.candidate.currentPosition}: {candidate.jobTitle}
            </p>
            <h2 className="text-xl font-title my-8">
              {dict.candidate.relevantExperience}
            </h2>
            <p>{candidate.relevantExperience}</p>
            <h2 className="text-xl font-title my-8">
              {dict.candidate.reasonForChange}
            </h2>
            <p>{candidate.reasonForChange}</p>
          </div>
        </div>
        <h1 id="cvAndCertificates" className="h-[100vh] bg-digitalent-yellow">
          <CvAndCertificates
            cvAndCertificates={MOCK_FILES || candidate.files || []}
          />
        </h1>
      </div>
      <div className="flex fixed bottom-6 justify-center gap-6 w-full">
        <InviteSection dict={{ ...dict.inviteModal, ...dict.mainButtons }} />
        <Button
          name="Reject"
          className="w-1/3 xl:w-1/4 max-w-[32rem] text-white bg-digitalent-blue"
        >
          {dict.mainButtons.notInterested}
        </Button>
        <Button
          name="Pdf"
          className="w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light"
        >
          {dict.mainButtons.downloadAsPDF}
        </Button>
      </div>
    </div>
  );
}

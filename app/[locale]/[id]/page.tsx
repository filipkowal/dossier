import Button from "@/components/Button";
import { Locale } from "@/i18n-config";
import InviteSection from "./InviteSection";
import { getDictionary } from "@/utils/server";
import { getCandidate } from "@/utils";
import CvAndCertificates from "./CvAndCertificates";

export default async function Home({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { id, locale } = params;
  const dict = await getDictionary(params.locale);
  const candidate = await getCandidate(locale, id);

  const MOCK_FILES = ["/cv.pdf", "/certificates.pdf"];

  return (
    <div className="w-full sm:grid sm:grid-cols-[minmax(250px,1fr),2fr] sm:pt-16">
      <div className="flex flex-col bg-digitalent-blue text-white items-end">
        <div className="flex flex-col justify-end items-center sm:items-start h-[34vh] 3xl:h-[20vh] pt-16 sm:px-32 sm:w-[35rem] w-full">
          <div className="rounded-full sm:w-52 sm:h-52 h-40 w-40 bg-digitalent-yellow" />
        </div>
        <div className="flex flex-col sm:mt-16 mt-20 sm:px-32 px-8 sm:w-[35rem]">
          <div className="flex flex-col sm:hidden font-title text-3xl gap-12 mb-16">
            <div>
              <h1>
                {candidate.firstName} {candidate.lastName}
              </h1>
              <h1 className="text-digitalent-green text-xl">
                {" " + dict.candidate.candidatesFor}:
              </h1>
              <h1>{candidate.jobTitle}</h1>
            </div>
          </div>
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
        <div className="hidden sm:flex flex-col pt-16 sm:px-32 bg-digitalent-blue text-white justify-end h-[34vh] 3xl:h-[20vh]">
          <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16">
            <div className="text-digitalent-green">
              <h1>{dict.candidate.candidate}:</h1>
              <h1>{dict.candidate.vacancy}:</h1>
            </div>
            <div>
              <h1>
                {candidate.firstName} {candidate.lastName}
              </h1>
              <h1>{candidate.jobTitle}</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col my-16 sm:px-32">
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
        <CvAndCertificates
          cvAndCertificates={MOCK_FILES || candidate.files || []}
        />
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

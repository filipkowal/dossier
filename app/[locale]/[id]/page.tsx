import Button from "@/components/Button";
import { Locale } from "@/i18n-config";
import InviteSection from "./InviteSection";
import { getDictionary } from "@/utils/server";
import { getCandidate, getPdfDossier, getUser } from "@/utils";
import CvAndCertificates from "./CvAndCertificates";
import RejectSection from "./RejectSection";
import DossierStatus from "./DossierStatus";
import Link from "next/link";
import LinkedInIcon from "@/public/linkedin.png";
import Image from "next/image";
import { Suspense } from "react";
import PdfButton from "./PdfButton";

export default async function Home({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { id, locale } = params;
  const dict = await getDictionary(params.locale);
  const candidate = await getCandidate(locale, id);
  const user = await getUser(locale, id);
  const pdfDossierPromise = getPdfDossier(locale, id);

  return (
    <div className="w-full sm:pt-16 xl:grid xl:grid-cols-[minmax(450px,1fr),2fr] 2xl:grid-cols-[minmax(250px,1fr),2fr]">
      <div className="flex flex-col bg-digitalent-blue text-white sm:items-start xl:items-end md:px-8 lg:px-16 xl:px-0">
        <div className="flex flex-col justify-end items-center md:items-start xl:h-[34vh] 3xl:h-[30vh] pt-16 md:px-16 2xl:px-32 md:w-[27rem] 2xl:w-[35rem] w-full">
          {candidate.candidateImage?.content ? (
            <img
              alt="Candidate image"
              src={"data:image/jpeg;base64," + candidate.candidateImage.content}
              className="rounded-full sm:w-52 sm:h-52 h-40 w-40"
            />
          ) : (
            <div className="rounded-full sm:w-52 sm:h-52 h-40 w-40 bg-digitalent-yellow" />
          )}
        </div>
        <div className="block xl:hidden mt-16 -mb-16 px-8 sm:px-16 w-full">
          <DossierStatus candidate={candidate} />
        </div>
        <div className="flex flex-col mt-20 xl:mt-8 sm:px-16 2xl:px-32 px-8 mb-12">
          {/* Mobile */}
          <div className="flex flex-col md:hidden font-title text-2xl gap-12 mb-16">
            <div>
              <h1>
                {candidate.firstName} {candidate.lastName}
              </h1>
              <h1 className="text-base mt-4 text-digitalent-green">
                {" " + dict.candidate.candidatesFor}:
              </h1>
              <h1 className="text-xl">{candidate.vacancyTitle}</h1>
            </div>
          </div>

          <div className="hidden md:flex xl:hidden flex-col md">
            <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16">
              <div className="text-digitalent-green">
                <h1>{dict.candidate.candidate}:</h1>
                <h1>{dict.candidate.vacancy}:</h1>
              </div>
              <div>
                <h1>
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <h1>{candidate.vacancyTitle}</h1>
              </div>
            </div>
          </div>
          {/* Mobile End */}

          <div className="flex flex-col leading-7 lg:flex-row xl:flex-col lg:gap-16 xl:gap-8 sm:gap-8 sm:mt-8 justify-between xl:w-[19rem]">
            <div className="md:w-1/2 xl:w-full">
              <h2 className="text-xl font-title mb-4 sm:mb-8">
                {dict.candidate.contactDetails}
              </h2>
              <p>{candidate.phoneNumber}</p>
              <p className="overflow-hidden text-ellipsis">{candidate.email}</p>
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
                </Link>
              )}
            </div>
            <div className="md:w-1/2 xl:w-full">
              <h2 className="text-xl font-title mb-4 mt-8 sm:mt-0 sm:mb-8 whitespace-nowrap">
                {dict.candidate.personalDetails}
              </h2>
              <p className="whitespace-nowrap">
                {candidate.birthDate} {"(" + candidate.candidateAge + " y/o)"}
              </p>
              <p className="overflow-hidden text-ellipsis">
                {candidate.address?.street}
              </p>
              <p className="overflow-hidden text-ellipsis">
                {candidate.address?.city + " " + candidate.address?.zip}
              </p>
              <p>{candidate.address?.country}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Desktop */}
        <div className="hidden xl:flex flex-col pt-16 sm:px-16 2xl:px-32 bg-digitalent-blue text-white justify-end h-[34vh] 3xl:h-[30vh]">
          <DossierStatus candidate={candidate} />

          <div className="max-w-[48rem] font-title flex text-3xl gap-12 mb-16">
            <div className="text-digitalent-green">
              <h1>{dict.candidate.candidate}:</h1>
              <h1>{dict.candidate.vacancy}:</h1>
            </div>
            <div>
              <h1>
                {candidate.firstName} {candidate.lastName}
              </h1>
              <h1>{candidate.vacancyTitle}</h1>
            </div>
          </div>
        </div>
        {/* Desktop End */}

        <div className="flex flex-col my-12 sm:my-16 sm:px-16 md:px-24 lg:px-32 px-8">
          <div className="max-w-[48rem]">
            <h2 className="text-xl font-title mb-4 sm:mb-8 ">
              {dict.candidate.professionalDetails}
            </h2>
            {user.canViewSalary ? (
              <p>
                {dict.candidate.desiredSalary}: {candidate.desiredSalary}
              </p>
            ) : (
              ""
            )}
            <p>
              {dict.candidate.noticePeriod}: {candidate.noticePeriod}
            </p>
            <p>
              {dict.candidate.currentPosition}: {candidate.currentPosition}
            </p>
            <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
              {dict.candidate.relevantExperience}
            </h2>
            <p>{candidate.interviewSummary}</p>
            <h2 className="text-xl font-title mb-4 mt-8 sm:my-8">
              {dict.candidate.reasonForChange}
            </h2>
            <p>{candidate.reasonForChange}</p>
          </div>
        </div>
        <CvAndCertificates cvAndCertificates={candidate.files || []} />
      </div>
      <div className="flex fixed md:bottom-6 bottom-0 justify-center sm:gap-3 md:gap-6 w-full">
        <InviteSection
          dict={{ ...dict.inviteModal, ...dict.mainButtons }}
          user={user}
        />
        <RejectSection
          dict={{
            ...dict.rejectModal,
            ...dict.mainButtons,
            ...dict.toastMessages,
          }}
          id={id}
        />

        {user.canDownloadPdf ? (
          <Suspense
            fallback={
              <Button
                name="Pdf"
                className="sm:w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light hidden sm:block  disabled:hover:bg-digitalent-gray-light"
                disabled
              >
                {dict.mainButtons.downloadAsPDF}
              </Button>
            }
          >
            <div className="hidden sm:block">
              <PdfButton
                dict={dict.mainButtons}
                pdfDossierPromise={pdfDossierPromise}
              />
            </div>
          </Suspense>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

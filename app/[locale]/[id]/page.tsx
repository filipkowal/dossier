import { Locale } from "@/i18n-config";
import InviteSection from "./InviteSection";
import { HttpError, getDictionary } from "@/utils";
import { getCandidate, getUser } from "@/utils";
import CvAndCertificates from "./CvAndCertificates";
import RejectSection from "./RejectSection";
import DossierStatus from "./DossierStatus";
import Link from "next/link";
import LinkedInIcon from "@/public/linkedin.png";
import ShareIcon from "@/public/share.png";
import Image from "next/image";
import { CopyButton } from "@/components";
import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";
import ContactSection from "./ContactSection";

const LongCandidateInfo = dynamic(() => import("./LongCandidateInfo"), {
  ssr: false,
});

export default async function Home({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { id, locale } = params;

  let candidate, user, dict;
  try {
    [candidate, user, dict] = await Promise.all([
      getCandidate(locale, id),
      getUser(locale, id),
      getDictionary(params.locale),
    ]);
  } catch (error) {
    if (error instanceof HttpError && error.status === 410) {
      redirect(`/${locale}/expired`);
    } else {
      notFound();
    }
  }

  if (!candidate || !user) {
    notFound();
  }

  function addHighComma(value?: string) {
    if (!value) return "";

    let commaSeparated = value.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return commaSeparated;
  }

  return (
    <div className="w-full sm:pt-16 xl:grid xl:grid-cols-[minmax(450px,1fr),2fr] 2xl:grid-cols-[minmax(250px,1fr),2fr]">
      <div className="flex flex-col bg-digitalent-blue text-white sm:items-start xl:items-end md:px-8 lg:px-16 xl:px-0">
        <div className="flex flex-col justify-end items-center md:items-start xl:h-[34vh] 3xl:h-[30vh] pt-16 md:px-16 2xl:px-32 md:w-[27rem] 2xl:w-[35rem] w-full">
          {candidate.candidateImage?.content ? (
            <Image
              alt="Candidate image"
              src={candidate.candidateImage.content}
              className="rounded-full sm:w-52 sm:h-52 h-40 w-40"
              width={160}
              height={160}
              loading="eager"
            />
          ) : (
            <div className="rounded-full sm:w-52 sm:h-52 h-40 w-40 bg-digitalent-yellow" />
          )}
        </div>
        <div className="block xl:hidden mt-16 -mb-16 px-8 sm:px-16 w-full">
          <DossierStatus candidate={candidate} />
        </div>
        <div className="flex flex-col mt-20 xl:mt-8 sm:px-16 2xl:px-32 px-8 mb-12 min-h-[70vh]">
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
              {candidate.email ? (
                <div className="flex gap-2">
                  <p className="overflow-hidden text-ellipsis">
                    {candidate.email}
                  </p>
                  <CopyButton
                    value={candidate.email}
                    dict={dict.toastMessages}
                  />
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
              <h2 className="text-xl font-title mb-4 mt-8 sm:mt-0 sm:mb-8 whitespace-nowrap">
                {dict.candidate.personalDetails}
              </h2>
              <p className="whitespace-nowrap">
                {candidate.birthDate} {"(" + candidate.candidateAge + ")"}
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
        <div className="hidden xl:flex flex-col pt-16 sm:px-16 2xl:px-32 bg-digitalent-blue text-white justify-end min-h-[34vh] 3xl:h-[30vh]">
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

            <div className="block sm:hidden">
              <p>
                {dict.candidate.currentPosition}:{" "}
                <b>{candidate.currentPosition}</b>
              </p>
              <p>
                {dict.candidate.noticePeriod}: <b>{candidate.noticePeriod}</b>
              </p>
              {user.canViewSalary ? (
                <p>
                  {dict.candidate.desiredSalary}:{" "}
                  <b>CHF {addHighComma(candidate.desiredSalary)}</b>
                </p>
              ) : (
                ""
              )}
              <p>
                {dict.candidate.desiredWorkload}:{" "}
                <b>{candidate.desiredWorkload}%</b>
              </p>
            </div>

            <div className="hidden sm:grid grid-cols-[300px,1fr]">
              <div>
                <p>{dict.candidate.currentPosition}:</p>
                <p>{dict.candidate.noticePeriod}:</p>
                {user.canViewSalary ? (
                  <p>{dict.candidate.desiredSalary}:</p>
                ) : (
                  ""
                )}
                <p>{dict.candidate.desiredWorkload}:</p>
              </div>
              <div>
                <p>{candidate.currentPosition}</p>
                <p>{candidate.noticePeriod}</p>
                {user.canViewSalary ? (
                  <p>CHF {addHighComma(candidate.desiredSalary)}</p>
                ) : (
                  ""
                )}
                <p>{candidate.desiredWorkload}%</p>
              </div>
            </div>

            <LongCandidateInfo candidate={candidate} dict={dict.candidate} />
          </div>
        </div>
        <CvAndCertificates cvAndCertificates={candidate.files || []} />
      </div>
      <div className="flex fixed md:bottom-6 bottom-0 justify-center sm:gap-3 md:gap-6 w-full">
        <InviteSection
          dict={{
            ...dict.inviteModal,
            ...dict.mainButtons,
            ...dict.toastMessages,
          }}
          user={user}
          id={id}
          candidateGender={candidate?.gender}
        />
        <RejectSection
          dict={{
            ...dict.rejectModal,
            ...dict.mainButtons,
            ...dict.toastMessages,
          }}
          id={id}
          candidateGender={candidate?.gender}
        />

        <ContactSection
          dict={{
            ...dict.mainButtons,
            ...dict.contactModal,
            ...dict.toastMessages,
          }}
          // @fixme: relationshipManager is not from API
          relationshipManager={{
            name: "Andjela Zdravkovic",
            phoneNumber: "+39 666 666 666",
          }}
          id={id}
        />
      </div>
    </div>
  );
}

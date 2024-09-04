import { Locale } from "@/i18n-config";
import InviteSection from "./InviteSection";
import {
  HttpError,
  SearchParams,
  addHighComma,
  getDictionary,
  getRelationshipManager,
} from "@/utils";
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
import dynamicImport from "next/dynamic";
import ContactSection from "./ContactSection";
import AvatarMale from "@/public/avatar-male.webp";
import AvatarFemale from "@/public/avatar-female.png";
import { cookies } from "next/headers";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { revalidatePath } from "next/cache";
import { RefetchProvider } from "./RefetchContext";

export const dynamic = "force-dynamic";

const LongCandidateInfo = dynamicImport(() => import("./LongCandidateInfo"), {
  ssr: false,
});

export default async function Home({
  params,
  searchParams,
}: {
  params: { locale: Locale; id: string };
  searchParams?: SearchParams;
}) {
  const { id, locale } = params;
  const cookieStore = cookies();
  const cookie = cookieStore.get(`token-${params.id}`);

  async function revalidateCache() {
    "use server";

    console.log("revalidating: ", `/${locale}/${id}`);
    revalidatePath(`/${locale}/${id}`, "layout");
  }

  let candidate, user, dict, relationshipManager;
  try {
    [candidate, user, dict, relationshipManager] = await Promise.all([
      getCandidate(locale, id, cookie),
      getUser(locale, id, cookie),
      getDictionary(params.locale),
      getRelationshipManager(params.locale, params.id, cookie),
    ]);
  } catch (error) {
    if (error instanceof HttpError && error.status === 410) {
      await revalidateCache();
      redirect(`/${locale}/${id}/expired`);
    }
    if (error instanceof HttpError && error.status === 404) {
      notFound();
    } else {
      throw error;
    }
  }

  return (
    <div className="w-full sm:pt-16 xl:grid xl:grid-cols-[minmax(450px,1fr),2fr] 2xl:grid-cols-[minmax(250px,1fr),2fr]">
      <div className="flex flex-col bg-digitalent-blue text-white sm:items-start xl:items-end md:px-8 lg:px-16 xl:px-0">
        <div className="flex flex-col justify-end items-center md:items-start xl:h-[34vh] 3xl:h-[30vh] pt-16 md:px-16 2xl:px-32 md:w-[27rem] 2xl:w-[35rem] w-full">
          <ImageWithPlaceholder
            alt="Candidate image"
            src={candidate.candidateImage}
            className="rounded-full sm:w-52 sm:h-52 h-40 w-40"
            width={160}
            height={160}
            placeholder={candidate?.gender === "f" ? AvatarFemale : AvatarMale}
          />
        </div>
        <div className="block xl:hidden mt-16 -mb-16 px-8 sm:px-16 w-full">
          <RefetchProvider>
            <DossierStatus candidate={candidate} />
          </RefetchProvider>
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
              <p className="whitespace-nowrap">
                {candidate?.birthDate || ""}{" "}
                {candidate?.candidateAge
                  ? "(" + candidate.candidateAge + ")"
                  : ""}
              </p>

              <p className="overflow-hidden text-ellipsis">
                {candidate.address?.street || ""}
              </p>
              <p className="overflow-hidden text-ellipsis">
                {(candidate.address?.zip || "") +
                  " " +
                  (candidate.address?.city || "")}
              </p>
              <p>{candidate.address?.country || ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Desktop */}
        <div className="hidden xl:flex flex-col pt-16 sm:px-16 2xl:px-32 bg-digitalent-blue text-white justify-end min-h-[34vh] 3xl:h-[30vh]">
          <RefetchProvider>
            <DossierStatus candidate={candidate} />
          </RefetchProvider>

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
        <CvAndCertificates cvAndCertificates={candidate.file} />
      </div>
      <div className="z-10 flex fixed md:bottom-6 bottom-0 justify-center sm:gap-3 md:gap-6 w-full">
        <RefetchProvider>
          <InviteSection
            dict={{
              ...dict.inviteModal,
              ...dict.mainButtons,
              ...dict.toastMessages,
            }}
            user={user}
            params={params}
            candidateGender={candidate?.gender}
            revalidateCache={revalidateCache}
            searchParams={searchParams}
          />
          <RejectSection
            dict={{
              ...dict.rejectModal,
              ...dict.mainButtons,
              ...dict.toastMessages,
            }}
            id={id}
            candidateGender={candidate?.gender}
            isRejectButtonVisible={user.isRejectButtonVisible}
          />

          <ContactSection
            dict={{
              ...dict.mainButtons,
              ...dict.contactModal,
              ...dict.toastMessages,
            }}
            relationshipManager={relationshipManager}
            id={id}
          />
        </RefetchProvider>
      </div>
    </div>
  );
}

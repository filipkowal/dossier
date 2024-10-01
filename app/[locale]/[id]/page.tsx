import { Locale } from "@/i18n-config";
import InviteSection from "./InviteSection";
import {
  HttpError,
  SearchParams,
  getDictionary,
  getRelationshipManager,
} from "@/utils";
import { getCandidate, getUser } from "@/utils";
import CvAndCertificates from "./CvAndCertificates";
import RejectSection from "./RejectSection";
import DossierStatus from "./DossierStatus";
import { notFound, redirect } from "next/navigation";
import dynamicImport from "next/dynamic";
import ContactSection from "./ContactSection";
import AvatarMale from "@/public/avatar-male.webp";
import AvatarFemale from "@/public/avatar-female.webp";
import { cookies } from "next/headers";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { revalidateMainPathAction } from "@/utils/actions";
import ProfessionalDetails from "./ProfessionalDetails";
import ContactDetails from "./ContactDetails";

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
      await revalidateMainPathAction({ locale, id });
      redirect(`/${locale}/${id}/expired`);
    }
    if (error instanceof HttpError && error.status === 404) {
      notFound();
    } else {
      throw error;
    }
  }

  return (
    <>
      <DossierStatus candidate={candidate} />

      <div className="w-full xl:grid xl:grid-cols-[minmax(450px,1fr),2fr] 2xl:grid-cols-[minmax(250px,1fr),2fr]">
        <div className="flex flex-col bg-digitalent-blue text-white sm:items-start xl:items-end md:px-8 lg:px-16 xl:px-0">
          <div className="flex flex-col justify-end items-center md:items-start xl:h-[16.45rem] pt-16 md:px-16 md:w-[27rem] 2xl:w-[35rem] w-full">
            <ImageWithPlaceholder
              alt="Candidate image"
              src={candidate.candidateImage}
              className="rounded-full sm:w-52 sm:h-52 h-40 w-40"
              width={160}
              height={160}
              placeholder={
                candidate?.gender === "f" ? AvatarFemale : AvatarMale
              }
            />
          </div>
          <div className="flex flex-col mt-20 xl:mt-16 sm:px-16 px-8 mb-16">
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

            <ContactDetails candidate={candidate} dict={dict} />
          </div>
        </div>

        <div className="flex flex-col">
          {/* Desktop */}
          <div className="hidden xl:flex flex-col pt-16 xl:pt-32 sm:px-16 2xl:px-32 bg-digitalent-blue text-white justify-end">
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

              <ProfessionalDetails
                candidate={candidate}
                user={user}
                dict={dict}
              />

              <LongCandidateInfo candidate={candidate} dict={dict.candidate} />
            </div>
          </div>
          <CvAndCertificates cvAndCertificates={candidate.file} />
        </div>
        <div className="z-10 flex fixed md:bottom-6 bottom-0 justify-center sm:gap-3 md:gap-6 w-full">
          <InviteSection
            dict={{
              ...dict.inviteModal,
              ...dict.mainButtons,
              ...dict.toastMessages,
            }}
            user={user}
            params={params}
            candidateGender={candidate?.gender}
            searchParams={searchParams}
          />

          <RejectSection
            dict={{
              ...dict.rejectModal,
              ...dict.mainButtons,
              ...dict.toastMessages,
            }}
            id={id}
            locale={locale}
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
        </div>
      </div>
    </>
  );
}

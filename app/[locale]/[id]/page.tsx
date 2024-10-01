import { Locale } from "@/i18n-config";
import { HttpError, getDictionary, getRelationshipManager } from "@/utils";
import { getCandidate, getUser } from "@/utils";
import CvAndCertificates from "./CvAndCertificates";
import DossierStatus from "./DossierStatus";
import { notFound, redirect } from "next/navigation";
import dynamicImport from "next/dynamic";
import AvatarMale from "@/public/avatar-male.webp";
import AvatarFemale from "@/public/avatar-female.webp";
import { cookies } from "next/headers";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { revalidateMainPathAction } from "@/utils/actions";
import ProfessionalDetails from "./ProfessionalDetails";
import ContactDetails from "./ContactDetails";
import ActionButtons from "./ActionButtons";
import { HeadingXL } from "./HeadingXL";
import Heading from "./Heading";

export const dynamic = "force-dynamic";

const LongCandidateInfo = dynamicImport(() => import("./LongCandidateInfo"), {
  ssr: false,
});

export default async function Home({
  params,
}: {
  params: { locale: Locale; id: string };
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
            <Heading dict={dict.candidate} candidate={candidate} />

            <ContactDetails candidate={candidate} dict={dict} />
          </div>
        </div>

        <div className="flex flex-col">
          <HeadingXL dict={dict.candidate} candidate={candidate} />

          <div className="flex flex-col max-w-[48rem] my-12 sm:my-16 sm:px-16 md:px-24 lg:px-32 px-8">
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
          <CvAndCertificates cvAndCertificates={candidate.file} />
        </div>

        <ActionButtons
          dict={dict}
          user={user}
          params={params}
          candidate={candidate}
          id={id}
          locale={locale}
          relationshipManager={relationshipManager}
        />
      </div>
    </>
  );
}

import LanguageSelector from "./LanguageSelector";
import { Suspense } from "react";
import Spinner from "./Spinner";
import { getDictionary } from "@/utils";
import { type Locale } from "@/i18n-config";
import NavLinks from "./NavLinks";
import PdfButton from "@/app/[locale]/[id]/PdfButton";
import { getPdfDossier, getUser } from "@/utils";
import HeaderSimple from "./HeaderSimple";
import LogoutButton from "@/app/[locale]/(simpleLayout)/[id]/login/LogoutButton";
// import { cookies } from "next/headers";

export default async function Header({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  // const cookieStore = cookies();
  // const cookie = cookieStore.get(`token-${params.id}`);
  // const pdfDossierPromise = getPdfDossier(params.locale, params.id, cookie);

  let dict, user;
  try {
    [dict] = await Promise.all([
      getDictionary(params.locale),
      // getUser(params.locale, params.id, cookie),
    ]);
  } catch (error) {
    console.error(error);
    return <HeaderSimple params={params} />;
  }

  if (!user) {
    return <HeaderSimple params={params} />;
  }

  return (
    <HeaderSimple params={params}>
      <div className="flex flex-row items-center font-title">
        <div className="hidden sm:block">
          <NavLinks dict={dict.header} />
        </div>
        {/* {user.canDownloadPdf ? (
          <div>
            <PdfButton pdfDossierPromise={pdfDossierPromise} />
          </div>
        ) : (
          ""
        )} */}
        <div className="ml-8">
          <Suspense fallback={<Spinner />}>
            <LanguageSelector params={params} />
          </Suspense>
        </div>
        <div className="ml-8">
          <LogoutButton dict={dict.header} params={params} />
        </div>
      </div>
    </HeaderSimple>
  );
}

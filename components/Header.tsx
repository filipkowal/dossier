import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import Image from "next/image";
import DigitalentLogo from "@/public/logo.png";
import Thumnbail from "@/public/thumbnail.png";
import { Suspense } from "react";
import Spinner from "./Spinner";
import { getDictionary } from "@/utils/server/helpers";
import { type Locale } from "@/i18n-config";

export default async function Header({
  params,
  logo,
}: {
  params: { locale: Locale };
  logo?: string;
}) {
  const dict = await getDictionary(params.locale);

  return (
    <header
      id="top"
      className="flex flex-row h-16 bg-digitalent-green justify-between items-center py-3 px-4 sm:px-8 sm:fixed top-0 z-20 w-full"
    >
      <div>
        <Link href={`/${params?.locale}`}>
          <>
            <Image
              src={logo || DigitalentLogo}
              alt="logo"
              width="70"
              height="42.281"
              className="hidden sm:block"
            />
            <Image
              src={logo || Thumnbail}
              alt="logo"
              width="35"
              height="35"
              className="block sm:hidden"
            />
          </>
        </Link>
      </div>
      <div className="flex flex-row items-center font-title">
        <Link
          href={`/${params?.locale}#overview`}
          className="target:border-digitalent-white target:border-b-2"
        >
          <div className="font-medium text-white cursor-pointer">
            {dict.header.overview}
          </div>
        </Link>
        <Link
          href={`/${params?.locale}#cvAndCertificates`}
          className="target:border-digitalent-white target:border-b-2"
        >
          <div className="font-medium text-white cursor-pointer ml-8">
            {dict.header.cvAndCertificates}
          </div>
        </Link>
        <div className="ml-8">
          <Suspense fallback={<Spinner />}>
            <LanguageSelector params={params} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

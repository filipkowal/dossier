import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import Image from "next/image";
import DigitalentLogo from "@/public/logo.png";
import Thumnbail from "@/public/thumbnail.png";
import { Suspense } from "react";
import Spinner from "./Spinner";
import { getDictionary } from "@/utils/server/helpers";
import { type Locale } from "@/i18n-config";
import NavLinks from "./NavLinks";
import Button from "./Button";
import DownloadIcon from "@/public/download.png";

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
      className="flex flex-row h-16 bg-digitalent-blue justify-between items-center py-3 px-4 sm:px-8 sm:fixed top-0 z-20 w-full"
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
        <div className="hidden sm:block">
          <NavLinks dict={dict.header} />
        </div>
        <Button name={"PDF"} type="invert" className="flex gap-2 sm:hidden">
          <Image
            src={DownloadIcon}
            className="h-4 w-4 mt-1"
            alt="download as pdf"
          />{" "}
          PDF
        </Button>
        <div className="ml-8">
          <Suspense fallback={<Spinner />}>
            <LanguageSelector params={params} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

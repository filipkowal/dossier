import { type Locale } from "@/i18n-config";
import Link from "next/link";
import "@/app/globals.css";
import localFont from "next/font/local";
import { CookiePopup, NotFound } from "@/components";
import { getDictionary } from "@/utils";
import DigitalentLogo from "@/public/logo.png";
import Thumbnail from "@/public/thumbnail.png";
import Image from "next/image";
import { headers } from "next/headers";
import { getLocale } from "@/middleware";

const loew = localFont({
  variable: "--font-loew",
  src: "../public/fonts/Loew-Heavy.otf",
  preload: false,
});

export default async function LayoutForNotFound({}: {}) {
  const headersList = headers();

  const locale = getLocale(headersList);
  const dict = await getDictionary((locale || "en") as Locale);

  return (
    <>
      <main className="min-h-screen bg-digitalent-gray-light flex flex-col justify-between">
        <header
          id="top"
          className="flex flex-row h-16 bg-digitalent-blue justify-between items-center py-3 px-4 sm:px-8 sm:fixed top-0 z-20 w-full"
        >
          <div>
            <Link href={`/${locale}`}>
              <>
                <Image
                  src={DigitalentLogo}
                  alt="logo"
                  width="70"
                  height="42.281"
                  className="hidden sm:block"
                />
                <Image
                  src={Thumbnail}
                  alt="logo"
                  width="35"
                  height="35"
                  className="block sm:hidden"
                />
              </>
            </Link>
          </div>
        </header>

        <NotFound dict={dict["utilityPages"]["notFound"]} />

        <footer className={`self-bottom w-full ${loew.variable}`}>
          <div className="text-center py-2 max-w-full bg-digitalent-gray-dark text-white font-sans text-[11px]">
            powered by
            <Link href="https://digitalent.community" target="_blank">
              <span className="font-logo"> DIGITALENT </span>
            </Link>
            © 2023
          </div>
        </footer>
      </main>

      <CookiePopup dict={dict.cookiePopup} />
    </>
  );
}

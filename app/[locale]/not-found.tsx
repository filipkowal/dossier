import { type Locale } from "@/i18n-config";
import Link from "next/link";
import "@/app/[locale]/globals.css";
import localFont from "next/font/local";
import { CookiePopup, NotFound } from "@/components";
import { getDictionary, getLocale } from "@/utils";
import { headers } from "next/headers";
import HeaderSimple from "@/components/HeaderSimple";

const loew = localFont({
  variable: "--font-loew",
  src: "../../public/fonts/Loew-Heavy.otf",
  preload: false,
});

export default async function LayoutForNotFound({}: {}) {
  const headersList = headers();

  const locale = getLocale(headersList);
  const dict = await getDictionary((locale || "en") as Locale);

  return (
    <>
      <main className="min-h-screen bg-digitalent-gray-light flex flex-col justify-between">
        <HeaderSimple params={{ locale: locale || "en", id: "" }} />

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

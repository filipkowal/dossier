import { type Locale } from "@/i18n-config";
import Link from "next/link";
import "@/app/globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { CookiePopup, ToastProvider } from "@/components";
import { getDictionary } from "@/utils";
import Image from "next/image";
import DigitalentLogo from "@/public/logo.png";
import Thumnbail from "@/public/thumbnail.png";

export const metadata: Metadata = {
  title: "Digitalent Dossier",
  description: "Candidates' data in one place by digitalent.ch",
  icons: "/thumbnail.png",
  robots: {
    index: true, // Allow search engines to index the page
    follow: true, // Allow search engines to follow links on the page
    nocache: false, // Allow search engines to cache the page
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false, // Allow Google to index images on the page
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const loew = localFont({
  variable: "--font-loew",
  src: "../../../public/fonts/Loew-Heavy.otf",
  preload: false,
});

export default async function RootLayout({
  params,
  children,
}: {
  params: { locale: Locale; id: string };
  children: React.ReactNode;
}) {
  const dict = await getDictionary(params.locale);

  return (
    <>
      <main className="min-h-screen bg-digitalent-gray-light flex flex-col justify-between">
        <ToastProvider />
        <header
          id="top"
          className="flex flex-row h-16 bg-digitalent-blue justify-between items-center py-3 px-4 sm:px-8 sm:fixed top-0 z-20 w-full"
        >
          <div>
            <Link href={`/${params?.locale}/${params?.id}`}>
              <>
                <Image
                  src={DigitalentLogo}
                  alt="logo"
                  width="70"
                  height="42.281"
                  className="hidden sm:block"
                />
                <Image
                  src={Thumnbail}
                  alt="logo"
                  width="35"
                  height="35"
                  className="block sm:hidden"
                />
              </>
            </Link>
          </div>
        </header>

        {children}

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

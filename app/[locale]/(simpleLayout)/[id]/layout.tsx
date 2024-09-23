import { type Locale } from "@/i18n-config";
import Link from "next/link";
import "@/app/[locale]/globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { CookiePopup } from "@/components";
import { getDictionary } from "@/utils";
import HeaderSimple from "@/components/HeaderSimple";
import SampleDossier from "./SampleDossier";

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
  src: "../../../../public/fonts/Loew-Heavy.otf",
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

  throw new Error("test message");
  return (
    <>
      <main className="min-h-screen bg-digitalent-gray-light flex flex-col justify-between">
        <HeaderSimple params={params} />

        {children}
        <SampleDossier />

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

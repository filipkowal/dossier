import { type Locale } from "@/i18n-config";
import Link from "next/link";
import "@/app/globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { CookiePopup, Header } from "@/components";
import { getDictionary, SERVER_URL } from "@/utils";
import TokenExpiryChecker from "@/components/TokenExpiryChecker";
import { cookies } from "next/headers";

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
  const cookieStore = cookies();
  const cookie = cookieStore.get(`token-${params.id}`);

  console.log("api url: ", SERVER_URL);

  return (
    <>
      <main className="min-h-screen bg-digitalent-gray-light flex flex-col">
        <Header params={params} cookie={cookie} />
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
      <TokenExpiryChecker params={params} dict={dict.tokenExpiry} />
    </>
  );
}

import { type Locale } from "@/i18n-config";
import Link from "next/link";
import "@/app/globals.css";
import localFont from "next/font/local";
import { Merriweather } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import CookiePopup from "@/components/CookiePopup";
import { getDictionary } from "@/utils/server/helpers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Digitalent Dossier",
  description: "Candidates' data in one place by digitalent.ch",
  icons: "/thumbnail.png",
  viewport: "width=device-width, initial-scale=1",
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

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const stolzl = localFont({
  variable: "--font-stolzl",
  src: [
    { path: "../../../public/fonts/Stolzl-Regular.ttf", weight: "400" },
    { path: "../../../public/fonts/Stolzl-Medium.ttf", weight: "500" },
  ],
});

const loew = localFont({
  variable: "--font-loew",
  src: "../../../public/fonts/Loew-Heavy.otf",
  preload: false,
});

export default async function RootLayout({
  params,
  children,
}: {
  params: { locale: Locale };
  children: React.ReactNode;
}) {
  const dict = await getDictionary(params.locale);

  return (
    <html
      lang={params.locale || "en"}
      className={`${merriweather.variable} ${stolzl.variable} text-digitalent-blue`}
    >
      <head>
        <title>Dossier digitalent</title>
        <meta name="description" content="Digitalent jobs" />
        <link rel="icon" href="/thumbnail.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script id="googleAnalytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
        </Script> */}
      </head>
      <body className="font-serif">
        <main className="min-h-screen bg-digitalent-gray-light flex flex-col justify-between">
          <Header params={params} />
          {children}

          <footer className={`self-bottom w-full ${loew.variable}`}>
            <div className="text-center py-2 max-w-full bg-digitalent-gray-dark font-sans text-[11px]">
              powered by
              <Link href="https://digitalent.community" target="_blank">
                <span className="font-logo"> DIGITALENT </span>
              </Link>
              © 2023
            </div>
          </footer>
        </main>

        <CookiePopup dict={dict.cookiePopup} />
      </body>
    </html>
  );
}

"use client";
import { ErrorPage } from "@/components";
import { type Locale } from "@/i18n-config";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { Metadata } from "next";
import localFont from "next/font/local";
import { Merriweather } from "next/font/google";

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

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const stolzl = localFont({
  variable: "--font-stolzl",
  src: [
    { path: "../public/fonts/Stolzl-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Stolzl-Medium.ttf", weight: "500" },
  ],
});

export default function GlobalError({
  error,
  params,
}: {
  error: Error;
  params: { locale: Locale };
}) {
  console.log("global error");
  const paramsUse = useParams() as { locale: Locale };
  const segment = useSelectedLayoutSegment();
  console.log("segment", segment);
  console.log("paramsUse", paramsUse);
  console.log("params", params);

  return (
    <html
      className={`${merriweather.variable} ${stolzl.variable} text-digitalent-blue font-serif`}
      lang={segment || "en"}
    >
      <head>
        <link rel="icon" href="/thumbnail.png" />
      </head>
      <body>
        <ErrorPage error={error} locale={(segment as Locale) || "en"} />
      </body>
    </html>
  );
}

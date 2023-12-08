"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavLinks({ dict }: { dict: any }) {
  const [isScrolledToCv, setIsScrolledToCv] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const cvAndCertificates = document.getElementById("cvAndCertificates");

      if (cvAndCertificates) {
        const cvAndCertificatesPosition =
          cvAndCertificates.getBoundingClientRect().top;

        const topMargin = 128;
        if (cvAndCertificatesPosition <= topMargin) {
          setIsScrolledToCv(true);
          return;
        }

        setIsScrolledToCv(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <Link
        href={`#top`}
        className={`text-white border-b-2 ${
          !isScrolledToCv ? "border-digitalent-white" : "border-transparent"
        }`}
      >
        {dict.overview}
      </Link>
      <Link
        href={`#cvAndCertificates`}
        className={`ml-8 text-white border-b-2 ${
          isScrolledToCv ? "border-digitalent-white" : "border-transparent"
        }`}
      >
        {dict.cvAndCertificates}
      </Link>
    </>
  );
}

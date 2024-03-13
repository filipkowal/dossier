"use client";

import { useEffect, useState } from "react";

export default function NavLinks({ dict }: { dict: any }) {
  const [isScrolledToCv, setIsScrolledToCv] = useState(false);

  // Check if the user has scrolled to the CV section
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

  const handleClick = (id: string) => {
    if (id === "top") return window.scrollTo({ top: 0, behavior: "smooth" });
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <a
        onClick={() => handleClick("top")}
        className={`text-white border-b-2 cursor-pointer ${
          !isScrolledToCv ? "border-digitalent-white" : "border-transparent"
        }`}
      >
        {dict.overview}
      </a>
      <a
        onClick={() => handleClick("cvAndCertificates")}
        className={`ml-8 text-white border-b-2 cursor-pointer ${
          isScrolledToCv ? "border-digitalent-white" : "border-transparent"
        }`}
      >
        {dict.cvAndCertificates}
      </a>
    </>
  );
}

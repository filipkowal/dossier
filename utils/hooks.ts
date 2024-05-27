"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isLoggedIn } from "./fetchers";
import { Locale } from "./types";

const useTokenCheck = (locale: Locale, id: string) => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      if (!(await isLoggedIn())) {
        toast.error("Your token has expired. Please log in again.");
        router.push(`/${locale}/${id}/login`);
      }
    };

    // Check token every minute
    const interval = setInterval(checkToken, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [router]);
};

export default useTokenCheck;

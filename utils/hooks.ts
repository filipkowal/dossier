"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isLoggedIn } from "./fetchers";
import { Locale } from "./types";
import { Dictionary } from "./helpers";

const useTokenCheck = (
  locale: Locale,
  id: string,
  dict: Dictionary["tokenExpiry"]
) => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      let isAuthorized;

      try {
        isAuthorized = await isLoggedIn(id);

        if (!isAuthorized) {
          toast(dict.expiredMessage, { icon: "ℹ️" });
          router.push(`/${locale}/${id}/login`);
        }
      } catch (e) {
        console.log(e);
        toast.error(dict.expiredError);
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

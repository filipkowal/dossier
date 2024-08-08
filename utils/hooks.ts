"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isLoggedIn } from "./fetchers";
import { Locale } from "./types";
import { Dictionary, logoutAndRedirect } from "./helpers";

// Check for token every minute and redirect if it's expired
export const useTokenCheck = (
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
          router.refresh();
        }
      } catch (e) {
        console.log(e);
        toast.error(dict.expiredError);
        router.push(`/${locale}/${id}/login`);
        router.refresh();
      }
    };

    // Check token every minute
    const interval = setInterval(checkToken, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [router]);
};

//
// Log user out after 5 minutes of inactivity
//
export const useAutoLogout = (
  locale: Locale,
  id: string,
  dict: Dictionary["tokenExpiry"]
) => {
  const router = useRouter();
  const FIVE_MINUTES = 5 * 60 * 1000;

  const logoutUser = async () => {
    try {
      await logoutAndRedirect(id, locale, router);
    } finally {
      toast(dict.inactivity, { icon: "ℹ️" });
    }
  };

  useEffect(() => {
    let timeout = setTimeout(logoutUser, FIVE_MINUTES);

    const resetInactivityTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutUser, FIVE_MINUTES);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimeout)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimeout)
      );
      clearTimeout(timeout);
    };
  }, []);

  return null;
};

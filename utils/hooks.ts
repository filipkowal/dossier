"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isLoggedIn } from "./fetchers";

const useTokenCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      if (!(await isLoggedIn())) {
        toast.error("Your token has expired. Please log in again.");
        router.push("/login");
      }
    };

    // Check token every minute
    const interval = setInterval(checkToken, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [router]);
};

export default useTokenCheck;

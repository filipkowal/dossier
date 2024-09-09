"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { inviteCandidate, isLoggedIn } from "./fetchers";
import { Locale, TimeSlots, User } from "./types";
import { Dictionary, logoutAndRedirect, updateSearchParams } from "./helpers";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

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

export function useDialog(name: string) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isOpen, setIsOpenInternal] = useState(
    searchParams?.get("modal") === name
  );

  useEffect(() => {
    if (searchParams?.get("modal") === name) {
      setIsOpenInternal(true);
    } else {
      setIsOpenInternal(false);
    }
  }, [searchParams]);

  function setIsOpen(value: boolean) {
    if (value) {
      updateSearchParams("modal", name, searchParams, router);
    } else {
      updateSearchParams("modal", null, searchParams, router);
    }
    setIsOpenInternal(value);
  }

  return { isOpen, setIsOpen };
}

export function useSteps(steps: string[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentStepName, setCurrentStepNameInternal] = useState<
    (typeof steps)[number]
  >(searchParams?.get("step") || steps[0]);

  useEffect(() => {
    if (searchParams?.get("step")) {
      setCurrentStepNameInternal(searchParams?.get("step") || steps[0]);
    } else {
      setCurrentStepNameInternal(steps[0]);
    }
  }, [searchParams]);

  function setCurrentStepName(value: string) {
    if (value) {
      updateSearchParams("step", value, searchParams, router);
    } else {
      updateSearchParams("step", null, searchParams, router);
    }
    setCurrentStepNameInternal(value);
  }

  function incrStep() {
    const index = steps.indexOf(currentStepName);
    const nextStep = steps[index + 1];
    if (nextStep) {
      setCurrentStepName(nextStep);
    }
  }

  function decrStep() {
    const index = steps.indexOf(currentStepName);
    const prevStep = steps[index - 1];
    if (prevStep) {
      setCurrentStepName(prevStep);
    }
  }

  return { currentStepName, incrStep, decrStep };
}

export const useInviteForm = ({
  user,
  locale,
  id,
  dict,
}: {
  user: User;
  dict: Dictionary["toastMessages"];
  locale: Locale;
  id: string;
}) => {
  const [isInterviewOnline, setIsInterviewOnline] = useState(true);
  const [interviewLocation, setInterviewLocation] = useState(
    user.address
      ? `${user.address?.street}, ${user.address?.city}, ${user.address?.country}`
      : ""
  );
  const [interviewLink, setInterviewLink] = useState("");
  const [availibilitySlots, setAvailibilitySlots] = useState<TimeSlots>([]);
  const [interviewDuration, setInterviewDuration] = useState(30);
  const [invitePending, setInvitePending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const stepsObject = {
    location: user.isInterviewLocationInputVisible,
    availibility: user.isInterviewAvailabilityInputVisible,
    success: true,
  };
  const steps = Object.entries(stepsObject)
    .filter(([, value]) => value)
    .map(([key, _]) => key);

  const showNoForm = !stepsObject.location && !stepsObject.availibility;

  function resetInviteData() {
    setSuccessMessage("");
    setAvailibilitySlots([]);
    setInterviewDuration(30);
    setIsInterviewOnline(true);
    setInterviewLocation(
      user.address
        ? `${user.address?.street}, ${user.address?.city}, ${user.address?.country}`
        : ""
    );
    setInterviewLink("");
  }

  function getFormValues() {
    return {
      interviewDuration,
      channel: isInterviewOnline ? "online" : ("onsite" as "online" | "onsite"),
      address: interviewLocation,
      url: interviewLink,
      availibilitySlots: availibilitySlots.map((slot) => ({
        ...slot,
        date: dayjs(slot.date).format("YYYY-MM-DD"),
      })),
    };
  }

  const onSubmit = async ({
    setIsOpen,
    incrStep,
    formValues,
  }: {
    setIsOpen: (value: boolean) => void;
    incrStep: () => void;
    formValues?: Parameters<typeof inviteCandidate>[2];
  }) => {
    setInvitePending(true);

    try {
      const response = await inviteCandidate(locale, id, formValues);

      revalidatePath(`/${locale}/${id}`, "layout");

      setSuccessMessage(response);

      if (showNoForm) {
        setIsOpen(true);
      } else {
        incrStep();
      }
    } catch (e) {
      toast.error(dict["somethingWrong"]);
    } finally {
      setInvitePending(false);
    }
  };

  return {
    steps,
    isInterviewOnline,
    setIsInterviewOnline,
    interviewLocation,
    setInterviewLocation,
    interviewLink,
    setInterviewLink,
    availibilitySlots,
    setAvailibilitySlots,
    interviewDuration,
    setInterviewDuration,
    invitePending,
    successMessage,
    showNoForm,
    resetInviteData,
    getFormValues,
    onSubmit,
  };
};

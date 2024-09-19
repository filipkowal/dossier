"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { inviteCandidate, isLoggedIn } from "./fetchers";
import { Locale, TimeSlots, User } from "./types";
import { Dictionary, logoutAndRedirect, updateSearchParams } from "./helpers";
import dayjs from "dayjs";
import { revalidateMainPathAction } from "./actions";

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
  }, [router, id, locale, dict.expiredMessage, dict.expiredError]);
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
  const FIVE_MINUTES = 60 * 1000;
  const [secondsLeft, setSecondsLeft] = useState(FIVE_MINUTES / 1000);

  const toastIdRef = useRef("remainingTime");

  useEffect(() => {
    const messageDiv = (
      <div style={{ background: "#E7E248", padding: "1rem 3rem" }}>
        You will be logged out in: <b>{secondsLeft}</b>s
      </div>
    );
    // Display inactivity message
    if (secondsLeft < 11 && secondsLeft > 0) {
      toast.custom(messageDiv, {
        id: toastIdRef.current,
        duration: 90000,
        icon: "ℹ️",
      });
    }

    // on inactiviy timout restart -> restart secondsLeft
    if (secondsLeft === FIVE_MINUTES / 1000 || secondsLeft <= 0) {
      toast.dismiss(toastIdRef.current);
    }
  }, [secondsLeft, dict.inactivity, FIVE_MINUTES, toastIdRef]);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await logoutAndRedirect(id, locale, router);
      } finally {
        toastIdRef.current = toast(dict.inactivity, {
          icon: "ℹ️",
          duration: 10000,
        });
      }
    };

    let timeout = setTimeout(logoutUser, FIVE_MINUTES);

    function decrementSecondsLeft() {
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }

    const interval = setInterval(decrementSecondsLeft, 1000);

    const resetInactivityTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutUser, FIVE_MINUTES);

      setSecondsLeft(FIVE_MINUTES / 1000);
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
      clearInterval(interval);
    };
  }, [FIVE_MINUTES, dict.inactivity, id, locale, router]);

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

export function useSteps<T extends readonly string[]>(steps: T) {
  const [currentStepName, setCurrentStepName] = useState<T[number]>(steps[0]);

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

  const currentStepTitle: `${T[number]}StepTitle` = `${currentStepName}StepTitle`;

  return {
    currentStepName,
    currentStepTitle,
    incrStep,
    decrStep,
  };
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
  const [availabilitySlots, setAvailabilitySlots] = useState<TimeSlots>([]);
  const [interviewDuration, setInterviewDuration] = useState(30);
  const [invitePending, setInvitePending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const stepsObject: {
    location: boolean | undefined;
    availability: boolean | undefined;
    success: boolean;
  } = {
    location: user.isInterviewLocationInputVisible,
    availability: user.isInterviewAvailabilityInputVisible,
    success: true,
  };

  const steps = Object.entries(stepsObject)
    .filter(([, value]) => value)
    .map(([key, _]) => key as keyof typeof stepsObject);

  const stepTitles = steps.map((step) => `${step}StepTitle` as const);

  const showNoForm = !stepsObject.location && !stepsObject.availability;

  function resetInviteData() {
    setSuccessMessage("");
    setAvailabilitySlots([]);
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
      availabilitySlots: availabilitySlots.map((slot) => ({
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

      revalidateMainPathAction({ locale, id });

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
    stepTitles,
    isInterviewOnline,
    setIsInterviewOnline,
    interviewLocation,
    setInterviewLocation,
    interviewLink,
    setInterviewLink,
    availabilitySlots,
    setAvailabilitySlots,
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

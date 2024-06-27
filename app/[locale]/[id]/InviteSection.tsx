"use client";
import { ReactNode, useState } from "react";
import { type Dictionary, User, inviteCandidate, Locale } from "@/utils";
import { FormFooterButtons, Dialog, Button } from "@/components";
import toast from "react-hot-toast";
import AvailibilityStep from "./InviteSectionAvailibility";
import LocationStep from "./InviteSectionLocation";
import { useRouter } from "next/navigation";
import SuccessIcon from "@/public/success.webp";
import Image from "next/image";

export type TimeSlots = {
  id: number;
  startDateTime: string;
  endTime: string;
}[];

export default function InviteSection({
  dict,
  user,
  params,
  candidateGender = "m",
}: {
  dict: Dictionary["inviteModal"] &
    Dictionary["mainButtons"] &
    Dictionary["toastMessages"];
  user: User;
  params: { locale: Locale; id: string };
  candidateGender?: "m" | "f";
}) {
  const { locale, id } = params;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<number>(0);

  const [isInterviewOnline, setIsInterviewOnline] = useState(true);
  const [inteviewLocation, setInterviewLocation] = useState(
    `${user.address?.street}, ${user.address?.city}, ${user.address?.country}` ||
      ""
  );
  const [interviewLink, setInterviewLink] = useState("");
  const [availibilitySlots, setAvailibilitySlots] = useState<TimeSlots>([]);
  const [interviewDuration, setInterviewDuration] = useState(30);
  const [newSlot, setNewSlot] = useState({
    id: 0,
    startDateTime: "",
    endTime: "",
  });
  const [invitePending, setInvitePending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const steps: {
    content: ReactNode;
    title: "locationStepTitle" | "availabilityStepTitle" | "successStepTitle";
  }[] = [];

  if (user.isInviteButtonVisible === false) return null;

  if (user.isInterviewLocationInputVisible) {
    steps.push({
      content: (
        <LocationStep
          key="locationStep"
          setStep={setStep}
          setIsInterviewOnline={setIsInterviewOnline}
          interviewLocation={inteviewLocation}
          setInterviewLocation={setInterviewLocation}
          interviewLink={interviewLink}
          setInterviewLink={setInterviewLink}
          isInterviewOnline={isInterviewOnline}
          interviewDuration={interviewDuration}
          setInterviewDuration={setInterviewDuration}
          dict={dict}
        />
      ),
      title: "locationStepTitle",
    });
  }

  if (user.isInterviewAvailabilityInputVisible) {
    steps.push({
      content: (
        <AvailibilityStep
          key="availibilityStep"
          newSlot={newSlot}
          setNewSlot={setNewSlot}
          availibilitySlots={availibilitySlots}
          setAvailibilitySlots={setAvailibilitySlots}
          dict={dict}
        />
      ),
      title: "availabilityStepTitle",
    });
  }

  steps.push({
    content: (
      <div className="flex flex-col gap-6 items-center">
        <Image src={SuccessIcon} alt="success" width={96} height={96} />
        <h1>
          {successMessage
            ? successMessage
            : dict["success"][candidateGender === "m" ? "male" : "female"]}
        </h1>
      </div>
    ),
    title: "successStepTitle",
  });

  return (
    <>
      <Button
        type="primary"
        name={dict.inviteToInterview}
        className="w-full sm:w-1/3 xl:w-1/4 max-w-[32rem]"
        onClick={() => setIsOpen(true)}
      >
        <span className="hidden sm:block">{dict.inviteToInterview}</span>
        <span className="sm:hidden">{dict.invite}</span>
      </Button>

      <Dialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={dict[steps[step].title]}
        footer={
          <FormFooterButtons
            step={step}
            setStep={setStep}
            stepsLength={steps.length}
            dict={dict}
            isPending={invitePending}
            setIsOpen={setIsOpen}
            submissionDisabled={
              availibilitySlots.length === 0 &&
              !(newSlot.startDateTime && newSlot.endTime)
            }
            onSubmit={async () => {
              setInvitePending(true);
              const slots = [...availibilitySlots];
              if (newSlot.startDateTime && newSlot.endTime) {
                slots.push(newSlot);
              }

              if (slots.length === 0) {
                toast.error(dict["noSlots"]);
                return;
              }

              try {
                const formValues = {
                  interviewDuration,
                  channel: isInterviewOnline
                    ? "online"
                    : ("onsite" as "online" | "onsite"),
                  address: inteviewLocation,
                  url: interviewLink,
                  availibilitySlots: slots,
                };

                const response = await inviteCandidate(locale, id, formValues);
                setSuccessMessage(response);

                router.refresh();
                setStep((step) => step + 1);
              } catch (e) {
                toast.error(dict["somethingWrong"]);
              } finally {
                setInvitePending(false);
              }
            }}
          />
        }
      >
        <form className="flex flex-col gap-6">
          {" "}
          {/* // Don't autofocus the first input so that on mobile the form is visble workaround */}
          <input
            type="text"
            style={{ position: "absolute", top: "-9999px" }}
            autoFocus
          />
          {steps[step].content}
        </form>
      </Dialog>
    </>
  );
}

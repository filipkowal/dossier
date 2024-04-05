"use client";
import { useState } from "react";
import { type Dictionary, User, inviteCandidate } from "@/utils";
import { FormFooterButtons, Dialog, Button } from "@/components";
import toast from "react-hot-toast";
import AvailibilityStep from "./InviteSectionAvailibility";
import LocationStep from "./InviteSectionLocation";

export type TimeSlots = { id: number; startTime: string; endTime: string }[];

export default function InviteSection({
  dict,
  user,
  id,
}: {
  dict: Dictionary["inviteModal"] &
    Dictionary["mainButtons"] &
    Dictionary["toastMessages"];
  user: User;
  id: string;
}) {
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
  const [newSlot, setNewSlot] = useState({ id: 0, startTime: "", endTime: "" });

  const steps = [];

  if (user.isInterviewLocationInputVisible) {
    steps.push(
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
    );
  }

  if (user.isInterviewAvailabilityInputVisible) {
    steps.push(
      <AvailibilityStep
        key="availibilityStep"
        newSlot={newSlot}
        setNewSlot={setNewSlot}
        availibilitySlots={availibilitySlots}
        setAvailibilitySlots={setAvailibilitySlots}
        dict={dict}
      />
    );
  }

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
        title={dict[`title${step as 0 | 1}`]}
        footer={
          <FormFooterButtons
            step={step}
            setStep={setStep}
            stepsLength={steps.length}
            dict={dict}
            submissionDisabled={
              availibilitySlots.length === 0 &&
              !(newSlot.startTime && newSlot.endTime)
            }
            onSubmit={async () => {
              const slots = [...availibilitySlots];
              if (newSlot.startTime && newSlot.endTime) {
                slots.push(newSlot);
              }

              if (slots.length === 0) {
                toast.error(dict["noSlots"]);
                return;
              }

              try {
                const formValues = {
                  duration: interviewDuration,
                  channel: isInterviewOnline
                    ? "online"
                    : ("onsite" as "online" | "onsite"),
                  address: inteviewLocation,
                  url: interviewLink,
                  availibilitySlots: slots,
                };

                await inviteCandidate(id, formValues);

                setIsOpen(false);
              } catch (e) {
                toast.error(dict["somethingWrong"]);
              }
            }}
          />
        }
      >
        <form className="flex flex-col gap-6">{steps[step]}</form>
      </Dialog>
    </>
  );
}

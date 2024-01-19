"use client";
import TextInput from "@/components/TextInput";
import Dialog from "@/components/Dialog";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Tooltip from "@/components/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import NumberInput from "@/components/NumberInput";
import { type Dictionary } from "@/utils/server";

export default function InviteSection({
  dict,
}: {
  dict: Dictionary["inviteModal"] & Dictionary["mainButtons"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);

  const [isInterviewOnline, setIsInterviewOnline] = useState(true);
  const [location, setLocation] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [meetingTime, setMeetingTime] = useState("");

  const steps = [
    <LocationStep
      key={"locationStep"}
      setStep={setStep}
      setIsInterviewOnline={setIsInterviewOnline}
      setLocation={setLocation}
      isInterviewOnline={isInterviewOnline}
      dict={dict}
    />,
    <AvailibilityStep
      key={"availibilityStep"}
      setStep={setStep}
      setMeetingDuration={setMeetingDuration}
      isInterviewOnline={isInterviewOnline}
      location={location}
      meetingDuration={meetingDuration}
      meetingTime={meetingTime}
      setMeetingTime={setMeetingTime}
      dict={dict}
    />,
  ];

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
        title={dict[`title${step}`]}
      >
        <form className="flex flex-col gap-6">{steps[step]}</form>
      </Dialog>
    </>
  );
}

function LocationStep({
  setStep,
  setIsInterviewOnline,
  setLocation,
  isInterviewOnline,
  dict,
}: {
  setStep: Dispatch<SetStateAction<0 | 1>>;
  setIsInterviewOnline: Dispatch<SetStateAction<boolean>>;
  setLocation: Dispatch<SetStateAction<string>>;
  isInterviewOnline: any;
  dict: Dictionary["inviteModal"];
}) {
  return (
    <>
      <span className="text-xl">{dict.location}</span>
      <div className="flex gap-6">
        <Checkbox
          name="interviewType"
          value="online"
          checked={isInterviewOnline === true}
          required
          onChange={() => {
            console.log("setttt");
            setIsInterviewOnline(true);
          }}
        >
          {dict.online}
        </Checkbox>
        <Checkbox
          name="interviewType"
          value="inPerson"
          checked={isInterviewOnline === false}
          onChange={() => {
            console.log("yo");
            setIsInterviewOnline(false);
          }}
        >
          {dict.inPerson}
        </Checkbox>
      </div>
      <div className="flex items-center">
        <TextInput
          name="location"
          label={isInterviewOnline ? dict.meetingLink : dict.address}
          onChange={(e) => setLocation(e.target.value)}
          className="max-w-3/4 w-[28rem] mr-4"
        />
        {isInterviewOnline ? (
          <div className="relative">
            <Tooltip
              content="We will provide the link later unless you add it here."
              ariaLabel="We will provide the link later unless you add it here."
            >
              <InformationCircleIcon width={24} />
            </Tooltip>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="w-full flex justify-end">
        <Button
          type="primary"
          name="Invite"
          onClick={() => setStep((step) => 1)}
        >
          {dict.next}
        </Button>
      </div>
    </>
  );
}

function AvailibilityStep({
  setStep,
  setMeetingDuration,
  isInterviewOnline,
  location,
  meetingDuration,
  meetingTime,
  setMeetingTime,
  dict,
}: {
  setStep: Dispatch<SetStateAction<0 | 1>>;
  setMeetingDuration: Dispatch<SetStateAction<number>>;
  isInterviewOnline: any;
  location: string;
  meetingDuration: number;
  meetingTime: string;
  setMeetingTime: Dispatch<SetStateAction<string>>;
  dict: Dictionary["inviteModal"];
}) {
  return (
    <>
      <div className="flex gap-6">
        <NumberInput
          name="duration"
          min="15"
          max="120"
          step="15"
          value={meetingDuration}
          onChange={(e) => setMeetingDuration(parseInt(e.target.value))}
          label={dict.duration}
          className="w-72"
        />

        <TextInput
          name="meetingTime"
          type="datetime-local"
          className="w-72"
          value={meetingTime}
          onChange={(e) => setMeetingTime(e.target.value)}
          label={dict.dateTime}
        />
      </div>

      <div className="w-full flex justify-between">
        <Button
          type="default"
          name="Previous"
          onClick={() => setStep((step) => 0)}
        >
          {dict.previous}
        </Button>

        <Button
          type="primary"
          submitType
          name="Send"
          onClick={(e) => {
            e.preventDefault();

            const formValues = {
              isInterviewOnline,
              location,
              meetingDuration,
            };
            console.log("vals: ", formValues);
          }}
        >
          {dict.send}
        </Button>
      </div>
    </>
  );
}

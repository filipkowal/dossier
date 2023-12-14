"use client";
import TextInput from "@/components/TextInput";
import Dialog from "@/components/Dialog";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

export default function InviteSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [isInterviewOnline, setIsInterviewOnline] = useState(true);
  const [location, setLocation] = useState("");
  const [availabilityCalendar, setAvailabilityCalendar] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(30);

  const steps = [
    <LocationStep
      key={"locationStep"}
      setStep={setStep}
      setIsInterviewOnline={setIsInterviewOnline}
      setLocation={setLocation}
      setAvailabilityCalendar={setAvailabilityCalendar}
      isInterviewOnline={isInterviewOnline}
    />,
    <AvailibilityStep
      key={"availibilityStep"}
      setStep={setStep}
      setMeetingDuration={setMeetingDuration}
      isInterviewOnline={isInterviewOnline}
      location={location}
      availabilityCalendar={availabilityCalendar}
      meetingDuration={meetingDuration}
    />,
  ];

  return (
    <>
      <Button
        type="primary"
        name="Invite"
        className="w-1/3 xl:w-1/4 max-w-[32rem]"
        onClick={() => setIsOpen(true)}
      >
        Invite to an interview
      </Button>

      <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title="Interview Details">
        <form className="flex flex-col gap-6">{steps[step]}</form>
      </Dialog>
    </>
  );
}

function LocationStep({
  setStep,
  setIsInterviewOnline,
  setLocation,
  setAvailabilityCalendar,
  isInterviewOnline,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setIsInterviewOnline: Dispatch<SetStateAction<boolean>>;
  setLocation: Dispatch<SetStateAction<string>>;
  setAvailabilityCalendar: Dispatch<SetStateAction<string>>;
  isInterviewOnline: any;
}) {
  return (
    <>
      <span className="text-xl">Location</span>
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
          Online
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
          In person
        </Checkbox>
      </div>
      <TextInput
        name="location"
        label={
          isInterviewOnline
            ? "Link to the meeting online"
            : "Address of the interview meeting"
        }
        onChange={(e) => setLocation(e.target.value)}
      ></TextInput>
      <span className="text-xl mt-4 -mb-2">
        Provide your availibility calendar (optional)...
      </span>
      <TextInput
        name="location"
        label="https://calendly.com/your-name/..."
        onChange={(e) => setAvailabilityCalendar(e.target.value)}
      ></TextInput>
      <span className="text-xl ">
        ... or set your availibility in the next step
      </span>
      <div className="w-full flex justify-end">
        <Button
          type="primary"
          name="Invite"
          onClick={() => setStep((step) => step + 1)}
        >
          Next
        </Button>
      </div>{" "}
    </>
  );
}

function AvailibilityStep({
  setStep,
  setMeetingDuration,
  isInterviewOnline,
  location,
  availabilityCalendar,
  meetingDuration,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setMeetingDuration: Dispatch<SetStateAction<number>>;
  isInterviewOnline: boolean;
  location: string;
  availabilityCalendar: string;
  meetingDuration: number;
}) {
  return (
    <>
      <span className="text-xl">Meeting duration</span>
      <input
        type="number"
        name="duration"
        min="15"
        max="120"
        step="15"
        defaultValue={30}
        onChange={(e) => setMeetingDuration(parseInt(e.target.value))}
      />
      <div className="w-full flex justify-between">
        <Button
          type="default"
          name="Previous"
          onClick={() => setStep((step) => step - 1)}
        >
          Previous
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
              availabilityCalendar,
              meetingDuration,
            };
            console.log("vals: ", formValues);
          }}
        >
          Send
        </Button>
      </div>
    </>
  );
}

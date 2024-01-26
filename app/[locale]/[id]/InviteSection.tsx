"use client";
import TextInput from "@/components/TextInput";
import Dialog from "@/components/Dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Tooltip from "@/components/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import NumberInput from "@/components/NumberInput";
import { type Dictionary } from "@/utils/server";

type TimeSlots = { id: number; startTime: string; endTime: string }[];

export default function InviteSection({
  dict,
}: {
  dict: Dictionary["inviteModal"] & Dictionary["mainButtons"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);

  const [isInterviewOnline, setIsInterviewOnline] = useState(true);
  const [location, setLocation] = useState("");
  const [availibilitySlots, setAvailibilitySlots] = useState<TimeSlots>([]);
  const [interviewDuration, setInterviewDuration] = useState(30);

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
      isInterviewOnline={isInterviewOnline}
      interviewDuration={interviewDuration}
      setInterviewDuration={setInterviewDuration}
      location={location}
      availibilitySlots={availibilitySlots}
      setAvailibilitySlots={setAvailibilitySlots}
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
  interviewDuration,
  setInterviewDuration,
  isInterviewOnline,
  location,
  availibilitySlots,
  setAvailibilitySlots,
  dict,
}: {
  setStep: Dispatch<SetStateAction<0 | 1>>;
  interviewDuration: number;
  setInterviewDuration: Dispatch<SetStateAction<number>>;
  isInterviewOnline: any;
  location: string;
  availibilitySlots: TimeSlots;
  setAvailibilitySlots: Dispatch<SetStateAction<TimeSlots>>;
  dict: Dictionary["inviteModal"];
}) {
  const [newSlot, setNewSlot] = useState({ id: 0, startTime: "", endTime: "" });

  useEffect(() => {
    if (!newSlot.startTime) return;
    setNewSlot((slot) => {
      const startTime = new Date(slot.startTime);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const endTimeFormatted = new Date(
        endTime.getTime() - endTime.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      return {
        ...slot,
        endTime: endTimeFormatted,
      };
    });
  }, [newSlot.startTime]);

  return (
    <>
      <NumberInput
        name="interviewDuration"
        min={15}
        step={15}
        value={interviewDuration}
        setValue={setInterviewDuration}
        label={dict.duration}
        className="w-[11.58rem]"
      />

      <p className="">
        Choose <b>2- 3 time slots</b>. The slots can be longer than the actual
        meeting duration
      </p>

      {availibilitySlots.map((slot, index) => {
        return (
          <div key={slot.id} className="flex flex-col sm:flex-row gap-6">
            <TextInput
              name={`slot-${index}-startTime`}
              type="datetime-local"
              className="w-72"
              value={slot?.startTime || ""}
              onChange={(e) =>
                setAvailibilitySlots(
                  availibilitySlots.map((s, i) => {
                    if (i === index) {
                      return { ...s, startTime: e.target.value };
                    }
                    return s;
                  })
                )
              }
              label={dict.dateTime}
            />
            <TextInput
              name={`slot-${index}-endTime`}
              type="datetime-local"
              className="w-72"
              value={slot?.endTime || ""}
              onChange={(e) =>
                setAvailibilitySlots(
                  availibilitySlots.map((s, i) => {
                    if (i === index) {
                      return { ...s, endTime: e.target.value };
                    }
                    return s;
                  })
                )
              }
              label={dict.dateTime}
            />
          </div>
        );
      })}

      <div className="flex flex-col sm:flex-row gap-6">
        <TextInput
          name={`newSlot-startTime`}
          type="datetime-local"
          className="w-72"
          value={newSlot.startTime}
          onChange={(e) =>
            setNewSlot({ ...newSlot, startTime: e.target.value })
          }
          label={dict.dateTime}
        />
        <TextInput
          name={`newSlot-endTime`}
          type="datetime-local"
          className="w-72"
          value={newSlot.endTime}
          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
          label={dict.dateTime}
        />
      </div>
      <Button
        name="Add new slot"
        onClick={() => {
          setAvailibilitySlots((slots) => [...slots, newSlot]);
          setNewSlot({ id: newSlot.id + 1, startTime: "", endTime: "" });
        }}
      >
        Add new availibility slot
      </Button>

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
              availibilitySlots,
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

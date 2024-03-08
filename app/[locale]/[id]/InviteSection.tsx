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
import { User, inviteCandidate } from "@/utils";
import FormFooterButtons from "@/components/FormFooterButtons";
import toast from "react-hot-toast";

type TimeSlots = { id: number; startTime: string; endTime: string }[];

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

  if (user.isInviting) {
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

  if (user.isSettingAvailibility) {
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
            onSubmit={async () => {
              const slots = availibilitySlots;
              if (newSlot.startTime) {
                slots.push(newSlot);
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

function LocationStep({
  setIsInterviewOnline,
  interviewLocation,
  setInterviewLocation,
  setInterviewLink,
  isInterviewOnline,
  interviewDuration,
  setInterviewDuration,
  dict,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setIsInterviewOnline: Dispatch<SetStateAction<boolean>>;
  interviewLocation: string;
  setInterviewLocation: Dispatch<SetStateAction<string>>;
  interviewLink: string;
  setInterviewLink: Dispatch<SetStateAction<string>>;
  isInterviewOnline: any;
  interviewDuration: number;
  setInterviewDuration: Dispatch<SetStateAction<number>>;
  dict: Dictionary["inviteModal"];
}) {
  return (
    <>
      <div className="flex gap-6 -mb-2">
        <Checkbox
          name="interviewType"
          value="online"
          checked={isInterviewOnline === true}
          required
          onChange={() => {
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
            setIsInterviewOnline(false);
          }}
        >
          {dict.inPerson}
        </Checkbox>
      </div>

      <div className={isInterviewOnline ? "flex items-center" : "hidden"}>
        <TextInput
          name="interviewLink"
          label={dict.meetingLink}
          onChange={(e) => setInterviewLink(e.target.value)}
          className="max-w-3/4 w-[28rem] mr-4"
        />
        <div className="relative">
          <Tooltip
            content="We will provide the link later unless you add it here."
            ariaLabel="We will provide the link later unless you add it here."
          >
            <InformationCircleIcon width={24} />
          </Tooltip>
        </div>
      </div>

      <div className={!isInterviewOnline ? "flex" : "hidden"}>
        <TextInput
          name="interviewLocation"
          value={interviewLocation}
          label={dict.address}
          onChange={(e) => setInterviewLocation(e.target.value)}
          className={`max-w-3/4 w-[28rem] mr-4`}
        />
      </div>

      <NumberInput
        name="interviewDuration"
        min={15}
        step={15}
        value={interviewDuration}
        setValue={setInterviewDuration}
        label={dict.duration}
        className="w-[11.58rem]"
      />
    </>
  );
}

function AvailibilityStep({
  newSlot,
  setNewSlot,
  availibilitySlots,
  setAvailibilitySlots,
  dict,
}: {
  newSlot: TimeSlots[0];
  setNewSlot: Dispatch<SetStateAction<TimeSlots[0]>>;
  availibilitySlots: TimeSlots;
  setAvailibilitySlots: Dispatch<SetStateAction<TimeSlots>>;
  dict: Dictionary["inviteModal"];
}) {
  useCreateOneHourSlot(newSlot, setNewSlot);

  return (
    <>
      <p>
        {dict.slotsDescription[0]} <b>{dict.slotsDescription[1]}</b>.{" "}
        {dict.slotsDescription[2]}
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
              label={dict.slotStart}
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
              label={dict.slotEnd}
            />
            <Button
              onClick={() =>
                setAvailibilitySlots((slots) =>
                  slots.filter((s) => s.id !== slot.id)
                )
              }
              className="h-[2.75rem] mt-[0.9rem] flex items-center justify-center"
            >
              <div>{dict.removeSlot}</div>
            </Button>
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
          label={dict.slotStart}
        />
        <TextInput
          name={`newSlot-endTime`}
          type="datetime-local"
          className="w-72"
          value={newSlot.endTime}
          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
          label={dict.slotEnd}
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
    </>
  );
}

/**
 * Custom hook that updates the newSlot state to ensure that both startTime and endTime are always present.
 * If only startTime is provided, it calculates the endTime by adding 1 hour to the startTime.
 * If only endTime is provided, it calculates the startTime by subtracting 1 hour from the endTime.
 * @param {TimeSlots[0]} newSlot - The newSlot state object.
 * @param {Dispatch<SetStateAction<TimeSlots[0]>>} setNewSlot - The state setter function for newSlot.
 */
function useCreateOneHourSlot(
  newSlot: TimeSlots[0],
  setNewSlot: Dispatch<SetStateAction<TimeSlots[0]>>
) {
  useEffect(() => {
    if (newSlot.startTime && !newSlot.endTime) {
      const startTime = new Date(newSlot.startTime);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const endTimeFormatted = new Date(
        endTime.getTime() - endTime.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setNewSlot((slot) => ({
        ...slot,
        endTime: endTimeFormatted,
      }));
      return;
    }

    if (newSlot.endTime && !newSlot.startTime) {
      const endTime = new Date(newSlot.endTime);
      const startTime = new Date(endTime.getTime() - 60 * 60 * 1000);

      const startTimeFormatted = new Date(
        startTime.getTime() - startTime.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setNewSlot((slot) => ({
        ...slot,
        startTime: startTimeFormatted,
      }));
      return;
    }
  }, [newSlot.startTime, newSlot.endTime, setNewSlot]);
}

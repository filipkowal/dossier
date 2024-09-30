import { type Dictionary, type TimeSlots } from "@/utils";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import Button from "./Button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TimeSlotInputs({
  dict,
  interviewDuration,
  setAvailabilitySlots,
}: {
  dict: Dictionary["inviteModal"];
  interviewDuration: number;
  setAvailabilitySlots: Dispatch<SetStateAction<TimeSlots>>;
}) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [hasErrors, setHasErrors] = useState(false);

  const addSlot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date) {
      toast.error(dict.noDate);
      return;
    }

    if (!startTime) {
      toast.error(dict.noStartTime);
      return;
    }

    if (!endTime) {
      toast.error(dict.noEndTime);
      return;
    }

    const slot = {
      id: Date.now(),
      date,
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    };

    setAvailabilitySlots((slots) => [...slots, slot]);

    setDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <form
      className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 md:gap-6"
      onSubmit={addSlot}
    >
      <DatePicker
        name="date"
        label={dict.slotDate}
        value={date}
        onChange={(newValue, context) => {
          setDate(newValue);
          if (context.validationError) setHasErrors(true);
          else setHasErrors(false);
        }}
        disablePast
      />
      <TimePicker
        name="startTime"
        label={dict.slotStartTime}
        value={startTime}
        onChange={(newValue, context) => {
          setStartTime(newValue);
          if (context.validationError) setHasErrors(true);
          else setHasErrors(false);
        }}
      />
      <TimePicker
        name="endTime"
        label={dict.slotEndTime}
        value={endTime}
        onChange={(newValue, context) => {
          setEndTime(newValue);
          if (context.validationError) setHasErrors(true);
          else setHasErrors(false);
        }}
        minTime={
          startTime ? startTime.add(interviewDuration, "minute") : undefined
        }
      />
      <Button
        name="Add slot"
        submitType
        className="bg-digitalent-blue text-white disabled:bg-digitalent-blue disabled:text-white hover:disabled:bg-digitalent-blue hover:disabled:text-white h-14 !py-0"
        disabled={!startTime || !endTime || !date || hasErrors}
      >
        {dict.addSlot}
      </Button>
    </form>
  );
}

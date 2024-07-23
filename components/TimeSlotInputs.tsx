import { type Dictionary, type TimeSlots } from "@/utils";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import Button from "./Button";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export default function TimeSlotInputs({
  dict,
  interviewDuration,
  setAvailibilitySlots,
}: {
  dict: Dictionary["inviteModal"];
  interviewDuration: number;
  setAvailibilitySlots: Dispatch<SetStateAction<TimeSlots>>;
}) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

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
      date: date.format("DD.MM.YYYY"),
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    };

    setAvailibilitySlots((slots) => [...slots, slot]);

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
        onChange={(newValue) => setDate(newValue)}
        disablePast
      />
      <TimePicker
        name="startTime"
        label={dict.slotStartTime}
        value={startTime}
        onChange={(newValue) => setStartTime(newValue)}
      />
      <TimePicker
        name="endTime"
        label={dict.slotEndTime}
        value={endTime}
        onChange={(newValue) => setEndTime(newValue)}
        minTime={
          startTime ? startTime.add(interviewDuration, "minute") : undefined
        }
      />
      <Button
        name="Add slot"
        submitType
        className="bg-digitalent-blue text-white disabled:bg-digitalent-blue disabled:text-white hover:disabled:bg-digitalent-blue hover:disabled:text-white h-14 !py-0"
      >
        {dict.addSlot}
      </Button>
    </form>
  );
}

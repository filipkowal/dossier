import { type Dictionary, type TimeSlots } from "@/utils";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import Button from "./Button";
import { Dispatch, SetStateAction, useState } from "react";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) return;

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
      className="flex flex-col sm:flex-row items-center gap-2 md:gap-6"
      onSubmit={handleSubmit}
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
        disabled={!date || !startTime || !endTime}
        className="bg-digitalent-blue text-white disabled:bg-digitalent-blue disabled:text-white hover:disabled:bg-digitalent-blue hover:disabled:text-white"
      >
        {dict.addSlot}
      </Button>
    </form>
  );
}

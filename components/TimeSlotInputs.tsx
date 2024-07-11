import { ChangeEvent } from "react";
import TextInput from "./TextInput";
import type { Dictionary, Locale, TimeSlots } from "@/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

type EventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SetSlotEntry = (
  name: keyof TimeSlots[0],
  index: number
) => (e: EventType) => void;

export default function TimeSlotInputs({
  slot,
  index,
  dict,
  locale,
  setSlotEntry,
}: {
  slot: TimeSlots[number];
  index: number;
  dict: Dictionary["inviteModal"];
  locale: Locale;
  setSlotEntry: SetSlotEntry;
}) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <DatePicker />
        <TextInput
          name={`slot-${index}-date`}
          type="date"
          value={slot.date}
          onChange={setSlotEntry("date", index)}
          label={dict.slotDate}
        />
        <TextInput
          name={`slot-${index}-startTime`}
          type="time"
          value={slot.startTime}
          onChange={setSlotEntry("startTime", index)}
          label={dict.slotStartTime}
        />
        <TextInput
          name={`slot-${index}-endTime`}
          type="time"
          value={slot.endTime}
          onChange={setSlotEntry("endTime", index)}
          label={dict.slotEndTime}
        />
      </LocalizationProvider>
    </>
  );
}

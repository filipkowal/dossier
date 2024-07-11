import { ChangeEvent } from "react";
import TextInput from "./TextInput";
import { type Dictionary, type Locale, type TimeSlots } from "@/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type EventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SetSlotEntry = (
  name: keyof TimeSlots[0],
  index: number
) => (value: string) => void;

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
  const handleChange = (selectedDate: Dayjs | null) => {
    const date = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
    console.log("date", date);

    setSlotEntry("date", index)(date);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <DatePicker
          name={`slot-${index}-date`}
          value={dayjs(slot.date)}
          onChange={handleChange}
          label={dict.slotDate}
        />
        <TimePicker label="Start" />
        <TimePicker label="End" />
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

import { type Dictionary, type Locale, type TimeSlots } from "@/utils";

import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type SetSlotEntry = (
  name: keyof TimeSlots[0],
  index: number
) => (value: string) => void;

export default function TimeSlotInputs({
  slot,
  index,
  dict,
  interviewDuration,
  setSlotEntry,
}: {
  slot: TimeSlots[number];
  index: number;
  dict: Dictionary["inviteModal"];
  interviewDuration: number;
  setSlotEntry: SetSlotEntry;
}) {
  const onDateChange = (selectedDate: Dayjs | null) => {
    const date = selectedDate ? selectedDate.format("DD.MM.YYYY") : "";

    setSlotEntry("date", index)(date);
  };

  const onTimeChange = (
    selectedTime: Dayjs | null,
    key: "startTime" | "endTime"
  ) => {
    const time = selectedTime ? selectedTime.format("HH:mm") : "";

    setSlotEntry(key, index)(time);
  };

  function timeToDayJs(time: string) {
    if (!time) return null;
    return dayjs()
      .hour(Number(time.split(":")[0]))
      .minute(Number(time.split(":")[1]));
  }

  return (
    <>
      <DatePicker
        key={"slot-" + index + "-date"}
        name={`slot-${index}-date`}
        value={dayjs(slot.date)}
        onChange={onDateChange}
        label={dict.slotDate}
        disablePast
      />
      <TimePicker
        key={"slot-" + index + "-startTime"}
        value={timeToDayJs(slot.startTime)}
        onChange={(v) => onTimeChange(v, "startTime")}
        label={dict.slotStartTime}
        name={`slot-${index}-startTime`}
      />
      <TimePicker
        key={"slot-" + index + "-endTime"}
        value={timeToDayJs(slot.endTime)}
        onChange={(v) => onTimeChange(v, "endTime")}
        name={`slot-${index}-endTime`}
        label={dict.slotEndTime}
        minTime={
          timeToDayJs(slot.startTime)?.add(interviewDuration, "minute") ||
          undefined
        }
      />
    </>
  );
}

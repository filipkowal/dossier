import { ChangeEvent } from "react";
import TextInput from "./TextInput";
import type { Dictionary, TimeSlots } from "@/utils";

type EventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type SetSlotEntry = (
  name: keyof TimeSlots[0],
  index: number
) => (e: EventType) => void;

export default function TimeSlotInputs({
  slot,
  index,
  dict,
  setSlotEntry,
}: {
  slot: TimeSlots[number];
  index: number;
  dict: Dictionary["inviteModal"];
  setSlotEntry: SetSlotEntry;
}) {
  return (
    <>
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
    </>
  );
}

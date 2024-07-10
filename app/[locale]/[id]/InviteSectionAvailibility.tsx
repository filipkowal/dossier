import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { type TimeSlots } from "./InviteSection";
import { Dictionary } from "@/utils";
import { TextInput, Button } from "@/components";

export default function AvailibilityStep({
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
  const [showNewSlot, setShowNewSlot] = useState(true);

  const setSlotEntry =
    (name: keyof TimeSlots[0], index: number) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAvailibilitySlots(
        availibilitySlots.map((s, i) =>
          i === index ? { ...s, [name]: e.target.value } : s
        )
      );
    };

  return (
    <>
      <p>
        {dict.slotsDescription[0]} <b>{dict.slotsDescription[1]}</b>.{" "}
        {dict.slotsDescription[2]}
      </p>

      <div className="flex flex-col gap-10">
        {availibilitySlots.map((slot, index) => (
          <div key={slot.id} className="flex flex-col sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-6">
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
            </div>
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
        ))}

        {showNewSlot && (
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-6">
              <TextInput
                name={`newSlot-date`}
                type="date"
                value={newSlot.date || ""}
                onChange={(e) =>
                  setNewSlot((slot) => ({
                    ...slot,
                    date: e.target.value,
                  }))
                }
                label={dict.slotDate}
              />
              <TextInput
                name={`newSlot-startTime`}
                type="time"
                value={newSlot.startTime || ""}
                onChange={(e) =>
                  setNewSlot((slot) => ({
                    ...slot,
                    startTime: e.target.value,
                  }))
                }
                label={dict.slotStartTime}
              />
              <TextInput
                name={`newSlot-endTime`}
                type="time"
                value={newSlot.endTime}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, endTime: e.target.value })
                }
                label={dict.slotEndTime}
              />
            </div>
            {availibilitySlots.length > 0 && (
              <Button
                onClick={() => {
                  setNewSlot((slot) => ({
                    ...slot,
                    date: "",
                    startTime: "",
                    endTime: "",
                  }));
                  setShowNewSlot(false);
                }}
                className="h-[2.75rem] mt-[0.9rem] flex items-center justify-center"
              >
                <div>{dict.removeSlot}</div>
              </Button>
            )}
          </div>
        )}

        <Button
          name="Add new slot"
          onClick={() => {
            if (newSlot.date && newSlot.startTime && newSlot.endTime) {
              setAvailibilitySlots((slots) => [...slots, newSlot]);
              setNewSlot({
                id: newSlot.id + 1,
                date: "",
                startTime: "",
                endTime: "",
              });
            }
            setShowNewSlot(true);
          }}
          disabled={
            (!newSlot.date || !newSlot.startTime || !newSlot.endTime) &&
            showNewSlot
          }
          className="bg-digitalent-blue text-white disabled:bg-digitalent-blue disabled:text-white hover:disabled:bg-digitalent-blue hover:disabled:text-white"
        >
          {dict.addSlot}
        </Button>
      </div>
    </>
  );
}

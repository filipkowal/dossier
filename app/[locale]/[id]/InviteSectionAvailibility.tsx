import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

  function getNewEndTime(slot: TimeSlots[0], newStartTime: string) {
    if (!newStartTime) return "";

    // If there's no endTime, calculate the it by adding 1 hour to the startTime.
    if (!slot.endTime) {
      const endTime = new Date(
        new Date(newStartTime).getTime() + 60 * 60 * 1000
      );

      const newEndTime = formatTimeToInputString(endTime);
      return newEndTime;
    }

    // If the startTime changes, calculate the slot length and update endTime to preserve the length.
    const now = new Date();
    const startDateTime = new Date(newSlot.startDateTime);
    const startTime = now.setTime(startDateTime.getTime());
    const [endHour, endMinute] = newSlot.endTime.split(":");
    const endTime = now.setHours(Number(endHour), Number(endMinute), 0, 0);

    return formatTimeToInputString(
      new Date(new Date(newStartTime).getTime() + (endTime - startTime))
    );

    function formatTimeToInputString(date: Date) {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(11, 16);
    }
  }

  return (
    <>
      <p>
        {dict.slotsDescription[0]} <b>{dict.slotsDescription[1]}</b>.{" "}
        {dict.slotsDescription[2]}
      </p>

      <div className="flex flex-col gap-10">
        {availibilitySlots.map((slot, index) => {
          return (
            <div key={slot.id} className="flex flex-col sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-6">
                <TextInput
                  name={`slot-${index}-startTime`}
                  type="datetime-local"
                  value={slot?.startDateTime || ""}
                  onChange={(e) =>
                    setAvailibilitySlots(
                      availibilitySlots.map((s, i) => {
                        if (i === index) {
                          return {
                            ...s,
                            startDateTime: e.target.value,
                            endTime: getNewEndTime(s, e.target.value),
                          };
                        }
                        return s;
                      })
                    )
                  }
                  label={dict.slotStart}
                />
                <TextInput
                  name={`slot-${index}-endTime`}
                  type="time"
                  disabled={!slot.startDateTime}
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
          );
        })}

        {showNewSlot && (
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-6">
              <TextInput
                name={`newSlot-startTime`}
                type="datetime-local"
                value={newSlot.startDateTime}
                onChange={(e) =>
                  setNewSlot((slot) => ({
                    ...newSlot,
                    startDateTime: e.target.value,
                    endTime: getNewEndTime(slot, e.target.value),
                  }))
                }
                label={dict.slotStart}
              />
              <TextInput
                name={`newSlot-endTime`}
                type="time"
                disabled={!newSlot.startDateTime}
                value={newSlot.endTime}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, endTime: e.target.value })
                }
                label={dict.slotEnd}
              />
            </div>

            {availibilitySlots.length > 0 ? (
              <Button
                onClick={() => {
                  setNewSlot((slot) => ({
                    ...slot,
                    startDateTime: "",
                    endTime: "",
                  }));
                  setShowNewSlot(false);
                }}
                className="h-[2.75rem] mt-[0.9rem] flex items-center justify-center"
              >
                <div>{dict.removeSlot}</div>
              </Button>
            ) : null}
          </div>
        )}

        <Button
          name="Add new slot"
          onClick={() => {
            if (newSlot.startDateTime && newSlot.endTime) {
              setAvailibilitySlots((slots) => [...slots, newSlot]);
            }
            setNewSlot({ id: newSlot.id + 1, startDateTime: "", endTime: "" });
            setShowNewSlot(true);
          }}
          disabled={(!newSlot.startDateTime || !newSlot.endTime) && showNewSlot}
          className="bg-digitalent-blue text-white disabled:bg-digitalent-blue disabled:text-white hover:disabled:bg-digitalent-blue hover:disabled:text-white"
        >
          {dict.addSlot}
        </Button>
      </div>
    </>
  );
}

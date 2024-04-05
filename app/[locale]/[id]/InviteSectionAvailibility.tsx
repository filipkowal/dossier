import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { type TimeSlots } from "./InviteSection";
import { Dictionary } from "@/utils";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";

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

      {showNewSlot && (
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
            onChange={(e) =>
              setNewSlot({ ...newSlot, endTime: e.target.value })
            }
            label={dict.slotEnd}
          />

          {availibilitySlots.length > 0 ? (
            <Button
              onClick={() => {
                setNewSlot((slot) => ({
                  ...slot,
                  startTime: "",
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
          if (newSlot.startTime && newSlot.endTime) {
            setAvailibilitySlots((slots) => [...slots, newSlot]);
          }
          setNewSlot({ id: newSlot.id + 1, startTime: "", endTime: "" });
          setShowNewSlot(true);
        }}
        disabled={(!newSlot.startTime || !newSlot.endTime) && showNewSlot}
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

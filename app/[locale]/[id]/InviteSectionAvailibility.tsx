import { Dispatch, SetStateAction, useState } from "react";
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

  function getNewEndTime(
    newStartTime: string,
    currentStartTime: string,
    currentEndTime: string
  ) {
    if (!newStartTime) return "";

    const [newHours, newMinutes] = newStartTime.split(":");
    const newStartTimeDate = new Date();
    newStartTimeDate.setHours(parseInt(newHours), parseInt(newMinutes), 0, 0);

    let endTime;
    if (currentStartTime && currentEndTime) {
      // Calculate slot length and preserve it
      const [currentStartHours, currentStartMinutes] =
        currentStartTime.split(":");
      const currentStartTimeDate = new Date();
      currentStartTimeDate.setHours(
        parseInt(currentStartHours),
        parseInt(currentStartMinutes),
        0,
        0
      );

      const [currentEndHours, currentEndMinutes] = currentEndTime.split(":");
      const currentEndTimeDate = new Date();
      currentEndTimeDate.setHours(
        parseInt(currentEndHours),
        parseInt(currentEndMinutes),
        0,
        0
      );

      const slotLength =
        currentEndTimeDate.getTime() - currentStartTimeDate.getTime();
      endTime = new Date(newStartTimeDate.getTime() + slotLength);
    } else if (currentEndTime && !currentStartTime) {
      // Preserve current end time if no start time is provided
      return currentEndTime;
    } else {
      // Default to adding 1 hour if no current times are provided
      endTime = new Date(newStartTimeDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    }

    const formattedEndTime = formatTimeToInputString(endTime);

    return formattedEndTime;

    function formatTimeToInputString(date: Date) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  }

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
                onChange={(e) =>
                  setAvailibilitySlots(
                    availibilitySlots.map((s, i) =>
                      i === index ? { ...s, date: e.target.value } : s
                    )
                  )
                }
                label={dict.slotDate}
              />
              <TextInput
                name={`slot-${index}-startTime`}
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  setAvailibilitySlots(
                    availibilitySlots.map((s, i) =>
                      i === index
                        ? {
                            ...s,
                            startTime: e.target.value,
                            endTime: getNewEndTime(
                              e.target.value,
                              slot.startTime,
                              slot.endTime
                            ),
                          }
                        : s
                    )
                  )
                }
                label={dict.slotStartTime}
              />
              <TextInput
                name={`slot-${index}-endTime`}
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  setAvailibilitySlots(
                    availibilitySlots.map((s, i) =>
                      i === index ? { ...s, endTime: e.target.value } : s
                    )
                  )
                }
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
                    endTime: getNewEndTime(
                      e.target.value,
                      slot.startTime,
                      slot.endTime
                    ),
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

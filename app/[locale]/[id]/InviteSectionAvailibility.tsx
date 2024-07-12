import { Dispatch, SetStateAction, useState } from "react";
import type { Dictionary, Locale, TimeSlots } from "@/utils";
import { Button } from "@/components";
import TimeSlotInputs from "@/components/TimeSlotInputs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

export default function AvailibilityStep({
  newSlot,
  setNewSlot,
  availibilitySlots,
  setAvailibilitySlots,
  dict,
  interviewDuration,
}: {
  newSlot: TimeSlots[0];
  setNewSlot: Dispatch<SetStateAction<TimeSlots[0]>>;
  availibilitySlots: TimeSlots;
  setAvailibilitySlots: Dispatch<SetStateAction<TimeSlots>>;
  dict: Dictionary["inviteModal"];
  interviewDuration: number;
}) {
  const [showNewSlot, setShowNewSlot] = useState(true);

  const setSlotEntry =
    (name: keyof TimeSlots[0], index: number) => (value: string) => {
      setAvailibilitySlots(
        availibilitySlots.map((s, i) =>
          i === index ? { ...s, [name]: value } : s
        )
      );
    };

  const setNewSlotEntry =
    (name: keyof TimeSlots[0], index: number) => (value: string) => {
      setNewSlot({ ...newSlot, [name]: value });
    };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de"}>
        <p>
          {dict.slotsDescription[0]} <b>{dict.slotsDescription[1]}</b>.{" "}
          {dict.slotsDescription[2]}
        </p>

        <div className="flex flex-col gap-10">
          {availibilitySlots.map((slot) => (
            <div
              key={slot.id}
              className="border-digitalent-blue border-2 py-2 px-8 flex flex-col sm:flex-row gap-2 lg:gap-6 w-fit sm:w-auto items-center justify-between"
            >
              <span className="w-fit items-center">
                {slot.date + ", " + slot.startTime + " - " + slot.endTime}
              </span>
              <Button
                type="invert"
                onClick={() =>
                  setAvailibilitySlots((slots) =>
                    slots.filter((s) => s.id !== slot.id)
                  )
                }
                className="flex items-center justify-center bg-digitalent-blue"
              >
                <div>{dict.removeSlot}</div>
              </Button>
            </div>
          ))}

          {showNewSlot && (
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 w-fit sm:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                <TimeSlotInputs
                  slot={newSlot}
                  setSlotEntry={setNewSlotEntry}
                  index={availibilitySlots.length}
                  dict={dict}
                  interviewDuration={interviewDuration}
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
                  type="invert"
                  className="flex items-center justify-center bg-digitalent-blue whitespace-nowrap"
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
      </LocalizationProvider>
    </>
  );
}

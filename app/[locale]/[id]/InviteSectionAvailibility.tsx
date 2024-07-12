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
  locale,
}: {
  newSlot: TimeSlots[0];
  setNewSlot: Dispatch<SetStateAction<TimeSlots[0]>>;
  availibilitySlots: TimeSlots;
  setAvailibilitySlots: Dispatch<SetStateAction<TimeSlots>>;
  dict: Dictionary["inviteModal"];
  locale: Locale;
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
          {availibilitySlots.map((slot, index) => (
            <div key={slot.id} className="flex flex-col sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-6">
                <TimeSlotInputs
                  slot={slot}
                  setSlotEntry={setSlotEntry}
                  index={index}
                  dict={dict}
                  locale={locale}
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
                <TimeSlotInputs
                  slot={newSlot}
                  setSlotEntry={setNewSlotEntry}
                  index={availibilitySlots.length}
                  dict={dict}
                  locale={locale}
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
      </LocalizationProvider>
    </>
  );
}

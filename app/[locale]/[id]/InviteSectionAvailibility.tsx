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
            <Button
              name="Add slot"
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
              }}
              disabled={!newSlot.date || !newSlot.startTime || !newSlot.endTime}
              className="bg-digitalent-blue text-white disabled:bg-digitalent-blue disabled:text-white hover:disabled:bg-digitalent-blue hover:disabled:text-white"
            >
              {dict.addSlot}
            </Button>
          </div>

          <p>{dict.slots}:</p>
          <div className="flex gap-2 flex-wrap">
            {availibilitySlots.length > 0 ? (
              availibilitySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="border-digitalent-blue border-2 px-4 py-2 flex gap-4 w-fit items-center rounded-md"
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{slot.date}</span>
                    <span>{slot.startTime + " - " + slot.endTime}</span>
                  </div>
                  <svg
                    className="w-6 h-6 float-right  cursor-pointer"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() =>
                      setAvailibilitySlots((slots) =>
                        slots.filter((s) => s.id !== slot.id)
                      )
                    }
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ))
            ) : (
              <p className="opacity-50">Added slots will appear here</p>
            )}
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}

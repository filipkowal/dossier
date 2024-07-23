import { Dispatch, SetStateAction } from "react";
import type { Dictionary, TimeSlots } from "@/utils";
import TimeSlotInputs from "@/components/TimeSlotInputs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

export default function AvailibilityStep({
  availibilitySlots,
  setAvailibilitySlots,
  dict,
  interviewDuration,
}: {
  availibilitySlots: TimeSlots;
  setAvailibilitySlots: Dispatch<SetStateAction<TimeSlots>>;
  dict: Dictionary["inviteModal"];
  interviewDuration: number;
}) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de"}>
        <p>
          {dict.slotsDescription[0]} <b>{dict.slotsDescription[1]}</b>.{" "}
          {dict.slotsDescription[2]}
        </p>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 w-fit sm:w-auto">
            <TimeSlotInputs
              dict={dict}
              interviewDuration={interviewDuration}
              setAvailibilitySlots={setAvailibilitySlots}
            />
          </div>

          <p>{dict.slots}:</p>
          <div className="flex gap-2 flex-wrap">
            {availibilitySlots.length > 0 ? (
              availibilitySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="border-digitalent-blue border-2 px-4 py-2 flex gap-4 w-fit items-center "
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
              <p className="opacity-50">{dict.slotsPlaceholder}</p>
            )}
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
}

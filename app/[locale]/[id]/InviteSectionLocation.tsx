import { TextInput, Checkbox, NumberInput, Tooltip } from "@/components";
import { Dispatch, SetStateAction } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { type Dictionary } from "@/utils";

export default function LocationStep({
  setIsInterviewOnline,
  interviewLocation,
  setInterviewLocation,
  interviewLink,
  setInterviewLink,
  isInterviewOnline,
  interviewDuration,
  setInterviewDuration,
  dict,
}: {
  setIsInterviewOnline: Dispatch<SetStateAction<boolean>>;
  interviewLocation: string;
  setInterviewLocation: Dispatch<SetStateAction<string>>;
  interviewLink: string;
  setInterviewLink: Dispatch<SetStateAction<string>>;
  isInterviewOnline: any;
  interviewDuration: number;
  setInterviewDuration: Dispatch<SetStateAction<number>>;
  dict: Dictionary["inviteModal"];
}) {
  return (
    <>
      <div className="flex gap-6 -mb-2">
        <Checkbox
          name="interviewType"
          value="online"
          checked={isInterviewOnline === true}
          required
          onChange={() => {
            setIsInterviewOnline(true);
          }}
        >
          {dict.online}
        </Checkbox>
        <Checkbox
          name="interviewType"
          value="inPerson"
          checked={isInterviewOnline === false}
          onChange={() => {
            setIsInterviewOnline(false);
          }}
        >
          {dict.inPerson}
        </Checkbox>
      </div>

      <div className={!isInterviewOnline ? "flex" : "hidden"}>
        <TextInput
          name="interviewLocation"
          value={interviewLocation}
          label={dict.address}
          onChange={(e) => setInterviewLocation(e.target.value)}
          className={`max-w-3/4 w-[28rem] mr-4`}
        />
      </div>

      <NumberInput
        name="interviewDuration"
        min={15}
        step={15}
        value={interviewDuration}
        setValue={setInterviewDuration}
        label={dict.duration}
        className="w-[11.58rem]"
      />

      <div className="flex items-center mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 w-6 min-w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
        <span className="ml-2">{dict.calendarUrl}</span>
      </div>
    </>
  );
}

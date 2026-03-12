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
  calendarUrl,
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
  calendarUrl: string;
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
          className={`max-w-3/4 w-md mr-4`}
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

      {calendarUrl ? (
        <div className="flex items-center mt-4">
          <span>
            {dict.calendarUrl["0"]}
            <Tooltip content={calendarUrl} ariaLabel={calendarUrl}>
              {" "}
              <span className="font-bold ml-1">{dict.calendarUrl["1"]}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 mr-1 w-4 min-w-4 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </Tooltip>
            {dict.calendarUrl["2"]}
          </span>
        </div>
      ) : null}
    </>
  );
}

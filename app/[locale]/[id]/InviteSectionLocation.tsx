import { TextInput, Checkbox, NumberInput, Tooltip } from "@/components";
import { Dispatch, SetStateAction } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { type Dictionary } from "@/utils";

export default function LocationStep({
  setIsInterviewOnline,
  interviewLocation,
  setInterviewLocation,
  setInterviewLink,
  isInterviewOnline,
  interviewDuration,
  setInterviewDuration,
  dict,
}: {
  setStep: Dispatch<SetStateAction<number>>;
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

      <div className={isInterviewOnline ? "flex items-center" : "hidden"}>
        <TextInput
          name="interviewLink"
          label={dict.meetingLink}
          onChange={(e) => setInterviewLink(e.target.value)}
          className="max-w-3/4 w-[28rem] mr-4"
        />
        <div className="relative">
          <Tooltip
            content="We will provide the link later unless you add it here."
            ariaLabel="We will provide the link later unless you add it here."
          >
            <InformationCircleIcon width={24} />
          </Tooltip>
        </div>
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
    </>
  );
}

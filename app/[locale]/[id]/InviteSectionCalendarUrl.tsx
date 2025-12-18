import { type Dictionary } from "@/utils";
import { Dispatch, SetStateAction } from "react";

export default function InviteSectionCalendarUrl({
  dict,
  calendarUrl,
  setCalendarUrl,
}: {
  dict: Dictionary["inviteModal"];
  calendarUrl: string;
  setCalendarUrl: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div>
      <p>{dict.calendarUrl}</p>
      <input
        type="text"
        value={calendarUrl}
        // onChange={(e) => setCalendarUrl(e.target.value)}
        className="w-full"
        placeholder="https://calendly.com/123"
        disabled={true}
      />
    </div>
  );
}

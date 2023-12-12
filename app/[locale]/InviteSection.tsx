"use client";
import TextInput from "@/components/TextInput";
import Dialog from "@/components/Dialog";
import { useState } from "react";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

export default function InviteSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInterviewOnline, setIsInterviewOnline] = useState(true);

  return (
    <>
      <Button
        type="primary"
        name="Invite"
        className="w-1/3 xl:w-1/4 max-w-[32rem]"
        onClick={() => setIsOpen(true)}
      >
        Invite to an interview
      </Button>
      <Dialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Interview Details"
        footer={
          <div className="w-full flex justify-end">
            <Button
              type="primary"
              name="Invite"
              onClick={() => setIsOpen(false)}
            >
              Next
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-6" method="dialog">
          <span className="text-xl">Location</span>
          <div className="flex gap-6">
            <Checkbox
              name="interviewType"
              value="online"
              checked={isInterviewOnline}
              required
              onChange={() => setIsInterviewOnline(true)}
            >
              Online
            </Checkbox>
            <Checkbox
              name="interviewType"
              value="inPerson"
              checked={!isInterviewOnline}
              onChange={() => setIsInterviewOnline(false)}
            >
              In person
            </Checkbox>
          </div>
          <TextInput
            name="location"
            label={
              isInterviewOnline
                ? "Link to the meeting online"
                : "Address of the interview meeting"
            }
          ></TextInput>
          <TextInput
            name="location"
            label="(Optional) Link to your availibility calendar"
          ></TextInput>
        </form>
      </Dialog>
    </>
  );
}

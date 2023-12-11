"use client";
import TextInput from "@/components/TextInput";
import Dialog from "@/components/Dialog";
import { useState } from "react";
import Button from "@/components/Button";

export default function InviteSection() {
  const [isOpen, setIsOpen] = useState(false);

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
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <h1 className="text-3xl uppercase font-title">Interview Details</h1>
        <form className="flex flex-col gap-6" method="dialog">
          <label>
            <span className="text-xl">Location</span>
            <TextInput
              name="location"
              label="Address of the interview meeting"
              autofocus
            ></TextInput>
          </label>
        </form>
      </Dialog>
    </>
  );
}

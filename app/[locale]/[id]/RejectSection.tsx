"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import TextInput from "@/components/TextInput";
import { Dictionary } from "@/utils/server";
import { useState } from "react";

export default function RejectSection({
  dict,
}: {
  dict: Dictionary["rejectModal"] & Dictionary["mainButtons"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const reasons = ["Reason 1", "Reason 2", "Reason 3"]; // List of reasons

  return (
    <>
      <Button
        name="Reject"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-1/3 xl:w-1/4 max-w-[32rem] text-white bg-digitalent-blue"
      >
        <span className="hidden sm:block">{dict.notInterested}</span>
        <span className="sm:hidden">{dict.reject}</span>
      </Button>

      <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title={dict.title}>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();

            // Send the form data to the server
            console.log({ reason, message });
            setIsOpen(false);
          }}
        >
          <p>{dict.reason}</p>
          <select
            value={reason}
            required
            onChange={(e) => setReason(e.target.value)}
            className="bg-transparent border-2 border-digitalent-blue text-digitalent-blue px-4 -mx-[0.1rem] focus:outline-none focus:ring-2 focus:ring-digitalent-blue focus:border-transparent    "
          >
            <option value="">Select a reason</option>
            {reasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>

          <TextInput
            label={dict.message}
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button type="primary" name="Reject" submitType>
            {dict.send}
          </Button>
        </form>
      </Dialog>
    </>
  );
}
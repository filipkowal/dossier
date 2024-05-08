"use client";

import { Button, Dialog, TextInput } from "@/components";
import { Dictionary, RelationshipManager } from "@/utils";
import Image from "next/image";
import { useState } from "react";

export default function ContactSection({
  dict,
  relationshipManager,
}: {
  dict: Dictionary["mainButtons"] & Dictionary["contactModal"];
  relationshipManager: RelationshipManager;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <Button
        name="Contact"
        className="sm:w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light hidden sm:block  disabled:hover:bg-digitalent-gray-light"
        onClick={() => setIsOpen(true)}
      >
        {dict.contactDigitalent}
      </Button>
      <Dialog
        title={dict.contactDigitalent}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        footer={
          <Button name="Send" disabled={!message}>
            {dict.send}
          </Button>
        }
      >
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {relationshipManager?.photo ? (
                <Image
                  src={relationshipManager.photo}
                  alt="avatar"
                  className="h-24 w-24 rounded-full"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-digitalent-yellow" />
              )}
              <div className="flex">
                <div className="flex flex-col">
                  <h2 className="text-xl font-title">
                    {relationshipManager?.name}
                  </h2>
                  <h2 className="text-xl">{relationshipManager.phoneNumber}</h2>
                </div>
                <h2 className="text-xl font-light">{dict.position}</h2>
              </div>
            </div>

            <TextInput
              label={dict.messageLabel}
              name="message"
              type="textarea"
              required
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}

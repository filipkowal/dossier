"use client";

import { Button, Dialog, TextInput } from "@/components";
import { Dictionary, RelationshipManager, contactDigitalent } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactSection({
  dict,
  relationshipManager,
  id,
}: {
  dict: Dictionary["mainButtons"] &
    Dictionary["contactModal"] &
    Dictionary["toastMessages"];
  relationshipManager: RelationshipManager;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const Avatar = ({ size }: { size: string }) =>
    relationshipManager?.photo ? (
      <Image
        src={relationshipManager.photo}
        alt="avatar"
        className={`h-${size} w-${size} rounded-full`}
      />
    ) : null;

  return (
    <>
      <Button
        name="Contact"
        className="sm:w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light hidden sm:block  disabled:hover:bg-digitalent-gray-light"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex gap-4 w-full justify-center">
          <Avatar size="6" />
          {dict.contactDigitalent}
        </span>
      </Button>

      <Dialog
        title={dict.contactDigitalent}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        footer={
          <Button
            name="Send"
            disabled={!message}
            submitType
            type="primary"
            onClick={async () => {
              if (!message) return;

              try {
                await contactDigitalent(id, message);
                // @fixme
                toast.success("Message sent");
              } catch (error) {
                toast.error(dict.somethingWrong);
              }
            }}
          >
            {dict.send}
          </Button>
        }
      >
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <Avatar size="24" />

              <div className="flex gap-2 flex-col md:flex-row">
                <div className="flex flex-col">
                  <h2 className="text-xl font-title">
                    {relationshipManager?.name}
                  </h2>
                  <h2 className="text-xl">{relationshipManager.phoneNumber}</h2>
                </div>

                <h2 className="hidden md:block">•</h2>

                <h2 className="text-xl font-light">{dict.position}</h2>
              </div>
            </div>

            <TextInput
              label={dict.messageLabel}
              name="message"
              type="textarea"
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}

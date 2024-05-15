"use client";

import { Button, Dialog, TextInput } from "@/components";
import { Dictionary, RelationshipManager, contactDigitalent } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import ChatIcon from "@/public/chat.png";

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

  const RelationshipManagerCard = () => (
    <div className="flex gap-4 items-center bg-digitalent-blue text-white p-6">
      {relationshipManager?.photo ? (
        <Image
          src={relationshipManager.photo}
          alt="avatar"
          className={`h-20 w-20 rounded-full`}
        />
      ) : (
        <div className={`bg-digitalent-yellow h-20 w-20 rounded-full`} />
      )}

      <div className="flex gap-2 flex-col md:flex-row">
        <div className="flex flex-col">
          <h2 className="text-xl font-title">{relationshipManager?.name}</h2>
          <h2 className="text-xl">{relationshipManager.phoneNumber}</h2>
        </div>

        <h2 className="hidden md:block">•</h2>

        <h2 className="text-xl font-light">{dict.position}</h2>
      </div>
    </div>
  );

  return (
    <>
      <Button
        name="Contact"
        className="sm:w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light  disabled:hover:bg-digitalent-gray-light"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex gap-4 w-full justify-center">
          {relationshipManager?.photo ? (
            <Image
              src={relationshipManager.photo}
              alt="avatar"
              className={`h-6 w-6 rounded-full hidden sm:block`}
            />
          ) : null}

          <span className="hidden sm:inline"> {dict.contactDigitalent}</span>
          <Image
            alt="contact digitalent"
            className="sm:hidden"
            src={ChatIcon}
          />
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
            <RelationshipManagerCard />

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

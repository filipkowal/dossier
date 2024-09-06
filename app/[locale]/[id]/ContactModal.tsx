"use client";

import { Button, Dialog, TextInput } from "@/components";
import { Dictionary, sendMessage } from "@/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SuccessIcon from "@/public/success.webp";
import Image from "next/image";

export default function ContactModal({
  dict,
  id,
  isOpen,
  setIsOpen,
  relationshipManagerCard,
  isSuccessDialogOpen,
  setIsSuccessDialogOpen,
}: {
  dict: Dictionary["mainButtons"] &
    Dictionary["contactModal"] &
    Dictionary["toastMessages"];
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relationshipManagerCard?: JSX.Element;
  isSuccessDialogOpen: boolean;
  setIsSuccessDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <Dialog
        title={dict.contactDigitalent}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              setIsSending(true);

              const formData = new FormData(e.currentTarget);
              const message = formData.get("message");

              if (typeof message !== "string") {
                throw new Error();
              }

              await sendMessage(id, message);
              setIsOpen(false);
              setIsSuccessDialogOpen(true);
            } catch (error) {
              toast.error(dict.somethingWrong);
            } finally {
              setIsSending(false);
            }
          }}
        >
          <div className="flex flex-col gap-4">
            {relationshipManagerCard}

            <TextInput
              label={dict.messageLabel}
              name="message"
              type="textarea"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button
            name="Send"
            submitType
            type="primary"
            className="mt-4 w-full"
            disabled={isSending || !message}
          >
            {dict.send}
          </Button>
        </form>
      </Dialog>
      <Dialog isOpen={isSuccessDialogOpen} setIsOpen={setIsSuccessDialogOpen}>
        <div className="flex justify-center">
          <Image src={SuccessIcon} alt="Success Icon" width={80} height={80} />
        </div>
        <h1>{dict["success"]}</h1>
      </Dialog>
    </>
  );
}

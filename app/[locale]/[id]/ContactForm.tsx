"use client";

import { Button, TextInput } from "@/components";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { Dictionary, RelationshipManager, sendMessage } from "@/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import sampleAvatar from "@/public/sampleAvatar.webp";
import LoadingEllipsis from "@/components/LoadingEllipsis";

export default function ContactForm({
  dict,
  id,
  incrStep,
  relationshipManager,
}: {
  dict: Dictionary["contactModal"] & Dictionary["toastMessages"];
  id: string;
  incrStep: () => void;
  relationshipManager?: RelationshipManager;
}) {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  const RelationshipManagerCard = () => (
    <div className="flex gap-4 items-center bg-digitalent-blue text-white p-6">
      <ImageWithPlaceholder
        src={relationshipManager?.photo}
        loadingPlaceholder={sampleAvatar}
      />

      <div className="flex gap-2 flex-col md:flex-row">
        <div className="flex flex-col">
          <h2 className="text-xl font-title">{relationshipManager?.name}</h2>
          <h2 className="text-xl">{relationshipManager?.phoneNumber}</h2>
        </div>

        <h2 className="hidden md:block">•</h2>

        <h2 className="text-xl font-light">Relationship Manager</h2>
      </div>
    </div>
  );

  return (
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

          incrStep();
        } catch (error) {
          toast.error(dict.somethingWrong);
        } finally {
          setIsSending(false);
        }
      }}
    >
      <div className="flex flex-col gap-4">
        {relationshipManager && <RelationshipManagerCard />}

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
        <LoadingEllipsis isLoading={isSending} />
      </Button>
    </form>
  );
}

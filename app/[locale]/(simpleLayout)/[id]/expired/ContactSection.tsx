"use client";

import { Button } from "@/components";
import { Dictionary, RelationshipManager } from "@/utils";
import { useState } from "react";
import ContactModal from "../../../[id]/ContactModal";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import sampleAvatar from "@/public/sampleAvatar.webp";

export default function ContactSection({
  dict,
  relationshipManager,
  id,
}: {
  dict: Dictionary["mainButtons"] &
    Dictionary["contactModal"] &
    Dictionary["toastMessages"];
  relationshipManager?: RelationshipManager;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const RelationshipManagerCard = (
    <div className="flex gap-4 items-center bg-digitalent-blue text-white p-6">
      <ImageWithPlaceholder
        src={relationshipManager?.photo}
        alt="avatar"
        loadingPlaceholder={sampleAvatar}
      />

      <div className="flex gap-2 flex-col md:flex-row">
        <div className="flex flex-col">
          <h2 className="text-xl font-title">{relationshipManager?.name}</h2>
          <h2 className="text-xl">{relationshipManager?.phoneNumber}</h2>
        </div>

        <h2 className="hidden md:block">•</h2>

        <h2 className="text-xl font-light">{dict.position}</h2>
      </div>
    </div>
  );

  return (
    <>
      <Button name="Contact" className="mt-6" onClick={() => setIsOpen(true)}>
        {dict.contactDigitalent}
      </Button>

      <ContactModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        relationshipManagerCard={RelationshipManagerCard}
        dict={dict}
        id={id}
        isSuccessDialogOpen={isSuccessDialogOpen}
        setIsSuccessDialogOpen={setIsSuccessDialogOpen}
      />
    </>
  );
}

"use client";

import { Button } from "@/components";
import { Dictionary, RelationshipManager } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import ContactModal from "../../../[id]/ContactModal";

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

  const RelationshipManagerCard = (
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
      <Button name="Contact" className="mt-6" onClick={() => setIsOpen(true)}>
        {dict.contactDigitalent}
      </Button>

      <ContactModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        relationshipManagerCard={RelationshipManagerCard}
        dict={dict}
        id={id}
      />
    </>
  );
}

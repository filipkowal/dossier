"use client";

import { Button } from "@/components";
import { Dictionary, RelationshipManager, fetchImage } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import ChatIcon from "@/public/chat.png";
import ContactModal from "./ContactModal";
import sampleAvatar from "@/public/sampleAvatar.webp";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";

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
      <Button
        name="Contact"
        className="sm:w-1/3 xl:w-1/4 max-w-[32rem] bg-digitalent-gray-light  disabled:hover:bg-digitalent-gray-light"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex gap-4 w-full justify-center">
          <span className="hidden sm:inline"> {dict.contactDigitalent}</span>
          <Image
            alt="contact digitalent"
            className="sm:hidden"
            src={ChatIcon}
            width={24}
            height={24}
          />
        </span>
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

"use client";

import { Button } from "@/components";
import { Dictionary, RelationshipManager } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import ChatIcon from "@/public/chat.png";
import ContactModal from "./ContactModal";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import ImageAuthorized from "@/components/ImageAuthorized";

export default function ContactSection({
  dict,
  relationshipManager,
  id,
  cookie,
}: {
  dict: Dictionary["mainButtons"] &
    Dictionary["contactModal"] &
    Dictionary["toastMessages"];
  relationshipManager?: RelationshipManager;
  id: string;
  cookie: string | RequestCookie | undefined;
}) {
  console.log("contact section cookie for images: ", cookie);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const RelationshipManagerCard = (
    <div className="flex gap-4 items-center bg-digitalent-blue text-white p-6">
      {relationshipManager?.photo ? (
        <ImageAuthorized
          src={relationshipManager.photo}
          alt="avatar"
          className={`h-20 w-20 rounded-full object-cover`}
          width={80}
          height={80}
          cookie={cookie}
        />
      ) : (
        <div className={`bg-digitalent-yellow h-20 w-20 rounded-full`} />
      )}

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
          {relationshipManager?.photo ? (
            <ImageAuthorized
              src={relationshipManager.photo}
              alt="avatar"
              className={`h-6 w-6 rounded-full hidden sm:block object-cover`}
              width={24}
              height={24}
              cookie={cookie}
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

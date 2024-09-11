"use client";

import { Button, Dialog } from "@/components";
import { Dictionary, RelationshipManager, useDialog, useSteps } from "@/utils";
import Image from "next/image";
import ChatIcon from "@/public/chat.png";
import ContactForm from "./ContactForm";
import SuccessIcon from "@/public/success.webp";

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
  const stepNames = ["form", "success"] as const;

  const { isOpen, setIsOpen } = useDialog("contact");
  const { currentStepName, incrStep, decrStep } = useSteps(stepNames);

  const steps = {
    form: (
      <ContactForm
        dict={dict}
        id={id}
        relationshipManager={relationshipManager}
        incrStep={incrStep}
      />
    ),
    success: (
      <>
        <div className="flex justify-center">
          <Image src={SuccessIcon} alt="Success Icon" width={80} height={80} />
        </div>
        <h1>{dict["success"]}</h1>
      </>
    ),
  };

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
            className="sm:hidden max-w-24"
            src={ChatIcon}
            width={24}
            height={24}
          />
        </span>
      </Button>

      <Dialog
        title={currentStepName === "success" ? "" : dict.contactDigitalent}
        isOpen={isOpen}
        setIsOpen={(v) => {
          setIsOpen(v);
          decrStep();
        }}
      >
        {steps[currentStepName]}
      </Dialog>
    </>
  );
}

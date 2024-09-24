"use client";
import ContactForm from "@/app/[locale]/[id]/ContactForm";
import { Button, Dialog } from "@/components";
import { Dictionary, useDialog, useSteps } from "@/utils";
import Image from "next/image";
import SuccessIcon from "@/public/success.webp";

export default function ContactSection({
  dict,
  id,
}: {
  dict: Dictionary["mainButtons"] &
    Dictionary["contactModal"] &
    Dictionary["toastMessages"];
  id: string;
}) {
  const { isOpen, setIsOpen } = useDialog("contact");

  const stepNames = ["form", "success"] as const;

  const { currentStepName, incrStep, decrStep } = useSteps(stepNames);

  const steps = {
    form: <ContactForm dict={dict} id={id} incrStep={incrStep} />,
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
    <div className="md:min-w-[30rem]">
      <Button
        className="w-full mt-6"
        name={dict.contactDigitalent}
        onClick={() => setIsOpen(true)}
      >
        {dict.contactDigitalent}
      </Button>

      <Dialog
        isOpen={isOpen}
        setIsOpen={(v) => {
          setIsOpen(v);
          decrStep();
        }}
        title={dict.contactDigitalent}
      >
        {steps[currentStepName]}
      </Dialog>
    </div>
  );
}

"use client";
import ContactForm from "@/app/[locale]/[id]/ContactForm";
import { Button, Dialog } from "@/components";
import { Dictionary, useDialog } from "@/utils";

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
        setIsOpen={setIsOpen}
        title={dict.contactDigitalent}
      >
        <ContactForm dict={dict} id={id} incrStep={() => setIsOpen(false)} />
      </Dialog>
    </div>
  );
}

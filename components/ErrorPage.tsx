"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Locale } from "@/i18n-config";
import { getDictionary, useDialog } from "@/utils";
import Dialog from "./Dialog";
import ContactForm from "@/app/[locale]/[id]/ContactForm";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ErrorPage({
  error,
  locale,
}: {
  error?: Error;
  locale: Locale;
}) {
  const [dict, setDict] = useState({
    refreshPage: "Refresh the page",
    somethingWrong: "Something went wrong!",
    notFound: "Something’s wrong here. We couldn’t find a page for this link.",
    inviteToInterview: "Invite to an interview",
    notInterested: "Do not invite and reject",
    downloadAsPDF: "Download as PDF",
    reject: "Reject",
    invite: "Invite",
    contactDigitalent: "Contact Digitalent",
    contactDT: "Contact DT",
    noSlots: "Please add at least one availability time slot.",
    copied: "Copied to clipboard",
    messageLabel: "How can we help you?",
    messagePlaceholder:
      "Your questions or feedback regarding the candidate or any other case.",
    send: "Send",
    success:
      "Message sent successfully. We will get back to you as soon as possible.",
    close: "Close",
  });
  const { isOpen, setIsOpen } = useDialog("contact");
  const params = useParams();

  useEffect(() => {
    async function getDict() {
      console.error(error);
      const d = await getDictionary(locale);
      setDict({
        ...d.utilityPages,
        ...d.mainButtons,
        ...d.contactModal,
        ...d.toastMessages,
      });
    }
    getDict();
  }, [error, locale]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="w-full h-full text-center pt-16 text-digitalent-blue">
      <p className="text-3xl py-32">{dict.somethingWrong}</p>
      <div className="flex flex-col gap-10 items-center justify-center">
        <Button onClick={handleRefresh} name="Refresh" className="w-64">
          {dict.refreshPage}
        </Button>
        <Button name="Contact" onClick={() => setIsOpen(true)} className="w-64">
          {dict.contactDigitalent}
        </Button>
      </div>

      {params?.id && typeof params.id === "string" && (
        <Dialog
          title={dict.contactDigitalent}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <ContactForm
            dict={dict}
            id={params.id}
            incrStep={() => {
              toast.success(dict.success);
              setIsOpen(false);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}

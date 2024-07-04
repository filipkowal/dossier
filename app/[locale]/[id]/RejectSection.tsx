"use client";

import { Button, TextInput, Dialog } from "@/components";
import LoadingEllipsis from "@/components/LoadingEllipsis";
import { rejectCandidate } from "@/utils";
import { Dictionary } from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RejectSection({
  dict,
  id,
  candidateGender = "m",
  isRejectButtonVisible,
}: {
  dict: Dictionary["rejectModal"] &
    Dictionary["mainButtons"] &
    Dictionary["toastMessages"];
  id: string;
  isRejectButtonVisible: boolean | undefined;
  candidateGender?: "m" | "f";
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [rejectionPending, setRejectionPending] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const reasons = Object.entries(dict.reasons);

  if (isRejectButtonVisible === false) return null;

  return (
    <>
      <Button
        name="Reject"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-1/3 xl:w-1/4 max-w-[32rem] text-white bg-digitalent-blue"
      >
        <span className="hidden sm:block">{dict.notInterested}</span>
        <span className="sm:hidden">{dict.reject}</span>
      </Button>

      <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title={dict.title}>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setRejectionPending(true);

            try {
              await rejectCandidate(id, reason, message);

              setIsOpen(false);
              setIsSuccessDialogOpen(true);
            } catch (e) {
              toast.error(dict["somethingWrong"]);
            } finally {
              setRejectionPending(false);
            }
          }}
        >
          <p>{dict.reason}</p>
          {/* // Don't autofocus the first input so that on mobile the form is visble workaround */}
          <input
            type="text"
            style={{ position: "absolute", top: "-9999px" }}
            autoFocus
          />
          <select
            value={reason}
            required
            onChange={(e) => setReason(e.target.value)}
            className="bg-transparent border-2 border-digitalent-blue text-digitalent-blue px-4 -mx-[0.1rem] focus:outline-none focus:ring-2 focus:ring-digitalent-blue focus:border-transparent    "
          >
            <option value="">{dict.select} *</option>
            {reasons.map((reason) => (
              <option key={reason[0]} value={reason[0]}>
                {reason[1]}
              </option>
            ))}
          </select>

          <TextInput
            label={dict.message}
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            type="primary"
            name="Reject"
            submitType
            disabled={!reason || rejectionPending}
          >
            {dict.send}
            <LoadingEllipsis isLoading={rejectionPending} />
          </Button>
        </form>
      </Dialog>
      <Dialog
        isOpen={isSuccessDialogOpen}
        title={dict["successTitle"]}
        setIsOpen={(isOpen) => {
          setIsSuccessDialogOpen(isOpen);

          if (!isOpen) router.refresh();
        }}
        footer={
          <Button
            name={dict["close"]}
            onClick={() => setIsSuccessDialogOpen(false)}
          >
            {dict["close"]}
          </Button>
        }
      >
        <div className="w-full flex flex-col gap-6 ">
          <h1>
            {dict["success"][candidateGender === "m" ? "male" : "female"]}
          </h1>
        </div>
      </Dialog>
    </>
  );
}

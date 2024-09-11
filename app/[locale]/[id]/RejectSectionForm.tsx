import { Button, TextInput } from "@/components";
import LoadingEllipsis from "@/components/LoadingEllipsis";
import { Locale } from "@/i18n-config";
import { Dictionary, rejectCandidate } from "@/utils";
import { revalidateMainPathAction } from "@/utils/actions";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RejectSectionForm({
  dict,
  id,
  incrStep,
  setIsOpen,
  locale,
}: {
  dict: Dictionary["rejectModal"] &
    Dictionary["mainButtons"] &
    Dictionary["toastMessages"];
  id: string;
  incrStep: () => void;
  setIsOpen: (value: boolean) => void;
  locale: Locale;
}) {
  const [rejectionPending, setRejectionPending] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const reasons = Object.entries(dict.reasons);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setRejectionPending(true);

        try {
          await rejectCandidate(id, reason, message);

          incrStep();
          revalidateMainPathAction({ locale: locale, id });
        } catch (e) {
          toast.error(dict["somethingWrong"]);
        } finally {
          setRejectionPending(false);
        }
      }}
    >
      <p>{dict.reason}</p>

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
  );
}

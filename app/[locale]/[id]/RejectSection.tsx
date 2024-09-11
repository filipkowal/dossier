"use client";

import { Button, Dialog } from "@/components";
import { Locale, useDialog, useSteps } from "@/utils";
import { Dictionary } from "@/utils";
import RejectSectionForm from "./RejectSectionForm";

export default function RejectSection({
  dict,
  id,
  locale,
  candidateGender = "m",
  isRejectButtonVisible,
}: {
  dict: Dictionary["rejectModal"] &
    Dictionary["mainButtons"] &
    Dictionary["toastMessages"];
  id: string;
  locale: Locale;
  isRejectButtonVisible: boolean | undefined;
  candidateGender?: "m" | "f";
}) {
  const stepNames = ["form", "success"] as const;

  const { isOpen, setIsOpen } = useDialog("reject");
  const { currentStepName, currentStepTitle, incrStep } = useSteps(stepNames);

  const steps = {
    form: (
      <RejectSectionForm
        dict={dict}
        id={id}
        locale={locale}
        incrStep={incrStep}
        setIsOpen={setIsOpen}
      />
    ),
    success: (
      <h1>{dict["success"][candidateGender === "m" ? "male" : "female"]}</h1>
    ),
  };

  return (
    <>
      {isRejectButtonVisible && (
        <Button
          name="Reject"
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-1/3 xl:w-1/4 max-w-[32rem] text-white bg-digitalent-blue"
        >
          <span className="hidden sm:block">{dict.notInterested}</span>
          <span className="sm:hidden">{dict.reject}</span>
        </Button>
      )}

      <Dialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={dict[currentStepTitle]}
      >
        {steps[currentStepName]}
      </Dialog>
    </>
  );
}

import { Dictionary } from "@/utils";
import { Dispatch, SetStateAction } from "react";
import Button from "./Button";
import LoadingEllipsis from "./LoadingEllipsis";

export default function FormFooterButtons({
  step,
  setStep,
  stepsLength,
  dict,
  onSubmit,
  submissionDisabled,
  isPending,
  setIsOpen,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  stepsLength: number;
  dict: Dictionary["inviteModal"];
  onSubmit: () => void;
  submissionDisabled?: boolean;
  isPending: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const isFirstStepOfMany = step === 0 && stepsLength > 2;
  const isFirstAndSubmitStep = step === 0 && stepsLength === 2;
  const isMiddleStep = step > 0 && step < stepsLength - 2;
  const isSubmitStep = step > 0 && step === stepsLength - 2;
  const isSuccessInfoStep = step > 0 && step === stepsLength - 1;

  if (isFirstStepOfMany) {
    return (
      <Button
        type="primary"
        name={dict.next}
        onClick={() => setStep((step: number) => step + 1)}
        disabled={isPending}
      >
        {dict.next}
      </Button>
    );
  }

  if (isFirstAndSubmitStep) {
    return (
      <Button
        type="primary"
        name={dict.send}
        onClick={(e) => {
          e.preventDefault();
          if (submissionDisabled) return;
          onSubmit();
        }}
        disabled={submissionDisabled || isPending}
      >
        {dict.send}
        <LoadingEllipsis isLoading={isPending} />
      </Button>
    );
  }

  if (isMiddleStep) {
    return (
      <div className="w-full flex flex-row justify-between">
        <Button
          type="default"
          name={dict.previous}
          onClick={() => setStep((step: number) => step - 1)}
        >
          {dict.previous}
        </Button>
        <Button
          type="primary"
          name={dict.next}
          onClick={() => setStep((step: number) => step + 1)}
        >
          {dict.next}
        </Button>
      </div>
    );
  }

  if (isSubmitStep) {
    return (
      <div className="w-full flex flex-row justify-between">
        <Button
          type="default"
          name={dict.previous}
          onClick={() => setStep((step: number) => step - 1)}
        >
          {dict.previous}
        </Button>
        <Button
          type="primary"
          name={dict.send}
          onClick={(e) => {
            e.preventDefault();
            if (submissionDisabled) return;
            onSubmit();
          }}
          disabled={submissionDisabled || isPending}
        >
          {dict.send}
          <LoadingEllipsis isLoading={isPending} />
        </Button>
      </div>
    );
  }

  if (isSuccessInfoStep) {
    return (
      <div className="w-full flex justify-end">
        <Button
          name={dict.close}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        >
          {dict.close}
        </Button>
      </div>
    );
  }
}

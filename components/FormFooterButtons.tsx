import { Dictionary } from "@/utils/server";
import { Dispatch, SetStateAction } from "react";
import Button from "./Button";

export default function FormFooterButtons({
  step,
  setStep,
  stepsLength,
  dict,
  onSubmit,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  stepsLength: number;
  dict: Dictionary["inviteModal"];
  onSubmit: () => void;
}) {
  if (step === 0 && stepsLength > 1) {
    return (
      <Button
        type="primary"
        name={dict.next}
        onClick={() => setStep((step: number) => step + 1)}
      >
        {dict.next}
      </Button>
    );
  }

  if (step === 0 && stepsLength === 1) {
    return (
      <Button type="primary" name={dict.send} onClick={() => onSubmit()}>
        {dict.send}
      </Button>
    );
  }

  if (step > 0 && step < stepsLength - 1) {
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

  if (step > 0 && step === stepsLength - 1) {
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
            onSubmit();
          }}
        >
          {dict.send}
        </Button>
      </div>
    );
  }
}

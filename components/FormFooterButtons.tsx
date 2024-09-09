import { Dictionary } from "@/utils";
import Button from "./Button";
import LoadingEllipsis from "./LoadingEllipsis";

export default function FormFooterButtons({
  currentStepName,
  incrStep,
  decrStep,
  steps,
  dict,
  onSubmit,
  submissionDisabled,
  isPending,
  setIsOpen,
}: {
  currentStepName: string;
  incrStep: () => void;
  decrStep: () => void;
  steps: string[];
  dict: Dictionary["inviteModal"];
  onSubmit: () => void;
  submissionDisabled?: boolean;
  isPending: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const i = steps.indexOf(currentStepName);

  const isFirstStepOfMany = i === 0 && steps.length > 2;
  const isFirstAndSubmitStep = i === 0 && steps.length === 2;
  const isMiddleStep = i > 0 && i < steps.length - 2;
  const isSubmitStep = i > 0 && i === steps.length - 2;
  const isSuccessInfoStep = i > 0 && i === steps.length - 1;

  if (isFirstStepOfMany) {
    return (
      <Button
        type="primary"
        name={dict.next}
        onClick={() => incrStep()}
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
        <Button type="default" name={dict.previous} onClick={() => decrStep()}>
          {dict.previous}
        </Button>
        <Button type="primary" name={dict.next} onClick={() => incrStep()}>
          {dict.next}
        </Button>
      </div>
    );
  }

  if (isSubmitStep) {
    return (
      <div className="w-full flex flex-row justify-between">
        <Button type="default" name={dict.previous} onClick={() => decrStep()}>
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

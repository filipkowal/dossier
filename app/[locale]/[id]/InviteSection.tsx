"use client";
import { useDialog, useInviteForm, useSteps } from "@/utils";
import type { Dictionary, User, Locale, SearchParams } from "@/utils";
import { FormFooterButtons, Dialog, Button } from "@/components";
import toast from "react-hot-toast";
import AvailibilityStep from "./InviteSectionAvailibility";
import LocationStep from "./InviteSectionLocation";
import SuccessStep from "./InviteSectionSuccess";

export default function InviteSection({
  dict,
  user,
  params,
  candidateGender = "m",
}: {
  dict: Dictionary["inviteModal"] &
    Dictionary["mainButtons"] &
    Dictionary["toastMessages"];
  user: User;
  params: { locale: Locale; id: string };
  searchParams?: SearchParams;
  candidateGender?: "m" | "f";
}) {
  const { locale, id } = params;

  const {
    isInterviewOnline,
    setIsInterviewOnline,
    interviewLocation,
    setInterviewLocation,
    interviewLink,
    setInterviewLink,
    availibilitySlots,
    setAvailibilitySlots,
    interviewDuration,
    setInterviewDuration,
    invitePending,
    successMessage,
    showNoForm,
    resetInviteData,
    getFormValues,
    steps,
    onSubmit,
  } = useInviteForm({ user, locale, id, dict });

  const { isOpen, setIsOpen } = useDialog("invite");
  const { currentStepName, incrStep, decrStep } = useSteps(steps);

  const stepComponents = {
    location: (
      <LocationStep
        key="location"
        setIsInterviewOnline={setIsInterviewOnline}
        interviewLocation={interviewLocation}
        setInterviewLocation={setInterviewLocation}
        interviewLink={interviewLink}
        setInterviewLink={setInterviewLink}
        isInterviewOnline={isInterviewOnline}
        interviewDuration={interviewDuration}
        setInterviewDuration={setInterviewDuration}
        dict={dict}
      />
    ),
    availibility: (
      <AvailibilityStep
        key={"availibility"}
        availibilitySlots={availibilitySlots}
        setAvailibilitySlots={setAvailibilitySlots}
        dict={dict}
        interviewDuration={interviewDuration}
        resetData={resetInviteData}
      />
    ),
    success: (
      <SuccessStep
        key="success"
        dict={dict}
        candidateGender={candidateGender}
        successMessage={successMessage}
      />
    ),
  };

  return (
    <>
      {user?.isInviteButtonVisible && (
        <Button
          type="primary"
          name={dict.inviteToInterview}
          className="w-full sm:w-1/3 xl:w-1/4 max-w-[32rem]"
          onClick={async () => {
            if (showNoForm) {
              onSubmit({ setIsOpen, incrStep });
              return;
            }

            setIsOpen(true);
          }}
        >
          <span className="hidden sm:block">{dict.inviteToInterview}</span>
          <span className="sm:hidden">{dict.invite}</span>
        </Button>
      )}

      <Dialog
        isOpen={isOpen}
        setIsOpen={(isOpen) => {
          setIsOpen(isOpen);

          if (isOpen === false) {
            resetInviteData();
          }
        }}
        title={dict.availabilityStepTitle}
        footer={
          <FormFooterButtons
            currentStepName={currentStepName}
            incrStep={incrStep}
            decrStep={decrStep}
            steps={steps}
            dict={dict}
            isPending={invitePending}
            setIsOpen={setIsOpen}
            onSubmit={async () => {
              if (availibilitySlots.length < 1) {
                toast.error(dict["noSlots"]);
                return;
              }

              onSubmit({
                formValues: getFormValues(),
                setIsOpen,
                incrStep,
              });
            }}
          />
        }
      >
        {stepComponents[currentStepName as keyof typeof stepComponents]}
      </Dialog>
    </>
  );
}

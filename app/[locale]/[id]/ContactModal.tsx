import { Button, Dialog, TextInput } from "@/components";
import { Dictionary, sendMessage } from "@/utils";
import React from "react";
import toast from "react-hot-toast";

export default function ContactModal({
  dict,
  id,
  isOpen,
  setIsOpen,
  relationshipManagerCard,
  isSuccessDialogOpen,
  setIsSuccessDialogOpen,
}: {
  dict: Dictionary["mainButtons"] &
    Dictionary["contactModal"] &
    Dictionary["toastMessages"];
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relationshipManagerCard?: JSX.Element;
  isSuccessDialogOpen: boolean;
  setIsSuccessDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <Dialog
        title={dict.contactDigitalent}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const formData = new FormData(e.currentTarget);
              const message = formData.get("message");

              if (typeof message !== "string") {
                throw new Error();
              }

              await sendMessage(id, message);
              setIsOpen(false);
              setIsSuccessDialogOpen(true);
            } catch (error) {
              toast.error(dict.somethingWrong);
            }
          }}
        >
          <div className="flex flex-col gap-4">
            {relationshipManagerCard}

            <TextInput
              label={dict.messageLabel}
              name="message"
              type="textarea"
              rows={5}
              required
            />
          </div>

          <Button name="Send" submitType type="primary" className="mt-4 w-full">
            {dict.send}
          </Button>
        </form>
      </Dialog>
      <Dialog
        title="Success"
        isOpen={isSuccessDialogOpen}
        setIsOpen={setIsSuccessDialogOpen}
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
          <h1>{dict["success"]}</h1>
        </div>
      </Dialog>
    </>
  );
}

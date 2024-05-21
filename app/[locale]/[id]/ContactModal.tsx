import { Button, Dialog, TextInput } from "@/components";
import { Dictionary, contactDigitalent } from "@/utils";
import toast from "react-hot-toast";

export default function ContactModal({
  dict,
  id,
  isOpen,
  setIsOpen,
  relationshipManagerCard,
}: {
  dict: Dictionary["mainButtons"] &
    Dictionary["contactModal"] &
    Dictionary["toastMessages"];
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relationshipManagerCard?: JSX.Element;
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

              await contactDigitalent(id, message);
              toast.success(dict.success);
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

          <Button name="Send" submitType type="primary" className="t-4">
            {dict.send}
          </Button>
        </form>
      </Dialog>
    </>
  );
}

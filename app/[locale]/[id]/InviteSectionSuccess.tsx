import Image from "next/image";
import SuccessIcon from "/public/success.webp";
import { Dictionary } from "@/utils";

export default function SuccessStep({
  successMessage,
  dict,
  candidateGender,
}: {
  successMessage: string;
  dict: Dictionary["inviteModal"];
  candidateGender: "m" | "f";
}) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <Image
        src={SuccessIcon}
        alt="success"
        width={96}
        height={96}
        unoptimized
      />
      <h1>
        {successMessage
          ? successMessage
          : dict["success"][candidateGender === "m" ? "male" : "female"]}
      </h1>
    </div>
  );
}

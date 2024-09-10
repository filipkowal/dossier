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
    <>
      <div className="w-full justify-center flex">
        <Image
          src={SuccessIcon}
          alt="success"
          width={96}
          height={96}
          unoptimized
        />
      </div>
      <h1 className="mt-4">
        {successMessage
          ? successMessage
          : dict["success"][candidateGender === "m" ? "male" : "female"]}
      </h1>
    </>
  );
}

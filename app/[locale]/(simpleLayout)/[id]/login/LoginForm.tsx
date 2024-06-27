"use client";

import { Button } from "@/components";
import { Dictionary, Locale, logIn, sendCode } from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginForm({
  dict,
  params,
}: {
  dict: Dictionary["loginForm"];
  params: { id: string; locale: Locale };
}) {
  const { id, locale } = params;
  const router = useRouter();

  const [smsCode, setSmsCode] = useState<string>("");

  const handleSmsCodeChange = (value: string) => {
    const updatedSmsCode = value.slice(0, 6); // Ensure max length of 6
    setSmsCode(updatedSmsCode);

    if (updatedSmsCode.length === 6) {
      handleLogIn(updatedSmsCode);
    }
  };

  const handleLogIn = async (code: string) => {
    try {
      await logIn({ id, code });
      router.push(`/${locale}/${id}`);
      router.refresh();
    } catch (e) {
      console.log(e);
      toast.error(dict["authError"]);
    }
  };

  const sendSMSCode = async () => {
    try {
      await sendCode(id);
      toast.success(dict.toastSuccess);
    } catch {
      toast.error(dict.toastError);
    }
  };

  return (
    <div className="fixed z-10 bg-digitalent-gray-light text-digitalent-blue text-left p-12 align-middle shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-auto">
      <div className="text-2xl font-title font-medium uppercase pb-8 flex justify-between">
        <span className="pr-10 max-w-[90%]">{dict.verifyItsYou}</span>
      </div>
      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p>{dict.sendCodeInstruction}</p>
          <Button name="resend" onClick={() => sendSMSCode()}>
            {dict.resendButton}
          </Button>
        </div>

        <div className="flex flex-col ">
          <p>{dict.enterCodeInstruction}</p>

          <div className="flex gap-2 w-full">
            <input
              type="text"
              name="token"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              value={smsCode}
              onChange={(e) => handleSmsCodeChange(e.target.value)}
              className="w-full sm:w-48 ring-2 bg-digitalent-gray-light ring-digitalent-blue border-none mt-4 block h-10 text-xl text-center"
              maxLength={6}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

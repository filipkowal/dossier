"use client";

import { Button } from "@/components";
import { Dictionary, Locale, logIn, sendCode } from "@/utils";
import { useRouter } from "next/navigation";
import { createRef, useEffect, useState } from "react";
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

  const [smsCode, setSmsCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = Array.from({ length: 6 }, () =>
    createRef<HTMLInputElement>()
  );

  function handleSmsCodeChange(index: number, value: string) {
    const updatedSmsCode = [...smsCode];
    updatedSmsCode[index] = value;
    setSmsCode(updatedSmsCode);
    focusNextInput(index, value);
  }

  function focusNextInput(index: number, value: string) {
    if (value === "") return;
    if (index === inputsRef.length - 1) return;

    inputsRef[index + 1]?.current?.focus();
  }

  function focusPrevInput(index: number) {
    if (index === 0) return;

    inputsRef[index - 1]?.current?.focus();
  }

  useEffect(() => {
    const isSmsCodeFilled = smsCode.every((value) => value !== "");

    if (isSmsCodeFilled) {
      handleLogIn();
    }

    async function handleLogIn() {
      const code = smsCode.join("");
      try {
        await logIn({ id, code });

        console.log("LOGGED IN");
        // Wait for the cookie to be set
        router.push(`/${locale}/${id}`);
        console.log("redirected to /" + locale + "/" + id);
        router.refresh();
        console.log("refreshed");

        // silently catch not to notify if the code is correct
      } catch (e) {
        console.log("ERROR: " + e);
      }
    }
  }, [smsCode, id, router, locale]);

  async function sendSMSCode() {
    try {
      await sendCode(id);
      toast.success(dict.toastSuccess);
    } catch {
      toast.error(dict.toastError);
    }
  }

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
            {smsCode.map((digit, index) => (
              <span key={index} className="flex">
                <input
                  key={`digit-${index + 1}`}
                  type="text"
                  name={`digit-${index + 1}`}
                  id={index.toString()}
                  value={digit}
                  onChange={(e) => handleSmsCodeChange(index, e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace") {
                      const target = event.target as HTMLInputElement;
                      handleSmsCodeChange(Number(target.id), "");
                      focusPrevInput(Number(target.id));
                    }
                  }}
                  className="w-8 sm:w-12 ring-2 bg-digitalent-gray-light ring-digitalent-blue border-none mt-4 block h-10 text-xl text-center"
                  maxLength={1}
                  minLength={1}
                  ref={inputsRef[index]}
                />
                {index === 2 && (
                  <span className="text-5xl ml-4 mr-[0.35rem] mt-2">-</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

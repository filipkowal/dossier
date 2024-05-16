"use client";

import { Button } from "@/components";
import { Locale } from "@/i18n-config";
import { logIn, sendCode } from "@/utils";
import { createRef, useEffect, useState } from "react";

export default function LoginForm({ locale }: { locale: Locale }) {
  const [smsCode, setSmsCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = Array.from({ length: 6 }, () =>
    createRef<HTMLInputElement>()
  );

  const handleSmsCodeChange = (index: number, value: string) => {
    const updatedSmsCode = [...smsCode];
    updatedSmsCode[index] = value;

    setSmsCode(updatedSmsCode);
    focusNextInput(index, value);
  };

  function focusNextInput(index: number, value: string) {
    if (value === "") return;
    if (index === inputsRef.length - 1) return;

    inputsRef[index + 1]?.current?.focus();
  }

  function focusPrevInput(index: number) {
    if (index === 0) return;

    inputsRef[index - 1]?.current?.focus();
  }

  const isSmsCodeFilled = smsCode.every((value) => value !== "");

  const handleLogIn = async () => {
    const code = smsCode.join("");
    try {
      await logIn(code);
      // silently catch not to notify if the code is correct
    } catch {}
  };

  useEffect(() => {
    if (isSmsCodeFilled) {
      handleLogIn();
    }
  }, [isSmsCodeFilled]);

  return (
    <div className="fixed bg-digitalent-gray-light text-digitalent-blue text-left p-12 align-middle shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-auto">
      <div className="text-2xl font-title font-medium uppercase pb-8 flex justify-between">
        <span className="pr-10 max-w-[90%]">VERIFY IT'S YOU</span>
      </div>
      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p>Send the code to your phone to verify yourself.</p>
          <Button name="resend" onClick={() => sendCode()}>
            Send SMS With Code
          </Button>
        </div>

        <div className="flex flex-col ">
          <p>Enter the code from SMS</p>

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
                      focusPrevInput(Number(target.id));
                    }
                  }}
                  className="w-12 ring-2 bg-digitalent-gray-light ring-digitalent-blue border-none mt-4 block h-10 text-xl text-center"
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

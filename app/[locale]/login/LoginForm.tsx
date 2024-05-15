"use client";

import { Button, TextInput } from "@/components";
import { Locale } from "@/i18n-config";

export default function LoginForm({ locale }: { locale: Locale }) {
  return (
    <div className="fixed  bg-digitalent-gray-light text-digitalent-blue text-left p-12 align-middle shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="text-2xl font-title font-medium uppercase pb-8 flex justify-between">
        <span className="pr-10 max-w-[90%]">VERIFY IT'S YOU</span>
      </div>
      <form className="flex flex-col gap-4">
        <p>Enter a code that you've received in SMS</p>

        <TextInput
          type="number"
          label="SMS Code"
          name="code"
          onChange={(e) => {
            e.preventDefault();
            console.log(e.target.value);

            if (e.target.value.length < 6) return;

            // @fixme add login fetcher
          }}
        />

        <p>The SMS did not arrive?</p>

        <Button name="resend">Resend SMS With Code</Button>
      </form>
    </div>
  );
}

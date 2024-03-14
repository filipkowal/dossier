"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils";

export default function ErrorPage({
  error,
  locale,
}: {
  error?: Error;
  locale: Locale;
}) {
  const [dict, setDict] = useState({
    refreshPage: "Refresh",
    somethingWrong: "Something went wrong!",
  });

  useEffect(() => {
    async function getDict() {
      console.error(error);
      const d = await getDictionary(locale);
      setDict(d.utilityPages);
    }
    getDict();
  }, [error, locale]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="w-full h-full text-center pt-16 text-digitalent-blue">
      <p className="text-3xl py-32">{dict.somethingWrong}</p>
      <p>{error?.message}</p>
      <Button onClick={handleRefresh} name="Refresh" className="m-12">
        {dict.refreshPage}
      </Button>
    </div>
  );
}

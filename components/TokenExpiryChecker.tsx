"use client";

import { Locale } from "@/i18n-config";
import { Dictionary } from "@/utils";
import { useAutoLogout, useTokenCheck } from "@/utils/hooks";

const TokenExpiryChecker = ({
  params,
  dict,
}: {
  params: { locale: Locale; id: string };
  dict: Dictionary["tokenExpiry"];
}) => {
  const { locale, id } = params;

  useTokenCheck(locale, id, dict);
  // useAutoLogout(locale, id, dict);

  return null;
};

export default TokenExpiryChecker;

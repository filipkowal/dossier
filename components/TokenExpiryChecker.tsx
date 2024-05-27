"use client";

import { Locale } from "@/i18n-config";
import useTokenCheck from "@/utils/hooks";

const TokenExpiryChecker = ({
  params,
}: {
  params: { locale: Locale; id: string };
}) => {
  const { locale, id } = params;

  useTokenCheck(locale, id);

  return null;
};

export default TokenExpiryChecker;

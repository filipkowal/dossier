"use server";

import { Locale } from "@/i18n-config";
import { revalidatePath } from "next/cache";

export const revalidateMainPathAction = async ({
  locale,
  id,
}: {
  locale: Locale;
  id: string;
}) => {
  revalidatePath(`/${locale}/${id}`, "layout");
};

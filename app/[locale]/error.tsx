"use client";
import { ErrorPage } from "@/components";
import { type Locale } from "@/i18n-config";
import { useParams } from "next/navigation";

export default function Error({ error }: { error: Error }) {
  const params = useParams() as { locale: Locale };
  return <ErrorPage error={error} locale={params.locale} />;
}

import { Locale } from "@/i18n-config";
import LoginForm from "./LoginForm";
import SampleDossier from "./SampleDossier";

export default async function LoginPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  return (
    <div>
      <LoginForm locale={params.locale} />
      <SampleDossier />
    </div>
  );
}

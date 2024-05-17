import { Locale } from "@/i18n-config";
import LoginForm from "./LoginForm";
import SampleDossier from "./SampleDossier";
import { getDictionary } from "@/utils";

export default async function LoginPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const dict = await getDictionary(params.locale);
  return (
    <div>
      <LoginForm dict={dict["loginForm"]} />
      <SampleDossier />
    </div>
  );
}

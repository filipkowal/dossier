import { Locale } from "@/i18n-config";
import LoginForm from "./LoginForm";
import { getDictionary } from "@/utils";

export default async function LoginPage({
  params,
}: {
  params: { locale: Locale; id: Locale };
}) {
  const dict = await getDictionary(params.locale);
  return (
    <div>
      <LoginForm dict={dict["loginForm"]} params={params} />
    </div>
  );
}

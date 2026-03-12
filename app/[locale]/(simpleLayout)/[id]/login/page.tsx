import { Locale } from "@/i18n-config";
import LoginForm from "./LoginForm";
import { getDictionary } from "@/utils";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: Locale }>;
}) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.locale);
  return (
    <div>
      <LoginForm dict={dict["loginForm"]} params={resolvedParams} />
    </div>
  );
}

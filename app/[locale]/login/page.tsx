import { Locale } from "@/i18n-config";
import LoginForm from "./LoginForm";

export default function LoginPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  return (
    <div>
      <LoginForm locale={params.locale} />
    </div>
  );
}

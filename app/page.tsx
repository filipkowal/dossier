import { Locale } from "/i18n-config";

export default function Home({ params }: { params: { locale: Locale } }) {
  return (
    <div>
      Dossier <b>{params.locale}</b>
    </div>
  );
}

import { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils";

export default async function Home({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const dictionary = await getDictionary(params.locale);
  const dict = dictionary["dossierExpired"];

  return (
    <div className="w-full h-[97vh] text-center flex flex-col align-center justify-center items-center">
      <h2 className="font-title text-3xl mb-4">{dict["title"]}</h2>
      <p>{dict["message"]}</p>
    </div>
  );
}

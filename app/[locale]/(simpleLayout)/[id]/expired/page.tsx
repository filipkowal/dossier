import { Locale } from "@/i18n-config";
import { getDictionary, getRelationshipManager } from "@/utils";
import { cookies } from "next/headers";

export default async function Home({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const dictionary = await getDictionary(params.locale);
  const dict = dictionary["dossierExpired"];
  const cookieStore = cookies();
  const cookie = cookieStore.get(`token-${params.id}`);

  let relationshipManager;
  try {
    relationshipManager = await getRelationshipManager(
      params.locale,
      params.id,
      cookie
    );
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      <div className="fixed z-10 bg-digitalent-gray-light text-digitalent-blue text-left p-12 align-middle shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-auto">
        <div className="text-2xl font-title font-medium uppercase pb-8 flex justify-between">
          <span className="pr-10 max-w-[90%]">{dict.title}</span>
        </div>{" "}
        <p>{dict["heading"]}</p>
        <p className="pt-4">{dict["message"]}</p>
      </div>
    </div>
  );
}

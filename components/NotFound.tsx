import { Dictionary } from "@/utils";

export default function NotFound({
  dict,
}: {
  dict: Dictionary["utilityPages"]["notFound"];
}) {
  return (
    <div className="w-full h-[97vh] text-center flex flex-col align-center justify-center items-center">
      <h2 className="font-title text-3xl mb-4">{dict}</h2>
    </div>
  );
}

import { Dictionary } from "@/utils";

export default function NotFound({
  dict,
}: {
  dict: Dictionary["utilityPages"]["notFound"];
}) {
  return (
    <div className="w-full h-[97vh] text-center flex flex-col align-center justify-center items-center">
      <h2 className="font-title text-3xl mb-4">{dict["noCandidateId"]}</h2>
      <p>{dict["verify"]}</p>
      <div className="flex gap-2">
        <span>{dict["example"]}</span>
        <pre>
          dossier.digitalent.cloud/de/<b>123</b>
        </pre>
      </div>
    </div>
  );
}

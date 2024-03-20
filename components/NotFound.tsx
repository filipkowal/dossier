export default function NotFound() {
  return (
    <div className="w-full h-[97vh] text-center flex flex-col align-center justify-center items-center">
      <h2 className="font-title text-3xl mb-4">No candidate ID</h2>
      <p>Please verify the URL. It should include the candidate's ID. </p>
      <div className="flex gap-2">
        <span>Example: </span>
        <pre>
          dossier.digitalent.cloud/de/<b>123</b>
        </pre>
      </div>
    </div>
  );
}

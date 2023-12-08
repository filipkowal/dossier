import { Locale } from "@/i18n-config";

export default function Home({ params }: { params: { locale: Locale } }) {
  return (
    <div>
      <div className="w-full h-[100vh]">
        <h1 id="overview" className="mt-12">
          Overview
        </h1>
      </div>
      <h1 id="cvAndCertificates">Cv</h1>
    </div>
  );
}

import { Locale } from "@/i18n-config";
import Image from "next/image";

export default function Home({ params }: { params: { locale: Locale } }) {
  return (
    <div>
      <div className="w-full h-[100vh] grid grid-cols-[minmax(250px,1fr),2fr] pt-16">
        <div className="flex flex-col bg-digitalent-blue text-white py-16 px-32">
          <div className="flex flex-col justify-end min-h-[24vh]">
            <div className="rounded-full w-52 h-52 bg-digitalent-yellow" />
          </div>
          <div className="flex flex-col mt-16">
            <h2 className="text-xl mb-8">Contact Details</h2>
            <p>+48 601 299 200</p>
            <p>filip.kowal@protonmail.com</p>
            <p>linkedin.com/in/filip-kowal-8a4a3767</p>
            <h2 className="text-xl my-8">Personal Details</h2>
            <p>24.09.1992 (31 y/o)</p>
            <p>Wymyślona Street 26, Kraków </p>
            <h2 className="text-xl my-8">Languages</h2>
            <p>English: Fluent - C1</p>
            <p>Polish: Native - C2</p>
            <p>Kx’a: None - A0</p>
            <p>Australian: Native - C2</p>
          </div>
        </div>
        <h1 id="cvAndCertificates">Cv</h1>
      </div>
    </div>
  );
}

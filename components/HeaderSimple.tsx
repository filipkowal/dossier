import Image from "next/image";
import Link from "next/link";
import DigitalentLogo from "@/public/logo.png";
import Thumnbail from "@/public/thumbnail.png";

export default function HeaderSimple({
  params,
  children,
}: {
  params: { locale: string; id: string };
  children?: React.ReactNode;
}) {
  return (
    <header
      id="top"
      className="flex flex-row h-16 bg-digitalent-blue justify-between items-center py-3 px-4 sm:px-8 sm:fixed top-0 z-20 w-full"
    >
      <div>
        <Link href={`/${params?.locale}${params?.id ? "/" + params.id : ""}`}>
          <>
            <Image
              src={DigitalentLogo}
              alt="logo"
              width="70"
              height="42.281"
              className="hidden sm:block"
            />
            <Image
              src={Thumnbail}
              alt="logo"
              width="35"
              height="35"
              className="block sm:hidden"
            />
          </>
        </Link>
      </div>

      {children}
    </header>
  );
}

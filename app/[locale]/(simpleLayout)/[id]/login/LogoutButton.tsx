"use client";

import { logout } from "@/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import LogoutIcon from "@/public/logout.png";
import { redirect } from "next/navigation";

export default function LogoutButton({
  dict,
  params,
}: {
  dict: { logoutError: string; logoutSuccess: string };
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;

  async function logUserOut() {
    try {
      await logout(params.id);
      toast.success(dict.logoutSuccess);
      redirect(`/${locale}/${id}/login`);
    } catch (error) {
      toast.error(dict.logoutError);
    }
  }

  return (
    <div
      className="cursor-pointer"
      title="logout"
      onClick={async () => {
        await logUserOut();
      }}
    >
      <Image src={LogoutIcon} alt="Logout" width={24} height={24} />
    </div>
  );
}

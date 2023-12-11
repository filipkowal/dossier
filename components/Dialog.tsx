"use client";

import { useEffect, useRef } from "react";

export default function Dialog({
  isOpen,
  children,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) ref.current?.showModal();
    else ref.current?.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className="fixed inset-0 z-50 bg-digitalent-gray-light p-10"
    >
      <div onClick={() => setIsOpen?.(false)} className="cursor-pointer">
        X
      </div>
      {children}
    </dialog>
  );
}

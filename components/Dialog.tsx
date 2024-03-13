"use client";

import { JSXElementConstructor, useEffect, useRef } from "react";
import "./Dialog.css";

export default function Dialog({
  isOpen,
  title,
  children,
  footer,
  setIsOpen,
}: {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactElement<any, string | JSXElementConstructor<any>>;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) ref.current?.showModal();
    else ref.current?.close();
  }, [isOpen]);

  function XButton() {
    return (
      <svg
        className="w-6 h-6 float-right -translate-y-1 cursor-pointer"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => setIsOpen(false)}
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <dialog
      ref={ref}
      style={{ overflowY: "auto", maxHeight: "100vh" }}
      className="fixed inset-0 z-50 bg-digitalent-gray-light p-10 transform overflow-hidden text-digitalent-blue px-4 pt-4 pb-7 md:py-10 md:px-16 text-left align-middle shadow-xl transition-all w-[60rem] max-w-full"
    >
      <div className="text-2xl font-title font-medium uppercase pb-8 flex justify-between">
        <span className="pr-10 max-w-[90%]">{title}</span>

        <XButton />
      </div>

      <div className="px-1 -mx-1 sm:mx-0 max-w-full" autoFocus>
        {children}
      </div>

      <div
        className={`w-full flex mt-12 ${
          footer?.props?.children?.length > 1 &&
          Array.isArray(footer?.props?.children)
            ? "justify-between"
            : "justify-end"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {footer}
      </div>
    </dialog>
  );
}

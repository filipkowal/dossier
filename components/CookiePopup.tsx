"use client";

import { useState, useSyncExternalStore } from "react";
import Button from "./Button";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  try {
    return localStorage.getItem("cookieConsent");
  } catch {
    // localStorage unavailable (blocked cookies, sandboxed iframe): consent
    // can't be persisted, so don't show a banner that could never be dismissed
    return "true";
  }
}

function getServerSnapshot() {
  return "true";
}

export default function CookiePopup({
  dict,
}: {
  dict: { title: string; message: string; acceptButton: string };
}) {
  const [dismissed, setDismissed] = useState(false);
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const isOpen = !consent && !dismissed;

  function handleClose() {
    setDismissed(true);
    try {
      localStorage.setItem("cookieConsent", "true");
      window.dispatchEvent(new Event("storage"));
    } catch {
      // write failed (private mode, quota): banner still closes for this session
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 right-0 bg-digitalent-blue shadow-lg z-50 w-72 transition-opacity duration-500`}
    >
      <div className="p-6 pb-0">
        <h2 className="text-lg font-medium text-white mb-2">{dict.title}</h2>
        <p className="text-sm text-white font-light">{dict.message}</p>
      </div>
      <Button
        onClick={handleClose}
        className="m-6 w-[calc(100%-36px)] bg-digitalent-green-light ring-digitalent-green-light hover:ring-digitalent-green-light hover:bg-digitalent-green-light hover:!text-digitalent-blue"
      >
        {dict.acceptButton}
      </Button>
    </div>
  );
}

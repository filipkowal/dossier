"use client";

import { ToastBar, Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{ duration: 7000 }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            background: "var(--digitalent-blue)",
            color: "white",
            padding: "1rem",
            borderRadius: "0",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "20px",
            paddingRight: "20px",
            position: "sticky",
            top: "2rem",
            zIndex: "100",
          }}
        >
          {({ icon, message }) => (
            <>
              {icon}
              {message}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

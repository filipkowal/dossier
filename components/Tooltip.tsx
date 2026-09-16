"use client";

import { useState } from "react";

export default function Tooltip({
  children,
  content,
  ariaLabel,
}: {
  children: React.ReactNode;
  content: string;
  ariaLabel: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>

      <div
        className={`absolute left-1/2 -translate-x-1/2 -z-10 bg-white text-digitalent-blue p-4 opacity-0 transition-all duration-300 pointer-events-none ${
          isVisible ? "opacity-100 z-10! pointer-events-auto" : ""
        }`}
        style={{ top: "calc(100% + 24px)" }}
        aria-label={ariaLabel}
        aria-describedby={isVisible ? "tooltip-content" : ""}
      >
        <div className="relative">
          <div
            style={{
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              width: "max-content",
              maxWidth: "10rem",
            }}
          >
            {content}
          </div>

          {/* arrow */}
          <div
            className="absolute top-[-24px] left-1/2 -translate-x-1/2"
            style={{
              width: "0",
              height: "0",
              border: "solid",
              borderWidth: "0 10px 10px 10px",
              borderColor: "transparent transparent white transparent",
            }}
          />
        </div>
      </div>
    </span>
  );
}

"use client";

import { useRef } from "react";

export default function NumberInput({
  className,
  name,
  label,
  required,
  value,
  disabled,
  onChange,
  autofocus,
  min,
  max,
  step,
  defaultValue,
}: {
  name: string;
  className?: string;
  min?: string;
  max?: string;
  step?: string;
  defaultValue?: number;
  label?: string;
  required?: boolean;
  value?: any;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  autofocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`group relative mb-[0.5rem] ${className}`}>
      <input
        type="number"
        className={`w-full ring-2 bg-digitalent-gray-light text-digitalent-blue 
                    ring-digitalent-blue border-none pl-4 
                      mt-4 block autofill:bg-digitalent-gray-light ${className} 
                      [&:not(:placeholder-shown)+label]:-translate-y-[1.2rem] [&:not(:placeholder-shown)+label]:text-sm
                      [&:not(:placeholder-shown)]:invalid:[&:not(:focus)]:ring-red-500 [&:not(:placeholder-shown)]:invalid:[&:not(:focus)]:ring-offset-red-500`}
        required={required}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        ref={inputRef}
        id={name}
        placeholder=" "
        autoFocus={autofocus}
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
      />

      {typeof label !== "undefined" ? (
        <label
          className={` bg-digitalent-gray-light px-1 absolute left-4 top-6 transition-all ease-out font-light
          group-focus-within:-translate-y-[1.2rem] group-focus-within:text-sm
          max-w-[90%] overflow-hidden overflow-ellipsis whitespace-nowrap`}
          htmlFor={name}
        >
          {label + (required ? " *" : "")}
        </label>
      ) : null}
    </div>
  );
}

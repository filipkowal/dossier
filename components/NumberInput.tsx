"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Button from "./Button";

export default function NumberInput({
  className,
  name,
  label,
  required,
  value = 0,
  disabled,
  setValue,
  autofocus,
  min,
  max,
  step,
}: {
  name: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  required?: boolean;
  value?: number;
  disabled?: boolean;
  setValue: Dispatch<SetStateAction<number>>;
  autofocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);

  // @fixme value is not updated when it is above max
  const setValueRestricted = (v: number) => {
    let newValue = v;
    if (min !== undefined && v < min) newValue = min;
    else if (max !== undefined && v > max) newValue = max;

    setValue(newValue);
  };

  const handleButtonClick = (operation: "add" | "subtract") => {
    let newValue = inputValue;
    if (operation === "add") {
      newValue += step || 1;
    } else if (operation === "subtract") {
      newValue -= step || 1;
    }

    if (min !== undefined && newValue < min) {
      newValue = min;
    } else if (max !== undefined && newValue > max) {
      newValue = max;
    }

    setInputValue(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="flex items-center">
      <div className={`group relative mb-[0.5rem] ${className}`}>
        <input
          type="number"
          className={`ring-2 bg-digitalent-gray-light text-digitalent-blue 
                    ring-digitalent-blue border-none pl-4 
                      mt-4 block autofill:bg-digitalent-gray-light ${className} 
                      [&:not(:placeholder-shown)+label]:-translate-y-[1.2rem] [&:not(:placeholder-shown)+label]:text-sm
                      [&:not(:placeholder-shown)]:invalid:[&:not(:focus)]:ring-red-500 [&:not(:placeholder-shown)]:invalid:[&:not(:focus)]:ring-offset-red-500`}
          required={required}
          name={name}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => setInputValue(Number(e.target.value))}
          onBlur={(e) => {
            setValueRestricted(Number(e.target.value));
          }}
          ref={inputRef}
          id={name}
          placeholder={value ? value.toString() : "0"}
          autoFocus={autofocus}
          min={min}
          max={max}
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

      <Button
        name="-"
        className="h-[2.75rem] mt-2"
        onClick={() => handleButtonClick("subtract")}
      >
        -
      </Button>
      <Button
        name="+"
        className="h-[2.75rem] mt-2 border-l-0"
        onClick={() => handleButtonClick("add")}
      >
        +
      </Button>
    </div>
  );
}

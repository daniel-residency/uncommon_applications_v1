"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-ink font-semibold mb-1.5 lowercase">
            {label}
            {props.required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full border-b border-border bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-mid-gray transition-colors focus:border-ink ${error ? "border-red-400" : ""} ${className}`}
          placeholder={props.placeholder || "type your answer here"}
          {...props}
        />
        {helpText && !error && (
          <p className="mt-1 text-xs text-mid-gray">{helpText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

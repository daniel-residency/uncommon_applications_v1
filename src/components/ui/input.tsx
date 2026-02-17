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
          <label className="block text-base text-ink-dark mb-2 leading-relaxed">
            {label}
            {props.required && <span className="text-stone-dark ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full border-b border-sand bg-transparent py-3 text-lg font-serif text-ink-dark outline-none placeholder:text-stone transition-colors focus:border-ink-dark ${error ? "border-red-400" : ""} ${className}`}
          {...props}
        />
        {helpText && !error && (
          <p className="mt-1 text-xs text-stone-dark">{helpText}</p>
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

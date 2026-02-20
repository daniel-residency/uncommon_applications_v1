"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-ink font-semibold mb-1.5 lowercase">
            {label}
            {props.required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full border border-border rounded-md bg-white/40 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-mid-gray resize-none min-h-[80px] leading-relaxed transition-colors focus:border-ink ${error ? "border-red-400" : ""} ${className}`}
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

Textarea.displayName = "Textarea";
export default Textarea;

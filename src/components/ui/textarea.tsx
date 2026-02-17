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
          <label className="block text-base text-ink-dark mb-2 leading-relaxed">
            {label}
            {props.required && <span className="text-stone-dark ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full border border-sand rounded-sm bg-cream-dark/30 p-4 text-base font-serif text-ink-dark outline-none placeholder:text-stone resize-none min-h-[120px] leading-relaxed transition-colors focus:border-ink-dark ${error ? "border-red-400" : ""} ${className}`}
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

Textarea.displayName = "Textarea";
export default Textarea;

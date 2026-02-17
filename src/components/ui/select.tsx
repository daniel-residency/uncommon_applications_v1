"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-base text-ink-dark mb-2 leading-relaxed">
            {label}
            {props.required && <span className="text-stone-dark ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full border border-sand rounded-sm bg-cream py-3 px-4 text-base font-serif text-ink-dark outline-none transition-colors focus:border-ink-dark appearance-none cursor-pointer ${!props.value ? "text-stone" : ""} ${error ? "border-red-400" : ""} ${className}`}
          {...props}
        >
          <option value="">{placeholder || "Select..."}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;

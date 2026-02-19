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
          <label className="block text-sm text-ink font-semibold mb-1.5 lowercase">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full border border-border rounded-md bg-white/40 py-2.5 px-3.5 text-sm text-ink outline-none transition-colors focus:border-ink appearance-none cursor-pointer ${!props.value ? "text-mid-gray" : ""} ${error ? "border-red-400" : ""} ${className}`}
            {...props}
          >
            <option value="">{placeholder || "select"}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="#8E8EA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;

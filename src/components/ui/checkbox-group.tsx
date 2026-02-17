"use client";

interface CheckboxGroupProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export default function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  required,
  error,
  helpText,
}: CheckboxGroupProps) {
  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-base text-ink-dark mb-3 leading-relaxed">
          {label}
          {required && <span className="text-stone-dark ml-1">*</span>}
        </label>
      )}
      {helpText && (
        <p className="text-xs text-stone-dark mb-3">{helpText}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors ${
              value.includes(opt.value)
                ? "border-ink-dark bg-cream"
                : "border-sand hover:border-stone-dark"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors ${
                value.includes(opt.value)
                  ? "border-ink-dark bg-ink-dark"
                  : "border-sand-dark"
              }`}
            >
              {value.includes(opt.value) && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8l4 4 6-8"
                    stroke="#FFFEF9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-ink-dark">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

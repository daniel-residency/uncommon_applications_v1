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
        <label className="block text-sm text-ink font-semibold mb-1.5 lowercase">
          {label}
        </label>
      )}
      {helpText && (
        <p className="text-xs text-mid-gray mb-2">{helpText}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md border cursor-pointer transition-colors text-sm lowercase text-left ${
              value.includes(opt.value)
                ? "border-ink bg-ink text-white"
                : "border-border hover:border-ink text-ink"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                value.includes(opt.value)
                  ? "border-white bg-white/20"
                  : "border-border"
              }`}
            >
              {value.includes(opt.value) && (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8l4 4 6-8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

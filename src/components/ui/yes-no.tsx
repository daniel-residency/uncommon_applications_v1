"use client";

interface YesNoProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export default function YesNo({ label, value, onChange, required, error }: YesNoProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-ink font-semibold mb-1.5 lowercase">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        {["yes", "no"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-5 py-2 rounded-md border text-sm transition-colors cursor-pointer lowercase ${
              value === opt
                ? "border-ink bg-ink text-white"
                : "border-border text-ink hover:border-ink"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

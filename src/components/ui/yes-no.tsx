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
        <label className="block text-base text-ink-dark mb-3 leading-relaxed">
          {label}
          {required && <span className="text-stone-dark ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-3">
        {["yes", "no"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-6 py-2.5 rounded-sm border text-sm font-serif transition-colors cursor-pointer ${
              value === opt
                ? "border-ink-dark bg-ink-dark text-cream"
                : "border-sand text-ink-dark hover:border-stone-dark"
            }`}
          >
            {opt === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

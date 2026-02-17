"use client";

import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "@/config/countries";

interface CountrySelectorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export default function CountrySelector({
  label,
  value,
  onChange,
  required,
  error,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-base text-ink-dark mb-2 leading-relaxed">
          {label}
          {required && <span className="text-stone-dark ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full border rounded-sm bg-cream py-3 px-4 text-base font-serif text-left outline-none transition-colors cursor-pointer ${
            value ? "text-ink-dark" : "text-stone"
          } ${open ? "border-ink-dark" : "border-sand"} ${error ? "border-red-400" : ""}`}
        >
          {value || "Select country..."}
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-cream border border-sand rounded-sm shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-sand">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full px-3 py-2 text-sm font-serif bg-transparent outline-none text-ink-dark placeholder:text-stone"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-48">
              {filtered.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-serif hover:bg-sand/30 cursor-pointer transition-colors ${
                    value === country ? "bg-sand/50 text-ink-dark" : "text-ink"
                  }`}
                >
                  {country}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-stone-dark">No countries found</p>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

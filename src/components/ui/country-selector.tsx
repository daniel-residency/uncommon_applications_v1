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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const item = list.children[highlightedIndex] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          onChange(filtered[highlightedIndex]);
          setOpen(false);
          setSearch("");
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm text-ink font-semibold mb-1.5 lowercase">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full border rounded-md bg-white/40 py-2.5 px-3.5 text-sm text-left outline-none transition-colors cursor-pointer ${
            value ? "text-ink" : "text-mid-gray"
          } ${open ? "border-ink" : "border-border"} ${error ? "border-red-400" : ""}`}
        >
          {value || "select"}
        </button>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#8E8EA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-border-light">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="search countries..."
                className="w-full px-3 py-1.5 text-sm bg-transparent outline-none text-ink placeholder:text-mid-gray"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-48" ref={listRef}>
              {filtered.map((country, idx) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors lowercase ${
                    idx === highlightedIndex ? "bg-frost" : ""
                  } ${
                    value === country ? "text-ink font-semibold" : "text-ink"
                  }`}
                >
                  {country}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-mid-gray">no countries found</p>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

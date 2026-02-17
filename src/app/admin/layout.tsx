"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => {
        if (r.ok) setAuthenticated(true);
        else setAuthenticated(false);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError("Invalid secret");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin", { method: "DELETE" });
    setAuthenticated(false);
    setSecret("");
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-dark text-sm">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] animate-fade-in">
          <h1 className="text-xl font-normal text-ink-dark mb-6 text-center">
            Admin Login
          </h1>
          <div className="bg-cream rounded-sm p-8 shadow-sm">
            <form onSubmit={handleLogin}>
              <label className="block text-sm text-ink-dark mb-2">Admin Secret</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full border-b border-sand bg-transparent py-3 text-base font-serif text-ink-dark outline-none focus:border-ink-dark"
                autoFocus
              />
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                className="mt-6 w-full bg-ink-dark text-cream py-3 text-sm font-serif rounded-sm cursor-pointer hover:bg-ink transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/applications", label: "Applications" },
    { href: "/admin/homes", label: "Homes" },
    { href: "/admin/export", label: "Export" },
  ];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="bg-cream border-b border-sand px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-sm font-normal text-ink-dark">Admin</span>
          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? "text-ink-dark"
                    : "text-stone-dark hover:text-ink-dark"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-stone-dark hover:text-ink-dark cursor-pointer transition-colors"
        >
          Logout
        </button>
      </nav>

      <div className="p-4 sm:p-8">{children}</div>
    </div>
  );
}

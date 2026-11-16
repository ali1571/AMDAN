"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isBiz = pathname === "/biz";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-emerald-600" />
          <span className="font-poppins text-2xl font-semibold tracking-wide text-slate-900">
            AMDAN.
          </span>
        </Link>

        {/* Vertical Switcher Pill */}
        <div className="flex items-center rounded-full border border-slate-200 bg-slate-100/80 p-1">
          <Link
            href="/"
            className={`rounded-full px-4 py-1 text-xs font-semibold transition-all ${
              !isBiz
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tech
          </Link>
          <Link
            href="/biz"
            className={`rounded-full px-4 py-1 text-xs font-semibold transition-all ${
              isBiz
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Business
          </Link>
        </div>

        {/* Tagline (hidden on tiny mobile screens so switcher breathes) */}
        <div className="hidden sm:block">
          <span className="font-mono text-xs text-slate-400 lowercase tracking-widest">
            open market data.
          </span>
        </div>
      </div>
    </nav>
  );
}
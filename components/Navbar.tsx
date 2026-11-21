"use client";

import { BarChart3, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isTech = pathname === "/";
  const isBiz = pathname === "/biz";
  const isDeepStats = pathname === "/deepstats";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      {/* Main Row */}
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:grid sm:grid-cols-3 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-600" />
            <span className="font-poppins text-2xl font-semibold tracking-wide text-slate-900">
              AMDAN.
            </span>
          </Link>
        </div>

        {/* Center: DeepStats Link (Dead-Center on Desktop) */}
        <div className="hidden items-center justify-center sm:flex">
          <Link
            href="/deepstats"
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              isDeepStats
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-emerald-600" />
            <span>DeepStats</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-700">
              NEW
            </span>
          </Link>
        </div>

        {/* Right: Vertical Switcher Pill */}
        <div className="flex items-center justify-end">
          <div className="flex items-center rounded-full border border-slate-200 bg-slate-100/80 p-1">
            <Link
              href="/"
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all sm:px-4 ${
                isTech
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Tech
            </Link>
            <Link
              href="/biz"
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all sm:px-4 ${
                isBiz
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Business
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Strip: Keeps top row unclogged while keeping DeepStats 1 tap away */}
      <div className="flex items-center justify-center border-t border-slate-100 bg-slate-50/80 py-1.5 sm:hidden">
        <Link
          href="/deepstats"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold transition-all ${
            isDeepStats
              ? "text-emerald-700"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Explore DeepStats & Market Curves</span>
          <span className="font-mono text-[10px] text-emerald-600">→</span>
        </Link>
      </div>
    </nav>
  );
}
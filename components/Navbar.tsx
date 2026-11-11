import { Wallet } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-emerald-600" />
          <span className="font-poppins text-2xl font-semibold tracking-wide text-slate-900">
            AMDAN.
          </span>
        </div>
        <div>
          <span className="font-mono text-xs text-slate-400 lowercase tracking-widest">
            open market data.
          </span>
        </div>
      </div>
    </nav>
  );
}
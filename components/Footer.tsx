import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-slate-200 bg-transparent py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        
        {/* Socials / Contact */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="mailto:aliabid1571@gmail.com" className="group flex items-center gap-2 text-slate-400 transition-colors hover:text-emerald-600">
            <Mail className="h-4 w-4" />
            <span className="font-mono text-[11px] font-light tracking-wide underline underline-offset-4">aliabid1571@gmail.com</span>
          </a>
          
          <a href="https://www.linkedin.com/in/ali-abid-9667483b3/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-slate-400 transition-colors hover:text-emerald-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span className="font-mono text-[11px] font-light tracking-wide underline underline-offset-4">ali-abid</span>
          </a>

          <a href="https://x.com/QWERTS1571" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-slate-400 transition-colors hover:text-emerald-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span className="font-mono text-[11px] font-light tracking-wide underline underline-offset-4">@QWERTS1571</span>
          </a>
        </div>
        
        <p className="text-xs text-slate-400">
          Built by Ali (QWERTS) <span className="font-playfair italic text-emerald-600 lowercase tracking-normal">FOR THE CULTURE</span>. &copy; 2026
        </p>
      </div>
    </footer>
  );
}
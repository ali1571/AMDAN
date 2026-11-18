export default function Banner() {
  return (
    <div className="bg-slate-900 px-3 py-2 text-center text-[11px] leading-snug text-slate-200 sm:text-xs">
      <span className="font-semibold text-emerald-400">Hey!</span> Just a weekend MVP, not a fortified SaaS. Devved by{" "}
      <span className="font-semibold text-white">Ali,</span>  connect on{" "}
      <a
        href="https://x.com/QWERTS1571"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
      >
        X 
      </a>{" "}
      or{" "}
      <a
        href="https://www.linkedin.com/in/ali-abid-9667483b3/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
      >
        LinkedIn
      </a>
      .
    </div>
  );
}




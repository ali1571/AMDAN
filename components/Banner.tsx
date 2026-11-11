export default function Banner() {
  return (
    <div className="w-full bg-slate-900 px-4 py-2 text-center sm:px-6 lg:px-8">
      <p className="font-sans text-xs font-light tracking-wide text-slate-300">
        <span className="font-medium text-emerald-400">Hey!</span> This is just a weekend MVP, not a fortified SaaS—no need to stress-test the forms. 
        Missing a role or city?{" "}
        <a 
          href="https://www.linkedin.com/in/ali-abid-9667483b3/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium text-white underline decoration-slate-500 underline-offset-2 transition-colors hover:decoration-emerald-400"
        >
          Reach out
        </a>{" "}
        and I'll add it.
      </p>
    </div>
  );
}
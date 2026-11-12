"use client";

export default function CompanySpot() {
  const spottedCompanies = ["Systems Limited", "Axiom", "TCP"];

  return (
    <div className="mt-4 flex items-center justify-center">
      {/* The curved boundary "pill" */}
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
        
        {/* Eye icon - slightly darker */}
        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        
        {/* Darker, cooler text wording */}
        <p className="font-sans text-xs font-bold tracking-wide uppercase text-slate-600">
          Recent Drops: 
          <span className="ml-1.5 text-sm font-medium normal-case tracking-normal text-slate-900">
            {spottedCompanies.join(", ")}
          </span>
        </p>
        
      </div>
    </div>
  );
}
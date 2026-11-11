"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { timeAgo } from "../lib/TimeAgo";

export default function SalaryFeed() {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSalaries() {
      const { data, error } = await supabase
        .from("salary_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setSalaries(data);
      }
      setLoading(false);
    }
    fetchSalaries();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (salaries.length === 0) {
    return <p className="mt-12 text-center text-sm font-light text-slate-500">The ledger is empty. Drop the first receipt.</p>;
  }

  const formatMoney = (amount: number) => new Intl.NumberFormat('en-US').format(amount);

  return (
    <div className="mt-16 w-full space-y-16 overflow-hidden">
      

      {/* 2. The Flat Ledger (Expanded & Bumped Specs) */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-playfair text-3xl italic tracking-wide text-slate-900 lowercase">
            the receipts.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Live Market</span>
        </div>
        
        <div className="flex w-full flex-col border-t border-slate-300">
          {salaries.map((salary) => (
            <div 
              key={salary.id} 
              className="group flex flex-col justify-between border-b border-slate-200 py-5 transition-colors hover:bg-white/60 sm:flex-row sm:items-center sm:px-4 -mx-4 sm:mx-0"
            >
              {/* Role, Company, & Relative Time */}
              <div className="flex flex-col px-4 sm:w-1/3 sm:px-0">
                <span className="text-base font-medium text-slate-900">{salary.role}</span>
                <div className="mt-0.5 flex items-center gap-2 text-xs font-light tracking-wide text-slate-500">
                  <span>{salary.company_name || "Confidential"}</span>
                  <span>•</span>
                  {/* Live Relative Time Display */}
                  <span className="font-mono text-[11px] text-emerald-600/80">
                    {timeAgo(salary.created_at)}
                  </span>
                </div>
              </div>

              {/* Specs: Bumped up YOE size */}
              <div className="mt-4 flex items-center gap-6 px-4 font-mono text-sm font-light text-slate-600 sm:mt-0 sm:w-1/3 sm:justify-center sm:px-0">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    salary.work_model === 'Remote' ? 'bg-emerald-400' 
                    : salary.work_model === 'Hybrid' ? 'bg-amber-400' 
                    : 'bg-slate-300'
                  }`}></span>
                  {salary.work_model}
                </span>
                <span>{salary.city}</span>
                {/* YOE is larger and darker now */}
                <span className="font-medium text-slate-800">
                  {salary.yoe} <span className="text-[11px] font-light uppercase tracking-widest text-slate-400">yoe</span>
                </span>
              </div>

              {/* Compensation */}
              <div className="mt-4 flex items-baseline justify-start gap-1.5 px-4 sm:mt-0 sm:w-1/3 sm:justify-end sm:px-0">
                <span className="font-oswald text-2xl font-medium tracking-tight text-slate-900">
                  {formatMoney(salary.salary_amount)}
                </span>
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-600">
                  {salary.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
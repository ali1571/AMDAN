"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function LiveTicker() {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSalaries() {
      const { data, error } = await supabase
        .from("salary_records")
        .select("role, salary_amount, currency, yoe")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setSalaries(data);
      }
      setLoading(false);
    }
    fetchSalaries();
  }, []);

  // Don't render the ticker area at all if there's no data yet
  if (loading || salaries.length === 0) return null;

  const formatMoney = (amount: number) => new Intl.NumberFormat('en-US').format(amount);

  return (
    <div className="relative mt-12 flex w-full overflow-hidden border-y border-slate-200 bg-white/40 py-3 shadow-sm backdrop-blur-sm">
      {/* Left Fade */}
      <div className="absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#f8fafc] to-transparent"></div>
      
      {/* Scrolling Content */}
      <div className="animate-ticker flex w-max min-w-full shrink-0 items-center gap-8 px-4">
        {[...salaries, ...salaries].map((salary, i) => (
          <div key={i} className="flex items-center gap-3 text-xs font-medium tracking-wide">
            <span className="text-slate-800">{salary.role}</span>
            <span className="text-slate-300">•</span>
            <span className="font-oswald text-sm text-emerald-700">
              {formatMoney(salary.salary_amount)} {salary.currency}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{salary.yoe} YOE</span>
          </div>
        ))}
      </div>
      
      {/* Right Fade */}
      <div className="absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#f8fafc] to-transparent"></div>
    </div>
  );
}
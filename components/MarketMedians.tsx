"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { VALID_ROLES, BIZ_ROLES } from "../lib/constants";

export default function MarketMedians({
  industry = "Tech",
  selectedRole = "All",
  onSelectRole,
}: {
  industry?: "Tech" | "Business";
  selectedRole?: string;
  onSelectRole?: (role: string) => void;
}) {
  const isBiz = industry === "Business";
  const roles = ["All", ...(isBiz ? BIZ_ROLES : VALID_ROLES)];

  const [medians, setMedians] = useState({ local: 0, remote: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchMedians() {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_market_medians", {
        role_filter: selectedRole === "All" ? null : selectedRole,
        industry_filter: industry,
      });

      if (!error && data) {
        const result = Array.isArray(data) ? data[0] : data;
        setMedians({
          local: result?.local_median || 0,
          remote: result?.remote_median || 0,
        });
      }

      setLoading(false);
    }
    fetchMedians();
  }, [selectedRole, industry]);

  const formatK = (value: number) => {
    if (!value || value === 0) return "--";
    if (value >= 100000) return (value / 1000).toFixed(0) + "k";
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div className="mx-auto mt-12 max-w-4xl px-4 sm:px-6">
      {/* Interactive Role Selector */}
      <div className="mb-6 flex w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => onSelectRole?.(role)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                selectedRole === role
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-800"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-transparent sm:flex-row transition-opacity duration-300 ${
          loading ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Local Market Block */}
        <div className="relative flex flex-1 flex-col justify-between p-6 sm:border-r sm:border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-500"></span>
              </span>
              <span className="font-oswald text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Local Market
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-oswald text-5xl font-medium tracking-tight text-slate-900">
              {formatK(medians.local)}
            </span>
          </div>
          <span className="font-playfair mt-1 text-sm italic text-slate-400">
            median base / pkr
          </span>
        </div>

        {/* Global/Remote Market Block */}
        <div className="relative flex flex-1 flex-col justify-between p-6 border-t border-slate-200 sm:border-t-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-oswald text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Remote / Global
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-oswald text-5xl font-medium tracking-tight text-emerald-700">
              {formatK(medians.remote)}
            </span>
          </div>
          <span className="font-playfair mt-1 text-sm italic text-slate-400">
            converted median / pkr
          </span>
        </div>
      </div>
    </div>
  );
}
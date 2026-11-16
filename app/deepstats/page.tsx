



/*
import { Suspense } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

function getMedian(salaries: number[]) {
  if (salaries.length === 0) return 0;
  const sorted = [...salaries].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) return sorted[half];
  return (sorted[half - 1] + sorted[half]) / 2;
}

async function StatsContent() {
  const { data: records, error } = await supabase
    .from("salary_records")
    .select("*");

  if (error) {
    console.error("Error fetching stats:", error);
  }

  const safeRecords = records || [];
  const totalCount = safeRecords.length;

  // --- 1. LEADERBOARD LOGIC (PKR ONLY, N >= 3) ---
  const pkrRecords = safeRecords.filter((r) => r.currency === "PKR");
  const salariesByRole: Record<string, number[]> = {};

  pkrRecords.forEach((record) => {
    if (!salariesByRole[record.role]) {
      salariesByRole[record.role] = [];
    }
    salariesByRole[record.role].push(record.salary_amount);
  });

  const leaderboard = Object.entries(salariesByRole)
    .filter(([, salaries]) => salaries.length >= 3)
    .map(([role, salaries]) => ({
      role,
      count: salaries.length,
      median: getMedian(salaries),
    }))
    .sort((a, b) => b.median - a.median);

  const topRole = leaderboard[0] || null;
  const runnerUps = leaderboard.slice(1, 6); // Ranks #2 through #6
  const maxMedian = topRole ? topRole.median : 1;

  // --- 2. DATASET COMPOSITION (ALL RECEIPTS) ---
  const countByRole: Record<string, number> = {};
  safeRecords.forEach((record) => {
    countByRole[record.role] = (countByRole[record.role] || 0) + 1;
  });

  const distribution = Object.entries(countByRole)
    .map(([role, count]) => ({
      role,
      count,
      share: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const maxRoleCount = distribution[0]?.count || 1;

  return (
    <>
    
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
        <span>
          Compiled from{" "}
          <strong className="font-semibold text-slate-900 tabular-nums">
            {totalCount}
          </strong>{" "}
          verified submissions
        </span>
        <span className="text-slate-300">•</span>
        <span className="inline-flex items-center gap-2 font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          Live Postgres Feed
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
       
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-8 lg:col-span-7">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Local PKR Leaderboard
                </p>
                <h2 className="mt-0.5 text-base font-semibold text-slate-900">
                  Highest Paying Stacks by Median
                </h2>
              </div>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-600">
                min n=3
              </span>
            </div>

            {topRole ? (
              <>
           
                <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                      <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[10px] text-white">
                        #01
                      </span>
                      Top Local Median
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {topRole.count} receipts
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-oswald text-2xl font-bold text-slate-900 sm:text-3xl">
                      {topRole.role}
                    </h3>
                    <div className="text-right tabular-nums">
                      <span className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        {topRole.median.toLocaleString()}
                      </span>
                      <span className="ml-1.5 text-xs font-semibold uppercase text-slate-400">
                        PKR / mo
                      </span>
                    </div>
                  </div>
                </div>

                
                {runnerUps.length > 0 && (
                  <div className="mt-6 divide-y divide-slate-100">
                    {runnerUps.map((item, idx) => {
                      const barWidth = Math.round(
                        (item.median / maxMedian) * 100
                      );
                      return (
                        <div
                          key={item.role}
                          className="py-3.5 first:pt-1 last:pb-0"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="w-6 font-mono text-xs font-medium text-slate-400">
                                0{idx + 2}
                              </span>
                              <span className="font-medium text-slate-800">
                                {item.role}
                              </span>
                              <span className="font-mono text-xs text-slate-400">
                                ({item.count})
                              </span>
                            </div>
                            <span className="font-semibold text-slate-900 tabular-nums">
                              {item.median.toLocaleString()}{" "}
                              <span className="text-xs font-normal text-slate-400">
                                PKR
                              </span>
                            </span>
                          </div>

                
                          <div className="mt-2 ml-9 h-1.5 w-auto overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-800"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="font-playfair text-xl font-bold text-slate-800">
                  Insufficient Sample Size
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  At least 3 local receipts per role are required to rank
                  medians.
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 border-t border-slate-100 pt-3 text-xs text-slate-400">
            Excludes USD/EUR remote outliers to reflect true local PKR
            baselines.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-8 lg:col-span-5">
          <div>
            <div className="border-b border-slate-100 pb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Sample Distribution
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-slate-900">
                Receipts by Discipline
              </h2>
            </div>

            <div className="mt-5 space-y-3.5">
              {distribution.map((item) => {
                const widthPercent = Math.round(
                  (item.count / maxRoleCount) * 100
                );
                return (
                  <div key={item.role}>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-slate-700">
                        {item.role}
                      </span>
                      <div className="flex items-center gap-2 tabular-nums">
                        <span className="text-xs text-slate-400">
                          {item.share}%
                        </span>
                        <span className="w-6 text-right font-mono font-semibold text-slate-900">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600/85"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-700 transition-colors hover:text-emerald-700"
            >
              Missing your role? Add your receipt →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DeepStatsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-10 font-sans text-slate-900 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
      
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-900"
          >
            <span>←</span> Back to Ledger
          </Link>
        </div>

    
        <h1 className="font-oswald text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Market Telemetry
        </h1>

        <Suspense
          fallback={
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white lg:col-span-7" />
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white lg:col-span-5" />
            </div>
          }
        >
          <StatsContent />
        </Suspense>
      </div>
    </main>
  );
}
*/

"use client";
import  { useRouter } from "next/navigation";

export default function ComingSoon(){
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 px-6 text-center text-black">
      {/* Status Badge */}
      <span className="mb-6 inline-block rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
        In the works
      </span>

      {/* Main Heading - Uses your default heading/sans font */}
      <h1 className="max-w-2xl text-5xl font-bold leading-snug tracking-tight sm:text-7xl sm:leading-tight">
        DeepStats... <br />
        coming soon
      </h1>


      {/* Subtext */}
      <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
        Salary stats and market insights. Check back shortly for updates.
      </p>

      <button
        onClick = {() => router.back()}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
      >
        <span>&larr;</span> Go Back
      </button>



    </main>
  );
}


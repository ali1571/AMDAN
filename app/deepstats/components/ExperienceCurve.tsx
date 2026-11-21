"use client";

import { useState } from "react";

interface SalaryRow {
  industry: string;
  role: string;
  yoe: number;
  salary_amount: number;
  currency: string;
  work_model: string;
  city: string;
}

interface BracketStat {
  rangeLabel: string;
  title: string;
  medianPkr: number;
  count: number;
}

// Plain helper to compute median of a numeric array
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }

  const sorted = [...numbers];
  sorted.sort(function (a, b) {
    return a - b;
  });

  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  } else {
    return sorted[mid];
  }
}

export default function ExperienceCurve({ rows }: { rows: SalaryRow[] }) {
  const [selectedTrack, setSelectedTrack] = useState<"All" | "Tech" | "Business">("Tech");

  // 1. Initialize empty arrays for the 5 experience brackets
  const entrySalaries: number[] = [];      // 0 - 1.9 yrs
  const juniorSalaries: number[] = [];     // 2 - 3.9 yrs
  const midSalaries: number[] = [];        // 4 - 6.9 yrs
  const seniorSalaries: number[] = [];     // 7 - 10 yrs
  const experiencedSalaries: number[] = []; // > 10 yrs

  // 2. Loop through rows and bucket local PKR salaries by YOE
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (row.currency !== "PKR") {
      continue;
    }

    if (selectedTrack !== "All" && row.industry !== selectedTrack) {
      continue;
    }

    const years = Number(row.yoe);
    const pay = Number(row.salary_amount);

    if (years < 2) {
      entrySalaries.push(pay);
    } else if (years < 4) {
      juniorSalaries.push(pay);
    } else if (years < 7) {
      midSalaries.push(pay);
    } else if (years <= 10) {
      seniorSalaries.push(pay);
    } else {
      experiencedSalaries.push(pay);
    }
  }

  // 3. Build the 5 bracket objects in chronological order
  const brackets: BracketStat[] = [
    {
      rangeLabel: "0–1 years",
      title: "Entry level",
      medianPkr: calculateMedian(entrySalaries),
      count: entrySalaries.length,
    },
    {
      rangeLabel: "2–3 years",
      title: "Junior",
      medianPkr: calculateMedian(juniorSalaries),
      count: juniorSalaries.length,
    },
    {
      rangeLabel: "4–6 years",
      title: "Mid-level",
      medianPkr: calculateMedian(midSalaries),
      count: midSalaries.length,
    },
    {
      rangeLabel: "7–10 years",
      title: "Senior",
      medianPkr: calculateMedian(seniorSalaries),
      count: seniorSalaries.length,
    },
    {
      rangeLabel: "10+ years",
      title: "Experienced",
      medianPkr: calculateMedian(experiencedSalaries),
      count: experiencedSalaries.length,
    },
  ];

  // 4. Find highest median across the brackets to scale the bar widths
  let maxMedian = 0;
  for (let i = 0; i < brackets.length; i++) {
    if (brackets[i].medianPkr > maxMedian) {
      maxMedian = brackets[i].medianPkr;
    }
  }

  const entryBaseline = brackets[0].medianPkr;

  return (
    <section className="space-y-4">
      {/* Section Header + Track Switcher */}
      <div className="flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-poppins text-sm font-semibold uppercase tracking-wider text-slate-500">
            04 / Salary by Experience
          </h2>
          <p className="mt-1 font-poppins text-lg font-bold text-slate-900">
            How much more do people actually earn as they gain experience?
          </p>
        </div>

        {/* Simple Track Filter Pills */}
        <div className="inline-flex self-start rounded-full border border-slate-200 bg-white p-1 shadow-2xs">
          {(["Tech", "Business", "All"] as const).map((track) => {
            const isActive = selectedTrack === track;
            return (
              <button
                key={track}
                type="button"
                onClick={() => setSelectedTrack(track)}
                className={`rounded-full px-3.5 py-1 font-mono text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {track}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Progression Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="font-sans text-xs font-medium text-slate-500">
            Career progression curve ({selectedTrack === "All" ? "Tech & Business" : selectedTrack})
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Local PKR median
          </span>
        </div>

        <div className="space-y-5">
          {brackets.map((bracket, index) => {
            let barWidth = 0;
            if (maxMedian > 0 && bracket.medianPkr > 0) {
              barWidth = Math.round((bracket.medianPkr / maxMedian) * 100);
            }

            // Calculate percentage jump compared to 0-1 yrs Entry level
            let growthBadge = "";
            if (index > 0 && entryBaseline > 0 && bracket.medianPkr > 0) {
              const pctJump = Math.round(
                ((bracket.medianPkr - entryBaseline) / entryBaseline) * 100
              );
              if (pctJump > 0) {
                growthBadge = "+" + pctJump + "% vs entry";
              }
            }

            return (
              <div key={bracket.rangeLabel} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="font-poppins font-bold text-slate-900">
                      {bracket.rangeLabel}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {bracket.title}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      n = {bracket.count}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {growthBadge !== "" && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-700">
                        {growthBadge}
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-slate-900 sm:text-sm">
                      {bracket.medianPkr > 0
                        ? "PKR " + bracket.medianPkr.toLocaleString()
                        : "No data yet"}
                    </span>
                  </div>
                </div>

                {/* Horizontal Progression Bar */}
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  {bracket.medianPkr > 0 && (
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: barWidth + "%" }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 border-t border-slate-100 pt-4 font-mono text-[11px] text-slate-400">
          Note: Foreign currency remote roles (USD/EUR) are excluded from local PKR brackets so currency arbitrage does not skew career progression curves.
        </p>
      </div>
    </section>
  );
}
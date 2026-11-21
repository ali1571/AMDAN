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

interface CityStat {
  city: string;
  medianPkr: number;
  count: number;
  isQualified: boolean;
}

interface CityRoleStat {
  role: string;
  industry: string;
  medianPkr: number;
  count: number;
}

const TARGET_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
];

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

export default function CityComparison({ rows }: { rows: SalaryRow[] }) {
  const MIN_CITY_SAMPLES = 5;

  // 1. Group PKR salaries for the 5 target cities
  const citySalariesMap: Record<string, number[]> = {};
  for (let i = 0; i < TARGET_CITIES.length; i++) {
    citySalariesMap[TARGET_CITIES[i]] = [];
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.currency === "PKR" && citySalariesMap[row.city] !== undefined) {
      citySalariesMap[row.city].push(Number(row.salary_amount));
    }
  }

  // 2. Build city summary stats and separate qualified (>= 5) vs small-sample cities
  const qualifiedCities: CityStat[] = [];
  const smallSampleCities: CityStat[] = [];

  for (let i = 0; i < TARGET_CITIES.length; i++) {
    const cityName = TARGET_CITIES[i];
    const salaries = citySalariesMap[cityName];
    const count = salaries.length;
    const medianVal = calculateMedian(salaries);

    if (count >= MIN_CITY_SAMPLES) {
      qualifiedCities.push({
        city: cityName,
        medianPkr: medianVal,
        count: count,
        isQualified: true,
      });
    } else {
      smallSampleCities.push({
        city: cityName,
        medianPkr: medianVal,
        count: count,
        isQualified: false,
      });
    }
  }

  // Sort qualified cities from highest median salary to lowest
  qualifiedCities.sort(function (a, b) {
    return b.medianPkr - a.medianPkr;
  });

  // Find the highest median among qualified cities to scale the horizontal bars
  let highestMedian = 0;
  for (let i = 0; i < qualifiedCities.length; i++) {
    if (qualifiedCities[i].medianPkr > highestMedian) {
      highestMedian = qualifiedCities[i].medianPkr;
    }
  }

  // Default selected city: first qualified city (usually Islamabad/Karachi/Lahore), or "Lahore"
  const defaultCity =
    qualifiedCities.length > 0 ? qualifiedCities[0].city : "Lahore";
  const [selectedCity, setSelectedCity] = useState<string>(defaultCity);

  // 3. Build scrollable role medians for the currently selected city
  const roleGroups: Record<string, { salaries: number[]; industry: string }> = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.currency === "PKR" && row.city === selectedCity) {
      const key = row.role + " (" + row.industry + ")";
      if (!roleGroups[key]) {
        roleGroups[key] = {
          salaries: [],
          industry: row.industry,
        };
      }
      roleGroups[key].salaries.push(Number(row.salary_amount));
    }
  }

  const selectedCityRoles: CityRoleStat[] = [];
  const groupKeys = Object.keys(roleGroups);

  for (let i = 0; i < groupKeys.length; i++) {
    const fullRoleLabel = groupKeys[i];
    const group = roleGroups[fullRoleLabel];
    selectedCityRoles.push({
      role: fullRoleLabel,
      industry: group.industry,
      medianPkr: calculateMedian(group.salaries),
      count: group.salaries.length,
    });
  }

  // Sort roles in the selected city by submission count first, then highest median
  selectedCityRoles.sort(function (a, b) {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return b.medianPkr - a.medianPkr;
  });

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-1 px-1 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-poppins text-sm font-semibold uppercase tracking-wider text-slate-500">
            03 / Salary by City
          </h2>
          <p className="mt-1 font-poppins text-lg font-bold text-slate-900">
            Lahore vs. Karachi vs. Islamabad — where local PKR pay goes further.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-400">
          Click a city to inspect its roles
        </span>
      </div>

      {/* Main 2-Column Interactive Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: Horizontal Bar Chart Card (7 cols) */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-7">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-poppins text-base font-bold text-slate-900">
                City Median Ranking
              </h3>
              <span className="font-mono text-[11px] text-slate-400">
                Local PKR • min n = {MIN_CITY_SAMPLES}
              </span>
            </div>

            {qualifiedCities.length === 0 ? (
              <p className="py-10 text-center text-xs text-slate-400">
                Not enough PKR submissions per city yet (minimum {MIN_CITY_SAMPLES} required).
              </p>
            ) : (
              <div className="space-y-4">
                {qualifiedCities.map((item) => {
                  const isSelected = item.city === selectedCity;
                  let barPercent = 0;
                  if (highestMedian > 0) {
                    barPercent = Math.round((item.medianPkr / highestMedian) * 100);
                  }

                  return (
                    <button
                      key={item.city}
                      type="button"
                      onClick={() => setSelectedCity(item.city)}
                      className={`w-full rounded-2xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
                          : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-poppins font-bold text-slate-900">
                            {item.city}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[11px] text-slate-500 shadow-2xs">
                            n = {item.count}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-700">
                          PKR {item.medianPkr.toLocaleString()}
                        </span>
                      </div>

                      {/* Horizontal Bar Track */}
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSelected ? "bg-emerald-600" : "bg-slate-700"
                          }`}
                          style={{ width: barPercent + "%" }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Unranked / Low-Sample Cities Footer */}
          {smallSampleCities.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-slate-400">
                Unranked (n &lt; {MIN_CITY_SAMPLES} — click to inspect)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {smallSampleCities.map((item) => {
                  const isSelected = item.city === selectedCity;
                  return (
                    <button
                      key={item.city}
                      type="button"
                      onClick={() => setSelectedCity(item.city)}
                      className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {item.city} (n = {item.count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Scrollable Role Medians Window for Selected City (5 cols) */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm lg:col-span-5">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-base font-bold text-slate-900">
                {selectedCity} Role Medians
              </h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-700">
                {selectedCityRoles.length} roles
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Sorted by submission count (local PKR)
            </p>
          </div>

          <div className="max-h-[320px] flex-1 overflow-y-auto">
            {selectedCityRoles.length === 0 ? (
              <div className="px-6 py-12 text-center text-xs text-slate-400">
                No PKR submissions recorded for {selectedCity} yet.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/95 text-[11px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">
                  <tr>
                    <th className="py-2.5 pl-6 pr-2">Role</th>
                    <th className="px-2 py-2.5 text-right">Median</th>
                    <th className="py-2.5 pl-2 pr-6 text-right">n</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCityRoles.map((roleItem) => (
                    <tr
                      key={roleItem.role}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="py-3 pl-6 pr-2 text-xs font-medium text-slate-800">
                        {roleItem.role}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-right font-mono text-xs font-bold text-emerald-700">
                        {Math.round(roleItem.medianPkr / 1000)}k PKR
                      </td>
                      <td className="whitespace-nowrap py-3 pl-2 pr-6 text-right font-mono text-xs text-slate-400">
                        {roleItem.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-2.5 text-center font-mono text-[11px] text-slate-400">
            Showing all reported roles in {selectedCity}
          </div>
        </div>
      </div>
    </section>
  );
}
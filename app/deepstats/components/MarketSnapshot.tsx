import { Briefcase, Database, MapPin, TrendingUp } from "lucide-react";

interface SalaryRow {
  industry: string;
  role: string;
  yoe: number;
  salary_amount: number;
  currency: string;
  work_model: string;
  city: string;
}

export default function MarketSnapshot({ rows }: { rows: SalaryRow[] }) {
  // 1. Total passed submissions
  const totalCount = rows.length;

  // 2. Collect PKR salaries to compute local median, plus unique roles & cities
  const pkrSalaries: number[] = [];
  const uniqueRoles = new Set<string>();
  const uniqueCities = new Set<string>();

  for (const row of rows) {
    if (row.currency === "PKR") {
      pkrSalaries.push(Number(row.salary_amount));
    }
    if (row.role) uniqueRoles.add(row.role);
    if (row.city) uniqueCities.add(row.city);
  }

  // Sort PKR salaries ascending
  pkrSalaries.sort((a, b) => a - b);

  // Calculate median PKR salary
  let medianPkr = 0;
  const pkrCount = pkrSalaries.length;

  if (pkrCount > 0) {
    const mid = Math.floor(pkrCount / 2);
    medianPkr =
      pkrCount % 2 === 0
        ? Math.round((pkrSalaries[mid - 1] + pkrSalaries[mid]) / 2)
        : pkrSalaries[mid];
  }

  const cards = [
    {
      value: totalCount.toLocaleString(),
      unit: "",
      label: "Passed submissions",
      subtext: "Quality-checked records",
      icon: Database,
      featured: false,
    },
    {
      value: medianPkr > 0 ? `${Math.round(medianPkr / 1000)}k` : "—",
      unit: medianPkr > 0 ? "PKR" : "",
      label: "Median local salary",
      subtext: `Monthly • n = ${pkrCount}`,
      icon: TrendingUp,
      featured: true,
    },
    {
      value: String(uniqueRoles.size),
      unit: "",
      label: "Roles represented",
      subtext: "Tech & Corporate",
      icon: Briefcase,
      featured: false,
    },
    {
      value: String(uniqueCities.size),
      unit: "",
      label: "Cities represented",
      subtext: "Across Pakistan",
      icon: MapPin,
      featured: false,
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-emerald-600">
            01
          </span>
          <span className="text-slate-300">/</span>
          <h2 className="font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Market Snapshot
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          live ledger
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                card.featured
                  ? "border-emerald-200/90 bg-gradient-to-b from-emerald-50/50 to-white shadow-sm"
                  : "border-slate-200/80 bg-white shadow-xs hover:border-slate-300"
              }`}
            >
              {/* Top Row: Label + Icon */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">
                  {card.label}
                </p>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    card.featured
                      ? "bg-emerald-100/80 text-emerald-700"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-900 group-hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Main Metric */}
              <div className="mt-3 flex items-baseline gap-1.5">
                <p
                  className={`font-poppins text-2xl font-bold tracking-tight tabular-nums sm:text-3xl ${
                    card.featured ? "text-emerald-950" : "text-slate-900"
                  }`}
                >
                  {card.value}
                </p>
                {card.unit && (
                  <span className="font-mono text-xs font-semibold text-emerald-600">
                    {card.unit}
                  </span>
                )}
              </div>

              {/* Subtext Footer */}
              <p className="mt-2 font-mono text-[11px] text-slate-400">
                {card.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

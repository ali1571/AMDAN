interface SalaryRow {
  industry: string;
  role: string;
  yoe: number;
  salary_amount: number;
  currency: string;
  work_model: string;
  city: string;
}

interface RankedRole {
  role: string;
  medianPkr: number;
  count: number;
}

// Helper function to calculate median from a list of numbers
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }

  // Sort numbers from lowest to highest
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

// Helper function to group rows by role and rank them for a given industry
function buildRankedList(rows: SalaryRow[], targetIndustry: string, minSamples: number): RankedRole[] {
  // 1. Group PKR salaries by role name using a simple dictionary object
  const roleGroups: Record<string, number[]> = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Only include passed PKR rows matching the target industry
    if (row.industry === targetIndustry && row.currency === "PKR") {
      const roleName = row.role;

      if (!roleGroups[roleName]) {
        roleGroups[roleName] = [];
      }

      roleGroups[roleName].push(Number(row.salary_amount));
    }
  }

  // 2. Keep only roles that have at least `minSamples` (5) submissions
  const rankedList: RankedRole[] = [];
  const roleNames = Object.keys(roleGroups);

  for (let i = 0; i < roleNames.length; i++) {
    const roleName = roleNames[i];
    const salaries = roleGroups[roleName];

    if (salaries.length >= minSamples) {
      const medianVal = calculateMedian(salaries);
      rankedList.push({
        role: roleName,
        medianPkr: medianVal,
        count: salaries.length,
      });
    }
  }

  // 3. Sort from highest median salary to lowest
  rankedList.sort(function (a, b) {
    return b.medianPkr - a.medianPkr;
  });

  return rankedList;
}

// Reusable scrollable leaderboard card for either Tech or Business
function LeaderboardWindow({
  title,
  subtitle,
  items,
  minSamples,
}: {
  title: string;
  subtitle: string;
  items: RankedRole[];
  minSamples: number;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      {/* Card Top Header */}
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins text-base font-bold text-slate-900">
            {title}
          </h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-600">
            {items.length} qualified
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
      </div>

      {/* Scrollable Window (shows ~5 rows, scrolls smoothly for the rest) */}
      <div className="max-h-[310px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center text-xs text-slate-400">
            Waiting for roles to reach {minSamples}+ PKR submissions.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/95 text-[11px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">
              <tr>
                <th className="py-2.5 pl-6 pr-2">Role</th>
                <th className="px-3 py-2.5 text-right">Median</th>
                <th className="py-2.5 pl-2 pr-6 text-right">n</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr
                  key={item.role}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="py-3.5 pl-6 pr-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 font-mono text-xs font-semibold text-slate-400">
                        {index + 1}.
                      </span>
                      <span className="font-medium text-slate-800">
                        {item.role}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-right font-mono text-xs font-bold text-emerald-700">
                    PKR {item.medianPkr.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap py-3.5 pl-2 pr-6 text-right font-mono text-xs text-slate-400">
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Subtle Bottom Footer Hint */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-2.5 text-center font-mono text-[11px] text-slate-400">
        {items.length > 5
          ? "Scroll inside table to view all " + items.length + " roles • min n = " + minSamples
          : "Only roles with n ≥ " + minSamples + " PKR submissions shown"}
      </div>
    </div>
  );
}

export default function RoleLeaderboard({ rows }: { rows: SalaryRow[] }) {
  const MIN_SUBMISSIONS = 5;

  const techRoles = buildRankedList(rows, "Tech", MIN_SUBMISSIONS);
  const bizRoles = buildRankedList(rows, "Business", MIN_SUBMISSIONS);

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-1 px-1 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-poppins text-sm font-semibold uppercase tracking-wider text-slate-500">
            02 / Highest-Paying Roles
          </h2>
          <p className="mt-1 font-poppins text-lg font-bold text-slate-900">
            Pakistan&apos;s highest-paying roles, according to actual submissions.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-400">
          Local PKR • min {MIN_SUBMISSIONS} submissions
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LeaderboardWindow
          title="Tech & Engineering"
          subtitle="Ranked by local PKR median salary"
          items={techRoles}
          minSamples={MIN_SUBMISSIONS}
        />

        <LeaderboardWindow
          title="Business & Corporate"
          subtitle="Ranked by local PKR median salary"
          items={bizRoles}
          minSamples={MIN_SUBMISSIONS}
        />
      </div>
    </section>
  );
}
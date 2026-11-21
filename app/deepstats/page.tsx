import { Suspense } from "react";
import { connection } from "next/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketSnapshot from "./components/MarketSnapshot";
import { supabase } from "@/lib/supabase";
import RoleLeaderboard from "./components/RoleLeaderboard";
import CityComparison from "./components/CityComparisons";
import ExperienceCurve from "./components/ExperienceCurve";

interface SalaryRow {
  industry: string;
  role: string;
  yoe: number;
  salary_amount: number;
  currency: string;
  work_model: string;
  city: string;
}

async function DeepStatsContent() {
  await connection();

  const { data } = await supabase
    .from("salary_records")
    .select("industry, role, yoe, salary_amount, currency, work_model, city")
    .eq("quality_status", "passed");

  let safeRows: SalaryRow[] = [];
  if (data) {
    safeRows = data as SalaryRow[];
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-20 sm:px-6 lg:px-8">
      <MarketSnapshot rows={safeRows} />
      <RoleLeaderboard rows={safeRows} />
      <CityComparison rows={safeRows} />
      <ExperienceCurve rows={safeRows} />
    </div>
  );
}

export default function DeepStatsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* Page Header (Prerenders instantly) */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
      
          <h1 className="mt-4 font-poppins text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pakistan Compensation DeepStats.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
            Cleaned, city-by-city and experience-level breakdowns across local PKR
            and foreign remote roles. 
          </p>
        </div>
      </section>

      {/* Dynamic Analytics Streamed Inside Suspense */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          </div>
        }
      >
        <DeepStatsContent />
      </Suspense>

      <Footer />
    </main>
  );
}
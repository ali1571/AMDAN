"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SalaryForm({ currentMedians = {} }: { currentMedians?: Record<string, number> }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<{ role: string; salary: number; median: number } | null>(null);

  const [formData, setFormData] = useState({
    industry: "Tech",
    role: "Backend Engineer",
    yoe: "",
    salary_amount: "",
    currency: "PKR",
    work_model: "On-site",
    city: "Lahore",
    company_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const { error } = await supabase.from("salary_records").insert([
      {
        industry: formData.industry,
        role: formData.role,
        yoe: parseFloat(formData.yoe),
        salary_amount: parseInt(formData.salary_amount),
        currency: formData.currency,
        work_model: formData.work_model,
        city: formData.city,
        company_name: formData.company_name || null,
      },
    ]);

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      // Grab the live median for their role. Fallback to 175k if the map is empty.
      const activeMedian = currentMedians[formData.role] || 175000;

      // Save the exact submission stats before transitioning the UI
      setSubmittedData({
        role: formData.role,
        salary: parseInt(formData.salary_amount),
        median: activeMedian,
      });
      
      setStatus("success");
    }
    setLoading(false);
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-sans text-slate-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const labelClass = "mb-1.5 ml-2 block text-xs font-semibold text-slate-500 uppercase tracking-wide";

  // 1. THE REALITY CHECK SUCCESS STATE
  if (status === "success" && submittedData) {
    
    // Start with default values of 0
    let diff = 0;
    let percentage = 0;

    // Only do the math if both salaries are in PKR
    if (formData.currency === "PKR") {
      diff = submittedData.salary - submittedData.median;
      percentage = Math.round((diff / submittedData.median) * 100);
    } else {
      diff = 0;
      percentage = 0;
    }

    const absDiff = Math.abs(percentage);
    const isLowballed = percentage < 0;

    // Decide the headline content using simple if / else
    let headlineContent;

    if (formData.currency !== "PKR") {
      headlineContent = (
        <>
          Foreign currency dropped.{" "}
          <span className="font-black text-emerald-600">Global remote flexing.</span>
        </>
      );
    } else if (isLowballed) {
      headlineContent = (
        <>
          You are making{" "}
          <span className="font-black text-rose-600">{absDiff}% less</span> than the local median.
        </>
      );
    } else if (percentage > 0) {
      headlineContent = (
        <>
          You are making{" "}
          <span className="font-black text-emerald-600">{absDiff}% more</span> than the local median.
        </>
      );
    } else {
      headlineContent = <>You are making exactly the local median.</>;
    }

    return (
      <div className="mx-auto max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div
          className={`relative overflow-hidden rounded-3xl border p-8 text-center shadow-2xl backdrop-blur-xl ${
            formData.currency === "PKR" && isLowballed
              ? "border-rose-100/50 bg-rose-50/30 shadow-rose-100/30"
              : "border-emerald-200/50 bg-emerald-50/90 shadow-emerald-200/50"
          }`}
        >
          <p className="mb-2 font-sans text-xs font-bold tracking-widest uppercase text-slate-500">
            Receipt Dropped
          </p>

          {/* Cleaned up heading rendering using the extracted variable */}
          <h3 className="font-poppins text-3xl font-bold leading-tight md:text-4xl text-slate-800">
            {headlineContent}
          </h3>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-slate-500">Your Pay</span>
              <span className="font-bold text-slate-800">
                {submittedData.salary.toLocaleString()} {formData.currency}
              </span>
            </div>
            <div className="h-10 w-px bg-slate-300"></div>
            <div className="flex flex-col items-start">
              <span className="text-slate-500">Market Median</span>
              <span className="font-bold text-slate-800">
                {submittedData.median.toLocaleString()} PKR
              </span>
            </div>
          </div>

          <p className="mt-8 font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
            {formData.currency === "PKR" && isLowballed
              ? "Screenshot this and send it to your manager."
              : "Screenshot this. You won the market."}
          </p>
        </div>

        <button
          onClick={() => {
            setStatus("idle");
            setFormData({ ...formData, salary_amount: "", company_name: "" });
          }}
          className="mt-6 w-full rounded-full bg-slate-900 px-4 py-3.5 font-sans text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-slate-800"
        >
          Close & View Ledger
        </button>
      </div>
    );
  }

  // 2. THE STANDARD FORM STATE
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Row 1: Role & YOE */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Role</label>
            <select required className={inputClass} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Fullstack Engineer">Fullstack Engineer</option>
              <option value="Mobile Engineer">Mobile Engineer</option>
              <option value="DevOps/SRE">DevOps / SRE</option>
              <option value="Data Scientist/Engineer">Data Scientist / Eng</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="System Administrator">System Administrator</option>
              <option value="IT Support">IT Support</option>
              <option value="Network Engineer">Network Engineer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Years of Exp</label>
            <input type="number" required step="0.1" min="0" max="50" placeholder="e.g. 2.5" className={inputClass} value={formData.yoe} onChange={(e) => setFormData({ ...formData, yoe: e.target.value })} />
          </div>
        </div>

        {/* Row 2: Salary, Currency, Work Model, City */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <label className={labelClass}>Salary</label>
            <input type="number" required min="1000" max="10000000" placeholder="e.g. 150000" className={inputClass} value={formData.salary_amount} onChange={(e) => setFormData({ ...formData, salary_amount: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select className={inputClass} value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <select className={inputClass} value={formData.work_model} onChange={(e) => setFormData({ ...formData, work_model: e.target.value })}>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={labelClass}>City</label>
            <select className={inputClass} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Faisalabad">Faisalabad</option>
              <option value="Peshawar">Peshawar</option>
              <option value="Remote/Global">Remote / Global</option>
            </select>
          </div>
        </div>

        {/* Row 3: Company & Submit */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className={labelClass}>Company (Optional)</label>
            <input type="text" maxLength={50} placeholder="Devsinc / Tkxel" className={inputClass} value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
            <p className="mt-1.5 text-xs text-slate-400 font-poppins text-left pl-1">
              Join devs from <span className="font-medium text-slate-500">Systems Limited, TCP, Axiom</span> who just dropped their receipts.
            </p>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto">
            {loading ? "Submitting..." : "Submit Anonymously"}
          </button>
        </div>

        {status === "error" && <p className="text-center text-xs font-medium text-red-600">Something went wrong. Try again.</p>}
      </form>
    </div>
  );
}
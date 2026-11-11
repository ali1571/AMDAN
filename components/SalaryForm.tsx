"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SalaryForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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
    // ... keep your existing handleSubmit logic exactly the same ...
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
      setStatus("success");
      setFormData({ ...formData, salary_amount: "", company_name: "" });
    }
    setLoading(false);
  };

  // Centralized input styling to prevent repetitive code and fix browser defaults
  const inputClass = "w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-sans text-slate-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const labelClass = "mb-1.5 ml-2 block text-xs font-semibold text-slate-500 uppercase tracking-wide";

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Row 1: Role & YOE */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Role</label>
            <select
              required
              className={inputClass}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Fullstack Engineer">Fullstack Engineer</option>
              <option value="Mobile Engineer">Mobile Engineer</option>
              <option value="DevOps/SRE">DevOps / SRE</option>
              <option value="Data Scientist/Engineer">Data Scientist / Eng</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Years of Exp</label>
            <input
              type="number"
              required step="0.1" min="0" max="50" placeholder="e.g. 2.5"
              className={inputClass}
              value={formData.yoe}
              onChange={(e) => setFormData({ ...formData, yoe: e.target.value })}
            />
          </div>
        </div>

        {/* Row 2: Salary, Currency, Work Model, City */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <label className={labelClass}>Salary</label>
            <input
              type="number"
              required min="1000" max="10000000" placeholder="e.g. 150000"
              className={inputClass}
              value={formData.salary_amount}
              onChange={(e) => setFormData({ ...formData, salary_amount: e.target.value })}
            />
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
              <option value="Remote/Global">Remote / Global</option>
            </select>
          </div>
        </div>

        {/* Row 3: Company & Submit */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className={labelClass}>Company (Optional)</label>
            <input
              type="text"
              maxLength={50}
              placeholder="Keep it brief"
              className={inputClass}
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Submitting..." : "Submit Anonymously"}
          </button>
        </div>

        {/* Status Messages */}
        <div className="h-4">
          {status === "success" && <p className="text-center text-xs font-medium text-emerald-600">Salary added successfully.</p>}
          {status === "error" && <p className="text-center text-xs font-medium text-red-600">Something went wrong. Try again.</p>}
        </div>
      </form>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { submitSalaryAction } from "../app/actions/submitSalary";
import { supabase } from "../lib/supabase";
import {
  VALID_ROLES,
  BIZ_ROLES,
  VALID_CURRENCIES,
  VALID_CITIES,
} from "../lib/constants";

interface SavedReceipt {
  role: string;
  salary: number;
  currency: string;
  median: number;
  city: string;
  yoe: string;
}

export default function SalaryForm({
  industry = "Tech",
  currentMedians = {},
}: {
  industry?: "Tech" | "Business";
  currentMedians?: Record<string, number>;
}) {
  const isBiz = industry === "Business";
  const rolesList = isBiz ? BIZ_ROLES : VALID_ROLES;
  const storageKey = `amdan_receipt_${industry.toLowerCase()}`;

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<SavedReceipt | null>(null);
  const [savedReceipt, setSavedReceipt] = useState<SavedReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState("Something went wrong. Try again.");

  // Missing role request state
  const [showRoleRequest, setShowRoleRequest] = useState(false);
  const [requestedRole, setRequestedRole] = useState("");
  const [roleRequestSent, setRoleRequestSent] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const [reviewFlags, setReviewFlags] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    role: rolesList[0] as string,
    yoe: "",
    salary_amount: "",
    currency: "PKR",
    work_model: "On-site",
    city: "Lahore",
    company_name: "",
  });

  // Load any previously saved receipt from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setSavedReceipt(JSON.parse(raw));
      }
    } catch {
      // Ignore storage access errors
    }
  }, [storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const res = await submitSalaryAction({
      ...formData,
      industry,
    });

    if (!res.success) {
      if (res.error === "chill") {
        setErrorMsg("Whoa, slow down. Wait 5 minutes before dropping another receipt.");
      } else {
        setErrorMsg("Error: " + res.error);
      }
      setStatus("error");
    } else {
      // Save any flags returned by the server
      if (res.flags && res.flags.length > 0) {
        setReviewFlags(res.flags);
      } else {
        setReviewFlags([]);
      }

      const { data: medianData } = await supabase.rpc("get_market_medians", {
        role_filter: formData.role,
        industry_filter: industry,
      });

      const result = Array.isArray(medianData) ? medianData[0] : medianData;
      const liveMedian =
        result?.local_median ||
        currentMedians[formData.role] ||
        parseInt(formData.salary_amount, 10);

      const receiptPayload: SavedReceipt = {
        role: formData.role,
        salary: parseInt(formData.salary_amount, 10),
        currency: formData.currency,
        median: liveMedian,
        city: formData.city,
        yoe: formData.yoe,
      };

      setSubmittedData(receiptPayload);

      // Only save to localStorage banner if it passed immediately
      if (res.qualityStatus !== "flagged") {
        setSavedReceipt(receiptPayload);
        try {
          localStorage.setItem(storageKey, JSON.stringify(receiptPayload));
        } catch {
          // Ignore storage quota errors
        }
      }

      setStatus("success");
    }
    setLoading(false);
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current || !submittedData) return;
    setDownloading(true);
    try {
      const isLowballed =
        submittedData.currency === "PKR" &&
        submittedData.median > 0 &&
        submittedData.salary < submittedData.median;

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: isLowballed ? "#fff1f2" : "#ecfdf5",
      });

      const link = document.createElement("a");
      const slug = submittedData.role.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      link.download = `amdan-${slug}-receipt.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleRoleRequest = async () => {
    const cleanRole = requestedRole.trim();
    if (!cleanRole) return;

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "6e591c11-7a81-49be-9161-82f25b97738b",
        subject: `[AMDAN ${industry}] Missing Role: ${cleanRole}`,
        from_name: "AMDAN Ledger",
        role: cleanRole,
        industry,
      }),
    });

    setRequestedRole("");
    setRoleRequestSent(true);
    setTimeout(() => {
      setRoleRequestSent(false);
      setShowRoleRequest(false);
    }, 2200);
  };

  const inputClass =
    "w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-sans text-slate-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const labelClass =
    "mb-1.5 ml-2 block text-xs font-semibold text-slate-500 uppercase tracking-wide";

  // 1. THE REALITY CHECK SUCCESS STATE
  if (status === "success" && submittedData) {

    const isUnderReview = reviewFlags.length > 0;

    let reviewMessage =
      "Your submission was held for a quick quality review before appearing in the public ledger.";

    for (let i = 0; i < reviewFlags.length; i++) {
      if (reviewFlags[i] === "possible_duplicate") {
        reviewMessage =
          "Possible Duplicate entry detected, submitted but not currently displayed in the ledger";
      } else if (reviewFlags[i] === "possible_resubmission") {
        reviewMessage =
          "Recent resubmission detected, submitted but not currently displayed in the ledger";
      } else if (reviewFlags[i] === "high_ip_velocity") {
        reviewMessage =
          "Multiple submissions detected from your network today, held for manual check.";
      }
    }


    let diff = 0;
    let percentage = 0;

    if (submittedData.currency === "PKR" && submittedData.median > 0) {
      diff = submittedData.salary - submittedData.median;
      percentage = Math.round((diff / submittedData.median) * 100);
    }

    const absDiff = Math.abs(percentage);
    const isLowballed = percentage < 0;

    let headlineContent;

    if (submittedData.currency !== "PKR") {
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
        {isUnderReview && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-left text-xs text-amber-900 shadow-sm">
            <p className="font-semibold uppercase tracking-wide text-amber-800">
              Submitted but under review
            </p>
            <p className="mt-1 leading-relaxed text-amber-700">{reviewMessage}</p>
          </div>
        )}
        <div
          ref={cardRef}
          className={`relative overflow-hidden rounded-3xl border p-8 text-center shadow-2xl backdrop-blur-xl ${
            submittedData.currency === "PKR" && isLowballed
              ? "border-rose-200/70 bg-rose-50/90 shadow-rose-100/30"
              : "border-emerald-200/70 bg-emerald-50/95 shadow-emerald-200/50"
          }`}
        >
          <p className="mb-1 font-sans text-xs font-bold tracking-widest uppercase text-slate-500">
            Receipt Dropped • {submittedData.role}
          </p>
          <p className="mb-4 font-mono text-[11px] text-slate-400">
            {submittedData.city} {submittedData.yoe ? `• ${submittedData.yoe} YOE` : ""}
          </p>

          <h3 className="font-poppins text-3xl font-bold leading-tight md:text-4xl text-slate-800">
            {headlineContent}
          </h3>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-slate-500">Your Pay</span>
              <span className="font-bold text-slate-800">
                {submittedData.salary.toLocaleString()} {submittedData.currency}
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
            {submittedData.currency === "PKR" && isLowballed
              ? "Screenshot this and send it to your manager."
              : "Screenshot this. You won the market."}
          </p>

          <p className="mt-3 font-mono text-[10px] tracking-widest uppercase text-slate-400">
            amdanpk.vercel.app
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={downloading}
            className="flex-1 rounded-full bg-emerald-600 px-5 py-3.5 font-sans text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-emerald-700 disabled:opacity-50"
          >
            {downloading ? "Saving PNG..." : "Download Share Card"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFormData({ ...formData, salary_amount: "", company_name: "" });
            }}
            className="flex-1 rounded-full bg-slate-900 px-5 py-3.5 font-sans text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-slate-800"
          >
            Close &amp; View Ledger
          </button>
          
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
            Built solo by <span className="font-semibold text-slate-700">Ali</span> — follow data breakdowns on{" "}
            <a
              href="https://dub.sh/GolOWId"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-600 hover:underline"
            >
              X (@QWERTS1571)
            </a>{" "}
            or{" "}
            <a
              href="https://dub.sh/LRMWDX4"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-600 hover:underline"
            >
              LinkedIn
            </a>
            .
          </p>
      </div>
    );
  }

  // 2. THE STANDARD FORM STATE
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {/* Reopen Saved Receipt Banner */}
      {savedReceipt && (
        <div className="flex items-center justify-between rounded-full border border-emerald-200/80 bg-emerald-50/90 px-5 py-2 text-xs text-emerald-950 shadow-sm backdrop-blur-md">
          <span>
            Saved receipt: <strong>{savedReceipt.role}</strong> ({savedReceipt.salary.toLocaleString()}{" "}
            {savedReceipt.currency})
          </span>
          <button
            type="button"
            onClick={() => {
              setSubmittedData(savedReceipt);
              setStatus("success");
            }}
            className="font-semibold text-emerald-700 hover:underline"
          >
            View Share Card →
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Role & YOE */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between px-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Role
                </label>
                <button
                  type="button"
                  onClick={() => setShowRoleRequest((prev) => !prev)}
                  className="text-[11px] font-medium text-emerald-600 hover:underline"
                >
                  {showRoleRequest ? "Cancel" : "+ Missing role?"}
                </button>
              </div>
              <select
                required
                className={inputClass}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {rolesList.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <p className="mt-1 pl-2 text-[11px] text-slate-400">
                Pick your official company title, even if you wear multiple hats.
              </p>

              {showRoleRequest && (
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm">
                  {roleRequestSent ? (
                    <span className="px-2 text-xs font-medium text-emerald-700">
                      Requested! We&apos;ll review and add it soon.
                    </span>
                  ) : (
                    <>
                      <input
                        type="text"
                        maxLength={45}
                        value={requestedRole}
                        onChange={(e) => setRequestedRole(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleRoleRequest();
                          }
                        }}
                        placeholder="e.g. Solutions Architect"
                        className="w-full rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleRoleRequest}
                        className="whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Send
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Years of Exp</label>
              <input
                type="number"
                required
                step="0.1"
                min="0"
                max="40"
                placeholder="e.g. 2.5"
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
                required
                min="1000"
                max="10000000"
                placeholder="e.g. 150000"
                className={inputClass}
                value={formData.salary_amount}
                onChange={(e) => setFormData({ ...formData, salary_amount: e.target.value })}
              />
              <p className="mt-1 pl-2 text-[11px] leading-snug text-slate-400">
                Enter Monthly Gross Salary.
              </p>
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select
                className={inputClass}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                {VALID_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Model</label>
              <select
                className={inputClass}
                value={formData.work_model}
                onChange={(e) => setFormData({ ...formData, work_model: e.target.value })}
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>City</label>
              <select
                className={inputClass}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                {VALID_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
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
                placeholder={isBiz ? "Unilever / Daraz / HBL" : "Devsinc / Tkxel"}
                className={inputClass}
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
              <p className="mt-1.5 text-xs text-slate-400 font-poppins text-left pl-1">
                {isBiz ? (
                  <>
                    Help bring transparency to{" "}
                    <span className="font-medium text-slate-500">corporate, banking &amp; SME</span>{" "}
                    pay across Pakistan.
                  </>
                ) : (
                  <>
                    Join devs from{" "}
                    <span className="font-medium text-slate-500">Systems Limited, TCP, Axiom</span>{" "}
                    who just dropped their receipts.
                  </>
                )}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
            >
              {loading ? "Submitting..." : "Submit Anonymously"}
            </button>
          </div>

          {status === "error" && (
            <p className="text-center text-xs font-medium text-red-600">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SubmissionCounter({
  industry = "Tech",
}: {
  industry?: "Tech" | "Business";
}) {
  const [count, setCount] = useState<number | null>(null);
  const isBiz = industry === "Business";

  useEffect(() => {
    async function fetchCount() {
      const { count, error } = await supabase
        .from("salary_records")
        .select("*", { count: "exact", head: true })
        .eq("industry", industry);

      if (!error && count !== null) {
        setCount(count);
      }
    }

    fetchCount();
  }, [industry]);

  if (count === null || count === 0) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>

      <p className="font-sans text-xs font-light text-slate-500 tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        Tracked{" "}
        <span className="font-oswald text-base font-medium tracking-tight text-emerald-600 px-1">
          {count}
        </span>{" "}
        anonymous {isBiz ? "corporate" : "tech"} salary receipts across Pakistan.
      </p>
    </div>
  );
}
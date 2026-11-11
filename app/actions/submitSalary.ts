"use server";

import { headers } from "next/headers";
import { supabase } from "../../lib/supabase"; // Stepping up two directories

const rateLimitMap = new Map<string, number>();

export async function submitSalaryAction(formData: any) {
  // Await the headers object (Next.js 15 requirement)
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown_ip";
  
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;

  if (rateLimitMap.has(ip)) {
    const lastSubmission = rateLimitMap.get(ip)!;
    if (now - lastSubmission < windowMs) {
      return { success: false, error: "chill" };
    }
  }

  rateLimitMap.set(ip, now);

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
      ip_address: ip,
    },
  ]);

  if (error) {
    return { success: false, error: "supabase_error" };
  }

  return { success: true };
}
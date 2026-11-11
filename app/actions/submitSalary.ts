"use server";

import { headers } from "next/headers";
import { supabase } from "../../lib/supabase";
import { VALID_ROLES, VALID_CURRENCIES, VALID_WORK_MODELS, VALID_CITIES } from "../../lib/constants";

const rateLimitMap = new Map<string, number>();

export async function submitSalaryAction(formData: any) {
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

  // --- STRICT SERVER-SIDE VALIDATION ---
  if (!VALID_ROLES.includes(formData.role)) {
    return { success: false, error: "invalid_role" };
  }
  if (!VALID_CURRENCIES.includes(formData.currency)) {
    return { success: false, error: "invalid_currency" };
  }
  if (!VALID_WORK_MODELS.includes(formData.work_model)) {
    return { success: false, error: "invalid_work_model" };
  }
  if (!VALID_CITIES.includes(formData.city)) {
    return { success: false, error: "invalid_city" };
  }

  // Validate numbers (ensure YOE and salary are actual numbers within realistic bounds)
  const yoe = parseFloat(formData.yoe);
  const salaryAmount = parseInt(formData.salary_amount);

  if (isNaN(yoe) || yoe < 0 || yoe > 40) {
    return { success: false, error: "invalid_yoe" };
  }
  if (isNaN(salaryAmount) || salaryAmount <= 0 || salaryAmount > 100000000) {
    return { success: false, error: "invalid_salary" };
  }
  // -------------------------------------

  rateLimitMap.set(ip, now);

  const { error } = await supabase.from("salary_records").insert([
    {
      industry: formData.industry,
      role: formData.role,
      yoe: yoe,
      salary_amount: salaryAmount,
      currency: formData.currency,
      work_model: formData.work_model,
      city: formData.city,
      company_name: formData.company_name ? formData.company_name.slice(0, 50) : null, // sanitize length
      ip_address: ip,
    },
  ]);

  if (error) {
    return { success: false, error: "supabase_error" };
  }

  return { success: true };
}
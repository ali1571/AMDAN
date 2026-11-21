"use server";

import { headers } from "next/headers";
import { supabase } from "../../lib/supabase";
import {
  VALID_INDUSTRIES,
  VALID_ROLES,
  BIZ_ROLES,
  VALID_CURRENCIES,
  VALID_WORK_MODELS,
  VALID_CITIES,
} from "../../lib/constants";


const rateLimitMap = new Map<string, number>();

export async function submitSalaryAction(formData: Record<string, unknown>) {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown_ip";

  const now = Date.now();
  const windowMs = 5 * 60 * 1000;

  // Prune expired entries to prevent unbounded memory growth
  for (const [key, timestamp] of rateLimitMap.entries()) {
    if (now - timestamp >= windowMs) rateLimitMap.delete(key);
  }

  if (rateLimitMap.has(ip)) {
    const lastSubmission = rateLimitMap.get(ip)!;
    if (now - lastSubmission < windowMs) {
      return { success: false, error: "chill" };
    }
  }

  // --- STRICT SERVER-SIDE VALIDATION ---
  const industry = typeof formData.industry === "string" ? formData.industry : "Tech";
  if (!VALID_INDUSTRIES.includes(industry as (typeof VALID_INDUSTRIES)[number])) {
    return { success: false, error: "invalid_industry" };
  }

  const allowedRoles: readonly string[] =
    industry === "Business" ? BIZ_ROLES : VALID_ROLES;

  if (typeof formData.role !== "string" || !allowedRoles.includes(formData.role)) {
    return { success: false, error: "invalid_role" };
  }
  if (
    typeof formData.currency !== "string" ||
    !VALID_CURRENCIES.includes(formData.currency as (typeof VALID_CURRENCIES)[number])
  ) {
    return { success: false, error: "invalid_currency" };
  }
  if (
    typeof formData.work_model !== "string" ||
    !VALID_WORK_MODELS.includes(formData.work_model as (typeof VALID_WORK_MODELS)[number])
  ) {
    return { success: false, error: "invalid_work_model" };
  }
  if (
    typeof formData.city !== "string" ||
    !VALID_CITIES.includes(formData.city as (typeof VALID_CITIES)[number])
  ) {
    return { success: false, error: "invalid_city" };
  }

  // Strict numeric parsing (aligned with frontend min/max)
  const yoe = Number(formData.yoe);
  const salaryAmount = Number(formData.salary_amount);

  if (!Number.isFinite(yoe) || yoe < 0 || yoe > 40) {
    return { success: false, error: "invalid_yoe" };
  }
  if (
    !Number.isInteger(salaryAmount) ||
    salaryAmount < 1000 ||
    salaryAmount > 10000000
  ) {
    return { success: false, error: "invalid_salary" };
  }

  const cleanCompany =
    typeof formData.company_name === "string" && formData.company_name.trim().length > 0
      ? formData.company_name.trim().slice(0, 50)
      : null;

  rateLimitMap.set(ip, now);


  const flags : string[] = []; //stores warning flags
  
  if (ip !== "unknown_ip"){ // runs only if we actually catch an IP
    const oneMinute = 60 *1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;

    const thirtyDaysAgo = new Date(now - 30 * oneDay).toISOString();
    const twentyFourHoursAgoMs = now - oneDay;
    const fifteenMinsAgoMs = now - 15 * oneMinute;


    const { data: recentIpRows} = await supabase // fetch past submission of this ip
      .from("salary_records")
      .select("industry, role, yoe, salary_amount, currency, work_model, city, created_at")
      .eq("ip_address", ip)
      .gte("created_at", thirtyDaysAgo);

    if (recentIpRows && recentIpRows.length >0){
      let foundExactDuplicate = false;
      let foundQuickCorrection = false;
      let countInLast24Hours = 0;

      for (let i = 0; i <recentIpRows.length; i ++) { 
        const oldRow = recentIpRows[i];
        const oldTimeMs = new Date(oldRow.created_at).getTime();
        if (oldTimeMs >= twentyFourHoursAgoMs) {
          countInLast24Hours += 1;
        }

        //check if every core field matches old submission
        const sameIndustry = oldRow.industry ===industry;
        const sameRole = oldRow.role === formData.role;
        const sameYoe = Number(oldRow.yoe) === yoe;
        const sameSalary = Number(oldRow.salary_amount) === salaryAmount;
        const sameCurrency = oldRow.currency === formData.currency;
        const sameModel = oldRow.work_model === formData.work_model;
        const sameCity = oldRow.city === formData.city;

        if (
        sameIndustry &&
        sameRole &&
        sameYoe &&
        sameSalary &&
        sameCurrency &&
        sameModel &&
        sameCity
        ) {
        foundExactDuplicate =true;
      }

      // check if they submitted same role/city/yoe within 15min, likely typo fix.

      if (
        oldTimeMs >= fifteenMinsAgoMs &&
        sameIndustry &&
        sameRole &&
        sameYoe &&
        sameCity &&
        sameCurrency &&
        sameModel
      ) {
        foundQuickCorrection = true;
      }
    }  
    
      //add right flags
    if (foundExactDuplicate){
      flags.push("possible_duplicate");

    }else if (foundQuickCorrection){
      flags.push("possible_resubmission");
    }

    if (countInLast24Hours >= 3){
      flags.push( "high_ip_velocity");

    }  
  }
}

  // Decide the final status
let qualityStatus = "passed";
if (flags.length > 0) {
  qualityStatus = "flagged";
}





  const { error } = await supabase.from("salary_records").insert([
    {
      industry: industry,
      role: formData.role,
      yoe: yoe,
      salary_amount: salaryAmount,
      currency: formData.currency,
      work_model: formData.work_model,
      city: formData.city,
      company_name: cleanCompany,
      ip_address: ip,
      quality_status: qualityStatus,
      quality_flags: flags,
    },
  ]);

  if (error) {
    rateLimitMap.delete(ip); // Don't penalize user if DB insert failed
    return { success: false, error: "supabase_error" };
  }

  return { 
    success: true,
    qualityStatus : qualityStatus,
    flags : flags,
   };
}
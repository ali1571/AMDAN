export const VALID_ROLES = [
  "Backend Engineer",
  "Frontend Engineer",
  "Fullstack Engineer",
  "Mobile Engineer",
  "Product Manager",
  "AI engineer",
  "UI/UX Designer",
  "Data Scientist/Engineer",
  "DevOps/SRE",
  "QA Engineer",
  "Embedded Engineer",
  "System Administrator", // New
  "IT Support",           // New
  "Network Engineer",     // New
  "Blockchain Engineer",
  "Game Developer",
  "MarTech Engineer",
] as const;


export const BIZ_ROLES = [
  "Business Development",
  "Sales Executive",
  "Account Manager",
  "HR / Recruiter",
  "Finance / Accounting",
  "Financial Analyst",
  "Tax / Audit",
  "Supply Chain",
  "Operations Manager",
  "Project Manager",
  "Digital Marketing",
  "Brand Manager",
  "Business Analyst",
  "SQ",
  "Customer Support",
  "Virtual Assistant",
] as const;

export const VALID_CURRENCIES = ["PKR", "USD", "CAD", "EUR", "GBP", "AUD"] as const;
export const VALID_WORK_MODELS = ["On-site", "Hybrid", "Remote"] as const;
export const VALID_CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Peshawar", "Remote"] as const;
export const VALID_INDUSTRIES = ["Tech", "Business"] as const;
export type IndustryVertical = (typeof VALID_INDUSTRIES)[number];
"use client";

import { useState } from "react";
import MarketMedians from "./MarketMedians";
import SalaryFeed from "./SalaryFeed";

export default function SalaryDashboard({
  industry = "Tech",
}: {
  industry?: "Tech" | "Business";
}) {
  const [selectedRole, setSelectedRole] = useState<string>("All");

  return (
    <>
      <MarketMedians
        industry={industry}
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
      />
      <SalaryFeed
        industry={industry}
        selectedRole={selectedRole}
        onClearRole={() => setSelectedRole("All")}
      />
    </>
  );
}
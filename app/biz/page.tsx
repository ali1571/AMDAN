import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SalaryForm from "@/components/SalaryForm";
import LiveTicker from "@/components/LiveTicker";

import Footer from "@/components/Footer";
import SalaryDashboard from "@/components/SalaryDashboard";

export default function BizPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Hero industry="Business" />

      <div className="relative z-10 -mt-2">
        <SalaryForm industry="Business" />
      </div>

      <LiveTicker industry="Business" />
      <SalaryDashboard industry="Business"/>

      <Footer />
    </main>
  );
}
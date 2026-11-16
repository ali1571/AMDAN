import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SalaryForm from "@/components/SalaryForm";
import LiveTicker from "@/components/LiveTicker";
import SalaryDashboard from "@/components/SalaryDashboard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Hero industry="Tech" />

      <div className="relative z-10 -mt-2">
        <SalaryForm industry="Tech" />
      </div>

      <LiveTicker industry="Tech" />
      <SalaryDashboard industry="Tech" />

      <Footer />
    </main>
  );
}
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SalaryForm from "@/components/SalaryForm";
import LiveTicker from "@/components/LiveTicker"; // <-- Ticker spins right here
import MarketMedians from "@/components/MarketMedians"; // <-- Interactive boxes
import SalaryFeed from "@/components/SalaryFeed"; // <-- The receipt ledger
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Hero />
      
      <div className="relative z-10 -mt-2">
        <SalaryForm />
      </div>

      <LiveTicker />
      <MarketMedians /> 
      <SalaryFeed />
      
      <Footer />
    </main>
  );
}
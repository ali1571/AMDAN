import SubmissionCounter from "./SubmissionCounter";

export default function Hero() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 pt-16 pb-8 text-center sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-slate-50/10 to-transparent blur-2xl"></div>
      
      <h1 className="font-oswald text-5xl font-medium uppercase tracking-tight text-slate-900 sm:text-6xl">
        Stop getting <span className="font-playfair italic text-emerald-600 lowercase tracking-normal">lowballed.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 leading-relaxed font-light">
        Anonymous tech salary drops in Pakistan. Share your receipt, check the market, and get what you're actually owed.
      </p>

      <SubmissionCounter />
    </div>
  );
}
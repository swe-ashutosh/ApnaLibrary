import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import Link from "next/link";

export default function FeesPage() {
  const plans = [
    {
      name: "Half Shift",
      price: "800",
      hours: "6 Hours",
      features: ["High Speed WiFi", "Personal Cabin", "Power Backup"],
      popular: false,
    },
    {
      name: "Full Shift",
      price: "1500",
      hours: "12 Hours",
      features: ["All Half Shift features", "Locker Facility", "Tea/Coffee Access"],
      popular: true,
    },
    {
      name: "24/7 Access",
      price: "2500",
      hours: "Unlimited",
      features: ["Dedicated Fixed Seat", "Premium Ergonomic Chair", "Night Access"],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <div className="flex-grow pt-20 px-4 md:px-20 max-w-7xl mx-auto w-full mb-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mt-8 md:mt-10 mb-4">
          Subscription <span className="text-brandPurple">Plans</span>
        </h1>
        <p className="text-gray-400 text-center text-sm mb-10 md:mb-16">
          Choose the plan that fits your study routine
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-8 md:p-10 flex flex-col hover:scale-105 transition-transform relative ${plan.popular ? "border-brandPurple/50 shadow-lg shadow-purple-500/10" : "border-white/10"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-gradient px-4 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-300">{plan.name}</h3>
              <div className="my-6">
                <span className="text-4xl font-black text-white">₹{plan.price}</span>
                <span className="text-gray-500"> /month</span>
              </div>
              <p className="text-brandPurple text-sm font-bold mb-6 italic">{plan.hours}</p>
              <ul className="space-y-4 flex-grow mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-gray-400">
                    <Check size={16} className="text-brandNeon flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="w-full bg-purple-gradient py-3 rounded-xl font-bold hover:opacity-90 transition-opacity text-center block"
              >
                Select Plan
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

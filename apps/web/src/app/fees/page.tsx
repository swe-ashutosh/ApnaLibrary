import Footer from "@/components/Footer";
import { Check } from "lucide-react";

export default function FeesPage() {
  const plans = [
    {
      name: "Half Shift",
      price: "800",
      hours: "6 Hours",
      features: ["High Speed WiFi", "Personal Cabin", "Power Backup"],
    },
    {
      name: "Full Shift",
      price: "1500",
      hours: "12 Hours",
      features: [
        "All Half Shift features",
        "Locker Facility",
        "Tea/Coffee Access",
      ],
    },
    {
      name: "24/7 Access",
      price: "2500",
      hours: "Unlimited",
      features: [
        "Dedicated Fixed Seat",
        "Premium Ergonomic Chair",
        "Night Access",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-20 px-6 md:px-20 max-w-7xl mx-auto w-full mb-20">
        <h1 className="text-4xl font-bold text-center mt-10 mb-16">
          Subscription <span className="text-brandPurple">Plans</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="glass-card p-10 flex flex-col border-white/10 hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-bold text-gray-300">{plan.name}</h3>
              <div className="my-6">
                <span className="text-4xl font-black text-white">
                  ₹{plan.price}
                </span>
                <span className="text-gray-500"> /month</span>
              </div>
              <p className="text-brandPurple text-sm font-bold mb-6 italic">
                {plan.hours}
              </p>
              <ul className="space-y-4 flex-grow mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-gray-400">
                    <Check size={16} className="text-brandNeon" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-purple-gradient py-3 rounded-xl font-bold hover:opacity-90">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

import Footer from "@/components/Footer";
import { Target, Users, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <div className="flex-grow pt-20 px-4 md:px-20 max-w-7xl mx-auto w-full">
        <section className="py-10 md:py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-purple-gradient mb-4 md:mb-6">
            Our Mission
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            We provide more than just a desk. We provide an ecosystem designed
            for high-performance students and future civil servants.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-20">
          <AboutCard
            icon={<Target className="text-brandPurple" />}
            title="Focus"
            desc="Zero noise and ergonomic seating to ensure 10+ hours of productivity."
          />
          <AboutCard
            icon={<Users className="text-brandPurple" />}
            title="Community"
            desc="Surround yourself with like-minded aspirants preparing for UPSC, JEE, and SSC."
          />
          <AboutCard
            icon={<Trophy className="text-brandPurple" />}
            title="Success"
            desc="Our alumni have cracked some of the toughest exams in India."
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function AboutCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="glass-card p-6 md:p-8 border-white/5 hover:border-brandPurple/50 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}

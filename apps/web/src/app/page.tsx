"use client";
import React, { useState, useEffect } from "react";
import { Shield, Zap, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// At the top of page.tsx
import Footer from "@/components/Footer";

const images = [
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200", // Library 1
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200", // Library 2
  "https://images.unsplash.com/photo-1507730997172-205a2bc777e4?auto=format&fit=crop&q=80&w=1200", // Library 3
  "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1200", // Library 4
];

export default function Home() {
  const [index, setIndex] = useState(0);

  // Auto-move every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* --- HERO SECTION & CAROUSEL --- */}
      <section className="pt-32 md:pt-48 px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[90vh]">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Focus Like a <br />
            <span className="bg-clip-text text-transparent bg-purple-gradient">
              Professional.
            </span>
          </h1>
          <p className="mt-6 text-gray-400 text-lg max-w-md">
            The ultimate study space for serious aspirants. Premium cabins,
            high-speed internet, and a community of toppers.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="bg-purple-gradient px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
              Book a Seat
            </button>
            <button className="glass-card px-8 py-4 rounded-xl font-bold border-borderGlass hover:bg-white/5 transition-colors">
              View Fees
            </button>
          </div>
        </div>

        {/* CAROUSEL BOX */}
        <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden glass-card p-2">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover rounded-2xl"
            />
          </AnimatePresence>
          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-brandPurple" : "w-2 bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* --- FEATURES SECTION --- */}
      <section className="px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-brandPurple">Apna Library?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Shield className="text-brandPurple" />}
            title="Safe & Secure"
            desc="24/7 CCTV surveillance and verified entry for all students."
          />
          <FeatureCard
            icon={<Zap className="text-brandPurple" />}
            title="High Speed"
            desc="Fiber-optic internet to stream 4K lectures without lag."
          />
          <FeatureCard
            icon={<Clock className="text-brandPurple" />}
            title="Flexible"
            desc="Multiple shifts and 24/7 access to suit your study routine."
          />
        </div>
      </section>
      {/* --- CTA SECTION --- */}
      <section className="mx-6 md:mx-20 py-16 glass-card text-center flex flex-col items-center">
        <h2 className="text-4xl font-bold">Ready to boost your score?</h2>
        <p className="text-gray-400 mt-4 mb-8">
          Join 500+ students already studying at Apna Library.
        </p>
        <button className="bg-purple-gradient px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-purple-500/20">
          Join Now
        </button>
      </section>
      <Footer />
    </div>
  );

  // Sub-component for Features
  function FeatureCard({
    icon,
    title,
    desc,
  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
  }) {
    return (
      <div className="glass-card p-8 hover:border-brandPurple transition-colors group">
        <div className="mb-4 bg-white/5 w-fit p-3 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
      // At the bottom inside the main <div>
    );
  }
}

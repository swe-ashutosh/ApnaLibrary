"use client";
import React, { useState, useEffect } from "react";
import { Shield, Zap, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";

const images = [
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1507730997172-205a2bc777e4?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1200",
];

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
  );
}

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-20 pb-20 page-transition">
      {/* --- HERO SECTION & CAROUSEL --- */}
      <section className="pt-24 md:pt-40 px-4 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center min-h-[70vh] md:min-h-[90vh]">
        <div>
          <h1 className="text-4xl md:text-7xl font-bold leading-tight">
            Focus Like a <br />
            <span className="bg-clip-text text-transparent bg-purple-gradient">
              Professional.
            </span>
          </h1>
          <p className="mt-4 md:mt-6 text-gray-400 text-base md:text-lg max-w-md">
            The ultimate study space for serious aspirants. Premium cabins,
            high-speed internet, and a community of toppers.
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="bg-purple-gradient px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform text-center"
            >
              Book a Seat
            </Link>
            <Link
              href="/fees"
              className="glass-card px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors text-center"
            >
              View Fees
            </Link>
          </div>
        </div>

        {/* CAROUSEL BOX */}
        <div className="relative h-[250px] sm:h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden glass-card p-2">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              alt={`Library space ${index + 1}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover rounded-2xl"
            />
          </AnimatePresence>
          {/* Dots Indicator */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === index ? "w-8 bg-brandPurple" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="px-4 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {[
            { value: "500+", label: "Active Students" },
            { value: "24/7", label: "Access Available" },
            { value: "100+", label: "Premium Seats" },
            { value: "4.9★", label: "Student Rating" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 md:p-6 text-center">
              <p className="text-2xl md:text-3xl font-black text-brandPurple">{stat.value}</p>
              <p className="text-gray-400 text-xs md:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="px-4 md:px-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Why Choose <span className="text-brandPurple">Apna Library?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
      <section className="mx-4 md:mx-20 py-12 md:py-16 glass-card text-center flex flex-col items-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to boost your score?</h2>
        <p className="text-gray-400 mt-4 mb-6 md:mb-8 text-sm md:text-base">
          Join 500+ students already studying at Apna Library.
        </p>
        <Link
          href="/signup"
          className="bg-purple-gradient px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
        >
          Join Now
        </Link>
      </section>

      <Footer />
    </div>
  );
}

"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, connect to an email API like Resend or EmailJS
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <div className="flex-grow pt-24 md:pt-32 px-4 md:px-6 flex justify-center items-start md:items-center">
        <div className="glass-card p-6 md:p-10 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Get in <span className="text-brandPurple">Touch</span>
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Have questions? Our team is here to help you find the perfect study spot.
            </p>
            <div className="space-y-4 text-sm text-gray-300">
              <p>📍 New Colony, Robertsganj, Sonbhadra, UP</p>
              <p>📞 +91 9519498159</p>
              <p>✉️ support@apnalibrary.com</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {sent && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">
                ✓ Message sent! We&apos;ll get back to you soon.
              </div>
            )}
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
              required
            />
            <textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple h-32 resize-none transition-all"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-purple-gradient py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

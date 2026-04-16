"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Course Info

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center px-6 py-12 md:pt-32">
        <div className="glass-card w-full max-w-xl p-8 md:p-10 shadow-2xl shadow-purple-500/10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-purple-gradient">
              Student Registration
            </h1>
            <p className="text-gray-400 mt-2">
              Join Apna Library community today
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            <div
              className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-brandPurple" : "bg-white/10"}`}
            ></div>
            <div
              className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-brandPurple" : "bg-white/10"}`}
            ></div>
          </div>

          <form className="space-y-5">
            {step === 1 ? (
              <>
                {/* Step 1: Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brandPurple outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Your Mobile
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brandPurple outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Parents Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="For attendance alerts"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brandPurple outline-none transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  Next Step
                </button>
              </>
            ) : (
              <>
                {/* Step 2: Education */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Current Course / Exam
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPSC, SSC, JEE"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brandPurple outline-none transition-all"
                  />
                </div>

                <div className="p-4 rounded-xl bg-brandPurple/10 border border-brandPurple/20 text-sm text-brandPurple">
                  Note: After submission, your profile will be sent to the
                  **Admin** for approval. You can login only after approval.
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 glass-card py-4 rounded-xl font-bold text-gray-400"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-2 bg-purple-gradient py-4 rounded-xl font-bold text-lg px-10"
                  >
                    Request Access
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Google Auth Option */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0B0E14] px-2 text-gray-500">
                Fast track with
              </span>
            </div>
          </div>

          <button className="w-full glass-card py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors border-white/10">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            <span>Signup with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

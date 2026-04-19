"use client";
import React, { useState } from "react";
import { supabase, API_URL } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    parentMobile: "",
    course: "",
  });

  // Validate step 1 fields before moving to step 2
  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError("Full Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      setError("Valid mobile number is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course.trim()) {
      setError("Course/Exam is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step A: Create User in Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (authError) throw authError;

      if (authData.user) {
        // Step B: Send Profile Data to Hono API (Cloudflare D1)
        const response = await fetch(`${API_URL}/api/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authData.user.id,
            full_name: formData.fullName,
            mobile_number: formData.mobile,
            parent_mobile: formData.parentMobile || null,
            course: formData.course,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || `API Error: ${response.status}`);
        }
        if (result.success) {
          router.push("/login");
          // Small delay to let the router start navigating
          setTimeout(() => {
            alert("✅ Request Sent! Please wait for Admin Approval before logging in.");
          }, 100);
        } else {
          throw new Error(result.error || "Unknown error during signup");
        }
      }
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-white page-transition">
      <div className="flex-grow flex items-center justify-center px-4 md:px-6 py-8 pt-20 md:pt-32">
        <div className="glass-card w-full max-w-xl p-6 md:p-10 shadow-2xl border border-white/10 rounded-[24px] md:rounded-[32px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-purple-gradient">
              Student Registration
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Join Apna Library community today
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-6">
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                step >= 1 ? "bg-brandPurple" : "bg-white/10"
              }`}
            ></div>
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                step >= 2 ? "bg-brandPurple" : "bg-white/10"
              }`}
            ></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Your Mobile *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                      Parent&apos;s Mobile
                    </label>
                    <input
                      type="tel"
                      placeholder="For attendance alerts"
                      value={formData.parentMobile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentMobile: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  Next Step →
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                    Course / Exam Preparing For *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPSC, SSC, JEE, NEET"
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple transition-all"
                  />
                </div>

                <div className="p-4 rounded-xl bg-brandPurple/10 border border-brandPurple/20 text-sm text-brandPurple">
                  📋 After submission, your profile will be sent to the Admin
                  for approval. You can login only after approval.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  {loading ? "Processing..." : "✓ Request Access"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="w-full text-gray-500 text-sm mt-1 hover:text-white transition-colors"
                >
                  ← Back to Personal Info
                </button>
              </>
            )}
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brandPurple font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="glass-card w-full max-w-md p-8 md:p-10 shadow-2xl shadow-purple-500/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-400 mt-2">
              Log in to your student dashboard
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brandPurple transition-colors"
              />
            </div>

            <button className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
              Get OTP
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0B0E14] px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button className="w-full glass-card py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors border-white/10">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            <span>Sign in with Google</span>
          </button>

          <p className="text-center mt-8 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-brandPurple font-semibold hover:underline"
            >
              Request Access
            </Link>
          </p>
        </div>
      </div>
   
    </div>
  );
}

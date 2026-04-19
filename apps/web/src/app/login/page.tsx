"use client";
import React, { useState } from "react";
import { supabase, API_URL } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Check Credentials with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      // 2. Check if admin
      if (authData.user.email === "swe.ashutosh@gmail.com") {
        router.push("/admin");
        return;
      }

      // 3. Check Approval Status in D1 via Hono
      const response = await fetch(
        `${API_URL}/api/user-status/${authData.user.id}`,
        { cache: 'no-store' }
      );
      const statusResult = await response.json();

      if (statusResult.status === "approved") {
        router.push("/dashboard");
      } else if (statusResult.status === "blocked") {
        await supabase.auth.signOut();
        setError("Your account has been blocked. Please contact the library manager.");
      } else {
        await supabase.auth.signOut();
        setError("Your account is pending admin approval. Please wait or contact the library manager.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg px-4 md:px-6 pt-20 page-transition">
      <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Login to your Apna Library account
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brandPurple transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brandPurple transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-darkBg px-3 text-gray-500">or</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full glass-card py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors border-white/10"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          <span className="text-sm font-medium">Sign in with Google</span>
        </button>

        <p className="text-center mt-8 text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-brandPurple font-semibold hover:underline"
          >
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}
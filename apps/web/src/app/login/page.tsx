// "use client";
// import React from "react";
// import Link from "next/link";
// import Footer from "@/components/Footer";

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-grow flex items-center justify-center px-6 py-12">
//         <div className="glass-card w-full max-w-md p-8 md:p-10 shadow-2xl shadow-purple-500/10">
//           <div className="text-center mb-10">
//             <h1 className="text-3xl font-bold">Welcome Back</h1>
//             <p className="text-gray-400 mt-2">
//               Log in to your student dashboard
//             </p>
//           </div>

//           <form className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Mobile Number
//               </label>
//               <input
//                 type="tel"
//                 placeholder="+91 00000 00000"
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brandPurple transition-colors"
//               />
//             </div>

//             <button className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
//               Get OTP
//             </button>
//           </form>

//           <div className="relative my-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-white/10"></div>
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-[#0B0E14] px-2 text-gray-500">
//                 Or continue with
//               </span>
//             </div>
//           </div>

          // <button className="w-full glass-card py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors border-white/10">
          //   <img
          //     src="https://www.svgrepo.com/show/475656/google-color.svg"
          //     className="w-5 h-5"
          //     alt="Google"
          //   />
          //   <span>Sign in with Google</span>
          // </button>

          // <p className="text-center mt-8 text-sm text-gray-400">
          //   Don't have an account?{" "}
          //   <Link
          //     href="/signup"
          //     className="text-brandPurple font-semibold hover:underline"
          //   >
          //     Request Access
          //   </Link>
          // </p>
//         </div>
//       </div>
   
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Check Credentials with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Check Approval Status in D1 via Hono
      const response = await fetch(`http://localhost:8787/api/user-status/${authData.user.id}`);
      const statusResult = await response.json();

      if (statusResult.status !== 'approved') {
        // If not approved, sign them out immediately so they can't access protected routes
        await supabase.auth.signOut();
        alert("Your account is still pending admin approval. Please contact the library manager.");
      } else {
        // 3. Success! Move to Dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }

    // inside handleLogin...
if (authData.user.email === "your-admin-email@gmail.com") {
    router.push("/admin"); // Take me to the control center
} else {
    router.push("/dashboard"); // Take students to the library view
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] px-6">
      <div className="glass-card w-full max-w-md p-10 rounded-[32px] border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brandPurple"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brandPurple"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all"
          >
            {loading ? "Checking Status..." : "Login"}
          </button>

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
        </form>
      </div>
    </div>
  );
}
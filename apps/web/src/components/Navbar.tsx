"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Info,
  CircleDollarSign,
  BookOpen,
  Mail,
  User,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "About", href: "/about", icon: <Info size={20} /> },
    { name: "Fees", href: "/fees", icon: <CircleDollarSign size={20} /> },
    { name: "Blog", href: "/blog", icon: <BookOpen size={20} /> },
    { name: "Contact", href: "/contact", icon: <Mail size={20} /> },
  ];

  return (
    <>
      {/* DESKTOP + MOBILE TOP NAV */}
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${
          isScrolled
            ? "bg-darkBg/90 backdrop-blur-xl border-white/10 py-3"
            : "bg-darkBg border-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-xl bg-white/5 border border-white/10 p-1 transition-all group-hover:border-brandPurple">
              <img
                src="/logo.png"
                alt="Apna Library Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter bg-clip-text text-transparent bg-purple-gradient">
              APNA LIBRARY
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-brandPurple transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* BUTTONS / USER ICON */}
          <div className="flex gap-2 md:gap-4 items-center relative">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:border-brandPurple transition-colors overflow-hidden"
                >
                  <User size={18} className="text-white" />
                </button>
                
                {/* DROPDOWN */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-xl overflow-hidden py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs text-gray-400 truncate">{user.email || user.phone || 'User'}</p>
                    </div>
                    <Link 
                      href={user.email === "swe.ashutosh@gmail.com" ? "/admin" : "/dashboard"} 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-brandPurple transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs md:text-sm font-bold text-gray-400 hover:text-white px-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-purple-gradient px-3 md:px-6 py-2 rounded-lg md:rounded-xl font-bold text-[11px] md:text-sm hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM BAR */}
      <nav className="fixed bottom-0 w-full z-[100] flex md:hidden items-center justify-around py-2 border-t border-white/10 bg-darkBg/95 backdrop-blur-xl safe-area-bottom">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center gap-1 text-[10px] text-gray-400 hover:text-brandPurple transition-colors py-1"
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;

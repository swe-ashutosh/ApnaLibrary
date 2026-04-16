// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   Home,
//   Info,
//   CircleDollarSign,
//   BookOpen,
//   Mail,
//   UserCircle,
// } from "lucide-react";

// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Detect scroll to add more background depth
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navLinks = [
//     { name: "Home", href: "/", icon: <Home size={20} /> },
//     { name: "About", href: "/about", icon: <Info size={20} /> },
//     { name: "Fees", href: "/fees", icon: <CircleDollarSign size={20} /> },
//     { name: "Blog", href: "/blog", icon: <BookOpen size={20} /> },
//     { name: "Contact", href: "/contact", icon: <Mail size={20} /> },
//   ];

//   return (
//     <>
//       {/* FULL WIDTH FIXED NAVBAR */}
//       <nav
//         className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${
//           isScrolled
//             ? "bg-darkBg/90 backdrop-blur-xl border-white/10 py-3"
//             : "bg-transparent border-transparent py-5"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
//           {/* LOGO - Now using your image path */}
//           <Link href="/" className="flex items-center gap-3 group">
//             <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white/5 border border-white/10 p-1.5 transition-all group-hover:border-brandPurple">
//               <img
//                 src="/logo.png"
//                 alt="Apna Library Logo"
//                 className="w-full h-full object-cover object-center"
//               />
//             </div>
//             <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-purple-gradient">
//               APNA LIBRARY
//             </span>
//           </Link>

//           {/* DESKTOP LINKS */}
//           <div className="hidden md:flex gap-8 items-center">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className="text-gray-300 hover:text-brandPurple transition-colors text-sm font-medium"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* BUTTONS */}
//           <div className="flex gap-4 items-center">
//             <Link
//               href="/login"
//               className="hidden md:block text-sm font-bold text-gray-400 hover:text-white"
//             >
//               Login
//             </Link>
//             <Link
//               href="/signup"
//               className="bg-purple-gradient px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
//             >
//               Join Now
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* MOBILE BOTTOM BAR (Remains same for consistency) */}
//       <nav className="fixed bottom-0 w-full z-[100] flex md:hidden items-center justify-around py-3 border-t border-white/10 bg-darkBg/90 backdrop-blur-xl pb-6">
//         {navLinks.map((link) => (
//           <Link
//             key={link.name}
//             href={link.href}
//             className="flex flex-col items-center gap-1 text-[10px] text-gray-400"
//           >
//             {link.icon}
//             <span>{link.name}</span>
//           </Link>
//         ))}
//       </nav>
      
//      </>
//   );
//  };

// export default Navbar;



"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Info,
  CircleDollarSign,
  BookOpen,
  Mail,
  UserCircle,
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "About", href: "/about", icon: <Info size={20} /> },
    { name: "Fees", href: "/fees", icon: <CircleDollarSign size={20} /> },
    { name: "Blog", href: "/blog", icon: <BookOpen size={20} /> },
    { name: "Contact", href: "/contact", icon: <Mail size={20} /> },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${
          isScrolled
            ? "bg-darkBg/90 backdrop-blur-xl border-white/10 py-3"
            : "bg-[#0f172a] border-white/5 py-4" 
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
          {/* LOGO - Adjusted size for mobile */}
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

          {/* BUTTONS - Login now visible on mobile, padding reduced for fit */}
          <div className="flex gap-2 md:gap-4 items-center">
            <Link
              href="/login"
              className="text-xs md:text-sm font-bold text-gray-400 hover:text-white px-2"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-purple-gradient px-3 md:px-6 py-2 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
            >
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-0 w-full z-[100] flex md:hidden items-center justify-around py-3 border-t border-white/10 bg-darkBg/90 backdrop-blur-xl pb-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center gap-1 text-[10px] text-gray-400"
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
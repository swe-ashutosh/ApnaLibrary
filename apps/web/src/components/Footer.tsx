import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="w-full px-6 md:px-20 py-16 glass-card rounded-none border-x-0 border-b-0 mt-20">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
//         {/* Left Side: Brand */}
//         <div className="flex flex-col gap-4">
//           <h3 className="text-2xl font-bold text-white tracking-tighter">
//             APNA <span className="text-brandPurple">LIBRARY</span>
//           </h3>
//           <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
//             The most premium study environment in the city. Designed for those
//             who want to turn their dreams into reality.
//           </p>
//           <div className="flex gap-5 text-gray-400 mt-2">
//             <FaInstagram
//               size={20}
//               className="hover:text-brandPurple cursor-pointer transition-colors"
//             />
//             <FaTwitter
//               size={20}
//               className="hover:text-brandPurple cursor-pointer transition-colors"
//             />
//             <FaFacebook
//               size={20}
//               className="hover:text-brandPurple cursor-pointer transition-colors"
//             />
//           </div>
//         </div>

//         {/* Center: Links */}
//         <div className="md:justify-self-center">
//           <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
//           <ul className="text-gray-400 text-sm space-y-4">
//             <li className="hover:text-brandPurple cursor-pointer transition-colors">
//               Terms & Conditions
//             </li>
//             <li className="hover:text-brandPurple cursor-pointer transition-colors">
//               Privacy Policy
//             </li>
//             <li className="hover:text-brandPurple cursor-pointer transition-colors">
//               Library Rules
//             </li>
//             <li className="hover:text-brandPurple cursor-pointer transition-colors">
//               Refund Policy
//             </li>
//           </ul>
//         </div>

//         {/* Right Side: Contact & Map */}
//         <div className="flex flex-col gap-4">
//           <h4 className="text-lg font-semibold mb-2 text-white">Visit Us</h4>
//           <div className="space-y-4 text-sm text-gray-400">
//             <div className="flex items-start gap-3">
//               <MapPin
//                 size={18}
//                 className="text-brandPurple mt-1 flex-shrink-0"
//               />
//               <span>
//                 New Colony, Robertsganj, Sonbhadra, Uttar Pradesh, India
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <Phone size={18} className="text-brandPurple flex-shrink-0" />
//               <span>+91 9519498159</span>
//             </div>
//           </div>

//           {/* MAP BOX */}
//           <div className="w-full h-36 rounded-2xl overflow-hidden mt-4 border border-white/10 group">
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d14701.483446785973!2d83.05967146997997!3d24.700505964986885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x398ef82da340bb1f%3A0xa306a73843b14412!2sNew%20Colony%2C%20Robertsganj%2C%20Uttar%20Pradesh%20231216!3m2!1d24.6939839!2d83.07103579999999!5e0!3m2!1sen!2sin!4v1775879101800!5m2!1sen!2sin"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               className="grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100"
//             ></iframe>
//           </div>
//         </div>
//       </div>

//       <div className="mt-16 pt-8 border-t border-white/5 text-center">
//         <p className="text-xs text-gray-500 tracking-widest uppercase">
//           © 2026 APNA LIBRARY • BUILT BY TOPPERS FOR TOPPERS
//         </p>
//       </div>
//     </footer>
//   );
// }

export default function Footer() {
  return (
    <footer className="w-full px-6 md:px-20 pt-20 pb-10 glass-card rounded-none border-x-0 border-b-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Side: Brand */}
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-white tracking-tighter">
            APNA <span className="text-brandPurple">LIBRARY</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            The most premium study environment in the city. Designed for those
            who want to turn their dreams into reality.
          </p>
          <div className="flex gap-5 text-gray-400 mt-2">
            <FaInstagram
              size={20}
              className="hover:text-brandPurple cursor-pointer transition-colors"
            />
            <FaTwitter
              size={20}
              className="hover:text-brandPurple cursor-pointer transition-colors"
            />
            <FaFacebook
              size={20}
              className="hover:text-brandPurple cursor-pointer transition-colors"
            />
          </div>
        </div>

        {/* Center: Links */}
        <div className="md:justify-self-center">
          <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
          <ul className="text-gray-400 text-sm space-y-4">
            <li className="hover:text-brandPurple cursor-pointer transition-colors">
              Terms & Conditions
            </li>
            <li className="hover:text-brandPurple cursor-pointer transition-colors">
              Privacy Policy
            </li>
            <li className="hover:text-brandPurple cursor-pointer transition-colors">
              Library Rules
            </li>
            <li className="hover:text-brandPurple cursor-pointer transition-colors">
              Refund Policy
            </li>
          </ul>
        </div>

        {/* Right Side: Contact & Map */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold mb-2 text-white">Visit Us</h4>
          <div className="space-y-4 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <MapPin
                size={18}
                className="text-brandPurple mt-1 flex-shrink-0"
              />
              <span>
                Plot 42, Knowledge Hub, Near Metro Pillar 120, Delhi, India
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-brandPurple flex-shrink-0" />
              <span>+91 9988776655</span>
            </div>
          </div>

          {/* MAP BOX */}
          <div className="w-full h-36 rounded-2xl overflow-hidden mt-4 border border-white/10 group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913127413!2d77.06889751037307!3d28.502925939794354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1917f3000001%3A0x6969c3a35a66992d!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1712810000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              className="grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-xs text-gray-500 tracking-widest uppercase">
          © 2026 APNA LIBRARY • BUILT BY TOPPERS FOR TOPPERS
        </p>
        {/* This extra div only shows on mobile to prevent Bottom Nav overlapping */}
        <div className="h-10 md:hidden"></div>
      </div>
    </footer>
  );
}

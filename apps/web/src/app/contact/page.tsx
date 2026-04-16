import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-32 px-6 flex justify-center items-center">
        <div className="glass-card p-10 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-10 ">
          <div>
            <h1 className="text-3xl font-bold mb-4">
              Get in <span className="text-brandPurple">Touch</span>
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Have questions? Our team is here to help you find the perfect
              study spot.
            </p>
            <div className="space-y-4 text-sm text-gray-300">
              <p>📍 New Colony, Robertsganj, Owner</p>
              <p>📞 +91 9519498159</p>
              <p>✉️ support@apnalibrary.com</p>
            </div>
          </div>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple"
            />
            <textarea
              placeholder="Message"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brandPurple h-32"
            ></textarea>
            <button className="w-full bg-purple-gradient py-3 rounded-xl font-bold">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

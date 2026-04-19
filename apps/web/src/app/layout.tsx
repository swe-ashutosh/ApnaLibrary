import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Apna Library — Premium Study Space",
  description:
    "The ultimate study space for serious aspirants. Premium cabins, high-speed internet, and a community of toppers. Join 500+ students today.",
  keywords: "library, study space, UPSC, JEE, SSC, coaching, Robertsganj",
  openGraph: {
    title: "Apna Library — Premium Study Space",
    description: "The ultimate study space for serious aspirants.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-darkBg text-white antialiased">
        <Navbar />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}

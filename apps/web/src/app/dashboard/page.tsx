"use client";
import React, { useState, useEffect } from "react";
import { supabase, API_URL } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, CreditCard, User, LogOut, QrCode, Camera } from "lucide-react";
import QRCode from "react-qr-code";

interface StudentData {
  id: string;
  full_name: string;
  mobile_number: string;
  course: string;
  status: string;
  total_fees: number;
  paid_fees: number;
  pending_fees: number;
  days_present: number;
  created_at: string;
  profile_picture?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [qrToken, setQrToken] = useState<string>("");
  const [qrTimeLeft, setQrTimeLeft] = useState(60);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !student) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Replace with your Cloudinary credentials or setup env variables
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "demo_preset";
      formData.append("upload_preset", uploadPreset);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        // Update database
        const updateRes = await fetch(`${API_URL}/api/student/update-profile-picture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: student.id, profile_picture: data.secure_url }),
        });
        
        if (updateRes.ok) {
          setStudent({ ...student, profile_picture: data.secure_url });
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const fetchQrToken = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/student/qr-token/${userId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setQrToken(data.token);
          setQrTimeLeft(60);
        }
      }
    } catch (err) {
      console.error("Error fetching QR token:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setUserName(user.email || "Student");

      try {
        // Fetch student profile from API
        const profileRes = await fetch(`${API_URL}/api/student/${user.id}?t=${Date.now()}`, { cache: 'no-store' });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setStudent(profileData);
          if (profileData.status === "approved") {
            fetchQrToken(user.id);
          }
        }

        // Fetch blogs
        const blogRes = await fetch(`${API_URL}/api/blogs`, { cache: 'no-store' });
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlogs(blogData.slice(0, 3)); // Show latest 3
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (student && student.status === "approved") {
      interval = setInterval(() => {
        setQrTimeLeft((prev) => {
          if (prev <= 1) {
            fetchQrToken(student.id);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [student]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brandPurple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col page-transition">
      {/* Header */}
      <header className="pt-20 md:pt-24 px-4 md:px-8 pb-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Welcome, <span className="text-brandPurple">{student?.full_name || userName}</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {student?.course && `Preparing for ${student.course}`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-600/30 transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto w-full">
        {/* Status Banner */}
        {student && student.status !== "approved" && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
            ⏳ Your account is <strong>{student.status}</strong>. Some features may be limited until admin approval.
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-brandPurple" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{student?.days_present || 0}</p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Days Present</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-green-400" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-400">₹{student?.paid_fees || 0}</p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Fees Paid</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-yellow-400">₹{student?.pending_fees || 0}</p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Fees Pending</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User size={20} className="text-blue-400" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold capitalize">{student?.status || "—"}</p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Account Status</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User size={20} className="text-brandPurple" />
              Your Profile
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-2 items-center sm:items-start">
              <div className="relative w-24 h-24 shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                  {student?.profile_picture ? (
                    <img src={student.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-brandPurple hover:bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors border border-white/20">
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera size={14} className="text-white" />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>

              <div className="flex-1 w-full space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Name</span>
                <span className="font-medium">{student?.full_name || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Mobile</span>
                <span className="font-medium">{student?.mobile_number || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Course</span>
                <span className="font-medium">{student?.course || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Total Fees</span>
                <span className="font-medium">₹{student?.total_fees || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Member Since</span>
                <span className="font-medium">
                  {student?.created_at
                    ? new Date(student.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
            </div>
          </div>

          {/* Latest Blogs */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-brandPurple" />
              Latest Updates
            </h3>
            {blogs.length > 0 ? (
              <div className="space-y-4">
                {blogs.map((blog: any) => (
                  <div
                    key={blog.id}
                    className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brandPurple/30 transition-colors"
                  >
                    <h4 className="font-semibold text-sm mb-1">{blog.title}</h4>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {blog.content}
                    </p>
                    <p className="text-brandPurple text-[10px] mt-2 font-medium">
                      {new Date(blog.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No updates yet.</p>
            )}
          </div>
        </div>

        {/* QR Code Section (Only for approved students) */}
        {student && student.status === "approved" && (
          <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <QrCode size={20} className="text-brandPurple" />
              Your Attendance QR
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md">
              Show this QR code to the admin or staff at the library to mark your daily attendance.
            </p>
            
            <div className="bg-white p-4 rounded-xl shadow-lg relative">
              {qrToken ? (
                <QRCode value={qrToken} size={180} />
              ) : (
                <div className="w-[180px] h-[180px] bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
                  <span className="text-gray-400 text-sm">Generating...</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Auto-updating in {qrTimeLeft}s
            </p>
          </div>
        )}

        {/* Mobile bottom spacer */}
        <div className="h-20 md:hidden"></div>
      </main>
    </div>
  );
}
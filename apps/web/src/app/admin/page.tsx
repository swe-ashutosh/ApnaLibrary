"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase, API_URL } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({ today: 0, history: [], todayPresent: [] });
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogLoading, setBlogLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [feesEdit, setFeesEdit] = useState<any>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const lastScannedRef = React.useRef<string | null>(null);

  // Settings state
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    if (adminUser?.email) setSettingsEmail(adminUser.email);
  }, [adminUser]);

  const updateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      const updates: any = {};
      if (settingsEmail && settingsEmail !== adminUser.email) updates.email = settingsEmail;
      if (settingsPassword) updates.password = settingsPassword;

      if (Object.keys(updates).length === 0) {
        showToast("No changes made");
        setSettingsLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      
      showToast("Credentials updated successfully. You may need to log in again.");
      setSettingsPassword("");
    } catch (err: any) {
      showToast(err.message || "Failed to update credentials", "error");
    } finally {
      setSettingsLoading(false);
    }
  };

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/students`, { cache: 'no-store' }),
        fetch(`${API_URL}/api/admin/attendance-stats`, { cache: 'no-store' }),
      ]);
      if (sRes.ok) setStudents(await sRes.json());
      if (aRes.ok) setAttendance(await aRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "swe.ashutosh@gmail.com") {
        router.push("/login");
        return;
      }
      setAdminUser(user);
      fetchData();
    };
    checkAdmin();
  }, [router, fetchData]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      showToast(`Student ${status} successfully`);
      fetchData();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/delete-student/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      showToast("Student deleted successfully");
      fetchData();
    } catch {
      showToast("Failed to delete student", "error");
    }
  };

  const updateFees = async () => {
    if (!feesEdit) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/update-fees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feesEdit),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("Fees updated!");
      setFeesEdit(null);
      fetchData();
    } catch {
      showToast("Failed to update fees", "error");
    }
  };

  const markAttendance = async (studentId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/mark-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed", "error");
        return;
      }
      showToast("Attendance marked!");
      fetchData();
    } catch {
      showToast("Failed to mark attendance", "error");
    }
  };

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    if (lastScannedRef.current === decodedText) return;
    lastScannedRef.current = decodedText;
    setScanResult(decodedText);
    try {
      const res = await fetch(`${API_URL}/api/admin/scan-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: decodedText }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Invalid QR", "error");
        setTimeout(() => { lastScannedRef.current = null; setScanResult(null); }, 3000);
        return;
      }
      showToast(data.message || "Attendance marked via QR!");
      fetchData();
      setTimeout(() => { lastScannedRef.current = null; setScanResult(null); }, 3000);
    } catch {
      showToast("Scan API Error", "error");
      setTimeout(() => { lastScannedRef.current = null; setScanResult(null); }, 3000);
    }
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === "attendance") {
      let scanner: any;
      import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
        scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scanner.render(
          (text: string) => handleScanSuccess(text),
          () => {} // ignore scan failures
        );
      }).catch(err => console.error("Scanner load error", err));

      return () => {
        if (scanner) {
          scanner.clear().catch((e: any) => console.error("Scanner clear error", e));
        }
      };
    }
  }, [activeTab, handleScanSuccess]);

  const handleBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;
    setBlogLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: blogTitle, content: blogContent }),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("Blog published!");
      setBlogTitle("");
      setBlogContent("");
    } catch {
      showToast("Failed to post blog", "error");
    } finally {
      setBlogLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const stats = {
    total: students.length,
    pending: students.filter((s: any) => s.status === "pending").length,
    approved: students.filter((s: any) => s.status === "approved").length,
    blocked: students.filter((s: any) => s.status === "blocked").length,
  };

  const approvedStudents = students.filter((s: any) => s.status === "approved");

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "users", label: "👥 Users" },
    { id: "attendance", label: "📋 Attendance" },
    { id: "fees", label: "💰 Fees" },
    { id: "blog", label: "📝 Blog" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E14] via-[#1a1f2e] to-[#0B0E14] text-white flex">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-5 py-3 rounded-xl text-sm font-medium shadow-xl animate-[fadeIn_0.3s_ease-out] ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[140] md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static z-[150] w-64 md:w-72 h-full border-r border-white/10 bg-black/80 md:bg-black/40 backdrop-blur-md p-6 md:p-8 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="mb-10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-purple-gradient mb-1">Apna Library</h1>
          <p className="text-gray-400 text-xs">Admin Control Center</p>
        </div>
        <nav className="space-y-2 flex-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === item.id ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "text-gray-300 hover:bg-white/5"}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="relative mt-4">
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-full bg-white/10 hover:bg-white/15 rounded-xl p-3 text-left flex items-center justify-between transition-all">
            <div className="min-w-0">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-gray-400 truncate">{adminUser?.email}</p>
            </div>
            <span className="text-xs">{showProfileMenu ? "▲" : "▼"}</span>
          </button>
          {showProfileMenu && (
            <button onClick={handleLogout} className="absolute bottom-full w-full mb-2 bg-red-600 hover:bg-red-700 rounded-xl px-4 py-2 text-sm font-semibold transition-all">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-h-screen">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-[130] bg-darkBg/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-white p-2">☰</button>
          <h1 className="text-sm font-bold bg-clip-text text-transparent bg-purple-gradient">Apna Library Admin</h1>
          <div className="w-8" />
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="p-4 md:p-8 space-y-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-1">Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome back, Admin</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[
                { label: "Total Students", value: stats.total, color: "bg-blue-500", icon: "👥" },
                { label: "Pending", value: stats.pending, color: "bg-yellow-500", icon: "⏳" },
                { label: "Approved", value: stats.approved, color: "bg-green-500", icon: "✅" },
                { label: "Blocked", value: stats.blocked, color: "bg-red-500", icon: "🚫" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-lg`}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-2">Today&apos;s Attendance</h2>
              <p className="text-5xl md:text-6xl font-bold text-purple-400">{attendance.today || 0}</p>
              <p className="text-gray-400 mt-2 text-sm">Students present today</p>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">User Management</h1>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <div className="space-y-3 md:space-y-0">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Name</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Mobile</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Course</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s: any) => (
                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                {s.profile_picture ? (
                                  <img src={s.profile_picture} alt={s.full_name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-gray-400 text-xs">{(s.full_name || 'U')[0]}</span>
                                )}
                              </div>
                              <span className="font-medium text-sm">{s.full_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{s.mobile_number}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{s.course}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.status === "approved" ? "bg-green-500/20 text-green-400" : s.status === "blocked" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            {s.status === "pending" && (
                              <button onClick={() => updateStatus(s.id, "approved")} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-medium transition-all">✓ Approve</button>
                            )}
                            <button
                              onClick={() => updateStatus(s.id, s.status === "blocked" ? "approved" : "blocked")}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${s.status === "blocked" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
                            >
                              {s.status === "blocked" ? "🔓 Unblock" : "🚫 Block"}
                            </button>
                            <button
                              onClick={() => deleteStudent(s.id)}
                              className="bg-red-900/50 hover:bg-red-600 px-3 py-1 rounded-lg text-xs font-medium transition-all text-red-200 hover:text-white border border-red-500/30 hover:border-red-600"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {students.map((s: any) => (
                    <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {s.profile_picture ? (
                              <img src={s.profile_picture} alt={s.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-400 text-sm">{(s.full_name || 'U')[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{s.full_name}</p>
                            <p className="text-xs text-gray-400">{s.course} • {s.mobile_number}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${s.status === "approved" ? "bg-green-500/20 text-green-400" : s.status === "blocked" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                          {s.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {s.status === "pending" && (
                          <button onClick={() => updateStatus(s.id, "approved")} className="flex-1 bg-green-600 py-2 rounded-lg text-xs font-medium">✓ Approve</button>
                        )}
                        <button
                          onClick={() => updateStatus(s.id, s.status === "blocked" ? "approved" : "blocked")}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium ${s.status === "blocked" ? "bg-blue-600" : "bg-red-600"}`}
                        >
                          {s.status === "blocked" ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => deleteStudent(s.id)}
                          className="flex-1 bg-red-900/50 text-red-200 border border-red-500/30 hover:bg-red-600 hover:text-white py-2 rounded-lg text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attendance */}
        {activeTab === "attendance" && (
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Attendance</h1>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 mb-6">
              <p className="text-gray-400 mb-1 text-sm">Today&apos;s Count</p>
              <p className="text-4xl md:text-5xl font-bold">{attendance.today || 0}</p>
            </div>

            <h2 className="text-lg font-bold mb-4">Scan QR Code</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-center flex flex-col items-center">
              <div id="qr-reader" className="w-full max-w-sm bg-white text-black rounded-xl overflow-hidden"></div>
              {scanResult && <p className="mt-4 text-brandPurple font-medium animate-pulse">Processing Scan...</p>}
            </div>

            <h2 className="text-lg font-bold mb-4">Manual Attendance (Approved Students)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {approvedStudents.map((s: any) => {
                const present = attendance.todayPresent?.some((p: any) => p.student_id === s.id);
                return (
                  <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {s.profile_picture ? (
                          <img src={s.profile_picture} alt={s.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-sm">{(s.full_name || 'U')[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{s.full_name}</p>
                        <p className="text-xs text-gray-400">{s.course}</p>
                      </div>
                    </div>
                    {present ? (
                      <span className="text-green-400 text-xs font-semibold bg-green-500/20 px-3 py-1 rounded-full">✓ Present</span>
                    ) : (
                      <button onClick={() => markAttendance(s.id)} className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all">Mark</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fees */}
        {activeTab === "fees" && (
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Fees Management</h1>
            {/* Fees edit modal */}
            {feesEdit && (
              <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={() => setFeesEdit(null)}>
                <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-bold mb-4">Edit Fees — {feesEdit.full_name}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Total Fees (₹)</label>
                      <input type="number" value={feesEdit.total_fees} onChange={(e) => setFeesEdit({ ...feesEdit, total_fees: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brandPurple" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Paid Fees (₹)</label>
                      <input type="number" value={feesEdit.paid_fees} onChange={(e) => setFeesEdit({ ...feesEdit, paid_fees: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brandPurple" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setFeesEdit(null)} className="flex-1 glass-card py-2 rounded-xl text-sm">Cancel</button>
                    <button onClick={updateFees} className="flex-1 bg-purple-gradient py-2 rounded-xl text-sm font-bold">Save</button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((s: any) => (
                <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold">{s.full_name}</h3>
                    <button onClick={() => setFeesEdit({ id: s.id, full_name: s.full_name, total_fees: s.total_fees || 0, paid_fees: s.paid_fees || 0 })} className="text-brandPurple text-xs font-semibold hover:underline">Edit</button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Total</span><span>₹{s.total_fees || 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Paid</span><span className="text-green-400">₹{s.paid_fees || 0}</span></div>
                    <div className="flex justify-between border-t border-white/10 pt-2"><span className="text-gray-400">Pending</span><span className="text-yellow-400">₹{s.pending_fees || 0}</span></div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" style={{ width: `${s.total_fees ? Math.min((s.paid_fees / s.total_fees) * 100, 100) : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog */}
        {activeTab === "blog" && (
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Post New Blog</h1>
            <form onSubmit={handleBlogPost} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Blog Title</label>
                  <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="Enter blog title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Blog Content</label>
                  <textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Write your blog content..." rows={8} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all resize-none" required></textarea>
                </div>
                <button type="submit" disabled={blogLoading} className="w-full bg-purple-gradient py-4 rounded-xl font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all">
                  {blogLoading ? "Publishing..." : "Publish Blog"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Settings</h1>
            <form onSubmit={updateAdminCredentials} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-xl">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Admin Email</label>
                  <input type="email" value={settingsEmail} onChange={(e) => setSettingsEmail(e.target.value)} placeholder="admin@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">New Password (leave blank to keep current)</label>
                  <input type="password" value={settingsPassword} onChange={(e) => setSettingsPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all" />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                  <p className="text-xs text-yellow-400 font-medium leading-relaxed">
                    ⚠️ Changing your credentials will log out all active sessions. You will need to log in again with the new credentials.
                  </p>
                </div>
                <button type="submit" disabled={settingsLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all">
                  {settingsLoading ? "Updating..." : "Save Credentials"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
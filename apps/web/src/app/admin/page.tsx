"use client";
import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({ today: 0, history: [] });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    const sRes = await fetch("http://localhost:8787/api/admin/students");
    setStudents(await sRes.json());
    const aRes = await fetch("http://localhost:8787/api/admin/attendance-stats");
    setAttendance(await aRes.json());
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("http://localhost:8787/api/admin/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-brandPurple mb-6">Nira Admin</h2>
        <button onClick={() => setActiveTab("users")} className={`text-left p-3 rounded-xl ${activeTab === 'users' ? 'bg-brandPurple' : 'hover:bg-white/5'}`}>Users & Approval</button>
        <button onClick={() => setActiveTab("fees")} className={`text-left p-3 rounded-xl ${activeTab === 'fees' ? 'bg-brandPurple' : 'hover:bg-white/5'}`}>Fees Management</button>
        <button onClick={() => setActiveTab("attendance")} className={`text-left p-3 rounded-xl ${activeTab === 'attendance' ? 'bg-brandPurple' : 'hover:bg-white/5'}`}>Attendance</button>
        <button onClick={() => setActiveTab("blog")} className={`text-left p-3 rounded-xl ${activeTab === 'blog' ? 'bg-brandPurple' : 'hover:bg-white/5'}`}>Post Blog</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {activeTab === "users" && (
          <section>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-4">Name</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="py-4">{s.full_name}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs ${s.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 text-right flex gap-2 justify-end">
                      {s.status === 'pending' && (
                        <button onClick={() => updateStatus(s.id, 'approved')} className="bg-green-600 px-3 py-1 rounded-lg text-sm">Approve</button>
                      )}
                      <button onClick={() => updateStatus(s.id, s.status === 'blocked' ? 'approved' : 'blocked')} className="bg-red-600 px-3 py-1 rounded-lg text-sm">
                        {s.status === 'blocked' ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "attendance" && (
          <section>
            <div className="bg-brandPurple/20 p-6 rounded-2xl mb-8 border border-brandPurple/30">
              <h3 className="text-lg">Today's Attendance</h3>
              <p className="text-4xl font-bold">{attendance.today} Students Present</p>
            </div>
            {/* List student history here */}
          </section>
        )}
        
        {/* Fees and Blog tabs would follow a similar table/form pattern */}
      </div>
    </div>
  );
}
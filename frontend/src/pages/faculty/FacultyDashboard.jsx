import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { BookOpen, Clock, CalendarCheck, Bell } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import React from "react";

const COLORS = { TEACHING:"#6B8EFF", LAB:"#A7F3D0", NON_TEACHING:"#FBCFE8", ADMINISTRATIVE:"#FED7AA", RESEARCH:"#C4B5FD" };

export default function FacultyDashboard() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/dashboard/faculty")
      .then(r => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  const pct = data ? Math.min((data.totalHours / data.maxHours) * 100, 100) : 0;
  const chartData = data ? Object.entries(data.breakdown)
    .filter(([,v]) => v > 0)
    .map(([k, v]) => ({ name: k.replace("_"," "), hours: v, fill: COLORS[k] }))
    : [];

  return (
    <DashboardLayout title="My Dashboard">
      {/* Welcome */}
      <div className="card mb-6 bg-gradient-to-r from-primary/10 to-purple-100/50 dark:from-primary/20 dark:to-purple-900/20 border-primary/20">
        <p className="text-sm text-primary font-medium">Welcome back 👋</p>
        <h2 className="text-xl font-semibold text-textMain dark:text-white mt-0.5">{user?.name}</h2>
        <p className="text-sm text-textMuted">{user?.department} • {user?.designation}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Assigned Subjects", value: data?.totalSubjects, icon: BookOpen, color: "text-primary bg-blue-50 dark:bg-blue-900/20" },
          { label: "Weekly Hours",      value: `${data?.totalHours}/${data?.maxHours}`, icon: Clock, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
          { label: "Pending Leaves",    value: data?.pendingLeaves, icon: CalendarCheck, color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20" },
          { label: "Notifications",     value: data?.unreadCount,   icon: Bell, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-9 h-9 rounded-xl ${color.split(" ").slice(1).join(" ")} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color.split(" ")[0]} />
            </div>
            <p className="text-xl font-bold text-textMain dark:text-white">{value ?? "0"}</p>
            <p className="text-xs text-textMuted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload progress */}
        <div className="card">
          <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Workload Status</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth="10"/>
                <circle cx="50" cy="50" r="40" fill="none"
                  stroke={pct >= 100 ? "#F87171" : pct >= 80 ? "#FCD34D" : "#6B8EFF"}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2.51 * pct} 251`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-textMain dark:text-white">{Math.round(pct)}%</p>
                <p className="text-[10px] text-textMuted">utilized</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-textMuted mb-1">
            <span>{data?.totalHours} hrs assigned</span>
            <span>{data?.maxHours} hrs max</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: pct >= 100 ? "#F87171" : pct >= 80 ? "#FCD34D" : "#6B8EFF" }} />
          </div>
          <div className="mt-3 flex justify-center">
            <StatusBadge status={data?.status || "NORMAL"} />
          </div>
        </div>

        {/* Breakdown chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Workload Breakdown</h3>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} hrs`]} contentStyle={{ borderRadius: 10 }} />
                <Bar dataKey="hours" radius={[6,6,0,0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-textMuted text-sm">No workload assigned yet</div>
          )}
        </div>
      </div>
    </DashboardLayout>
    
  );
}
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, BookOpen, Building2, AlertCircle, Clock, CheckCircle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";

const COLORS = ["#6B8EFF", "#A7F3D0", "#FBCFE8", "#FED7AA", "#C4B5FD"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/admin")
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  const cards = [
    { label: "Total Faculty",     value: data?.totalFaculty,     icon: Users,      color: "bg-blue-50 dark:bg-blue-900/20",   iconColor: "text-primary" },
    { label: "Total Subjects",    value: data?.totalSubjects,    icon: BookOpen,   color: "bg-green-50 dark:bg-green-900/20", iconColor: "text-green-600" },
    { label: "Departments",       value: data?.totalDepartments, icon: Building2,  color: "bg-purple-50 dark:bg-purple-900/20", iconColor: "text-purple-600" },
    { label: "Pending Requests",  value: data?.pendingRequests,  icon: AlertCircle,color: "bg-yellow-50 dark:bg-yellow-900/20", iconColor: "text-yellow-600" },
    { label: "Pending Leaves",    value: data?.pendingLeaves,    icon: Clock,      color: "bg-peach-50 dark:bg-orange-900/20",  iconColor: "text-orange-500" },
  ];

  const statusChart = [
    { name: "Normal",     value: Number(data?.statusChart?.normal    || 0), color: "#6B8EFF" },
    { name: "Near Limit", value: Number(data?.statusChart?.near_limit|| 0), color: "#FCD34D" },
    { name: "Overloaded", value: Number(data?.statusChart?.overloaded|| 0), color: "#F87171" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className="card flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
              <Icon size={18} className={iconColor} />
            </div>
            <div>
              <p className="text-2xl font-bold text-textMain dark:text-white">{value ?? "—"}</p>
              <p className="text-xs text-textMuted dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar: Faculty Workload */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Faculty Workload (hrs/week)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.workloadChart || []} barSize={22}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={n => n.split(" ")[0]} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v, n) => [v + " hrs", "Assigned"]}
                contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="hours" fill="#6B8EFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: Status distribution */}
        <div className="card">
          <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Workload Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusChart} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {statusChart.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [v + " faculty"]} contentStyle={{ borderRadius: 10 }} />
              <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dept workload */}
      <div className="card">
        <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Department-wise Workload</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data?.deptChart || []} barSize={32}>
            <XAxis dataKey="department" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10 }} />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {(data?.deptChart || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
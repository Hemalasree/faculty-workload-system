// FacultyWorkload.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

export function FacultyWorkload() {
  const [summary, setSummary] = useState(null);
  const [allocations, setAllocations] = useState([]);

  const COLORS = { TEACHING:"#6B8EFF", LAB:"#A7F3D0", NON_TEACHING:"#FBCFE8", ADMINISTRATIVE:"#FED7AA", RESEARCH:"#C4B5FD" };

  useEffect(() => {
    api.get("/allocations/my").then(r => {
      setAllocations(r.data.data || []);
      setSummary(r.data.summary);
    });
  }, []);

  const breakdown = allocations.reduce((acc, a) => {
    acc[a.duty_type] = (acc[a.duty_type] || 0) + a.hours_per_week;
    return acc;
  }, {});
  const chartData = Object.entries(breakdown).map(([k, v]) => ({ name: k.replace("_"," "), hours: v, fill: COLORS[k] || "#E5E7EB" }));
  const pct = summary ? Math.min((summary.totalHours / summary.maxHours) * 100, 100) : 0;

  return (
    <DashboardLayout title="My Workload Overview">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[
          { label: "Teaching",       key: "TEACHING",       color: "#6B8EFF" },
          { label: "Lab",            key: "LAB",            color: "#A7F3D0" },
          { label: "Administrative", key: "ADMINISTRATIVE", color: "#FED7AA" },
          { label: "Non-Teaching",   key: "NON_TEACHING",   color: "#FBCFE8" },
          { label: "Research",       key: "RESEARCH",       color: "#C4B5FD" },
        ].map(({ label, key, color }) => (
          <div key={key} className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: color + "60" }}>
              <div className="w-full h-full flex items-center justify-center font-bold text-xs" style={{ color }}>
                {breakdown[key] || 0}h
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-textMain dark:text-white">{breakdown[key] || 0}</p>
              <p className="text-xs text-textMuted">{label} hrs/week</p>
            </div>
          </div>
        )).slice(0, 3)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress */}
        <div className="card">
          <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Total Weekly Hours</h3>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-textMuted">Assigned</span>
            <span className="font-bold text-textMain dark:text-white">{summary?.totalHours} / {summary?.maxHours} hrs</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
            <div className="h-3 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: pct >= 100 ? "#F87171" : pct >= 80 ? "#FCD34D" : "#6B8EFF" }} />
          </div>
          <div className="flex items-center justify-between">
            <StatusBadge status={summary?.status || "NORMAL"} />
            <span className="text-sm text-textMuted">{Math.round(pct)}% utilized</span>
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Breakdown by Type</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={30}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [`${v} hrs`]} contentStyle={{ borderRadius: 10 }} />
              <Bar dataKey="hours" radius={[4,4,0,0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
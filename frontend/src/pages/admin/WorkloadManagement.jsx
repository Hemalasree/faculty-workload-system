import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

export default function WorkloadManagement() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/allocations/summary").then(r => setData(r.data.data || []));
  }, []);

  const getColor = (status) =>
    status === "OVERLOADED" ? "#F87171" : status === "NEAR_LIMIT" ? "#FCD34D" : "#6B8EFF";

  return (
    <DashboardLayout title="Workload Management">
      {/* Chart */}
      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Faculty Workload Overview</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={n => n.split(" ")[0]} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: "hrs/week", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip formatter={(v, n, p) => [`${v} / ${p.payload.max_hours} hrs`, "Assigned"]}
              contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            <Bar dataKey="total_hours" radius={[6,6,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={getColor(d.status)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 justify-center">
          {[["#6B8EFF","Normal"],["#FCD34D","Near Limit"],["#F87171","Overloaded"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-textMuted">
              <div className="w-3 h-3 rounded-sm" style={{ background: c }} />
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-textMain dark:text-white mb-4">Faculty Workload Details</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>{["Faculty","Department","Assigned","Max","Subjects","Progress","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {data.map(f => {
                const pct = Math.min((f.total_hours / f.max_hours) * 100, 100);
                return (
                  <tr key={f.id}>
                    <td className="font-medium text-sm text-textMain dark:text-white">{f.name}</td>
                    <td className="text-xs text-textMuted">{f.department || "—"}</td>
                    <td className="font-bold text-sm">{f.total_hours}h</td>
                    <td className="text-sm">{f.max_hours}h</td>
                    <td>{f.subject_count}</td>
                    <td>
                      <div className="w-24">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: getColor(f.status) }} />
                        </div>
                        <p className="text-[10px] text-textMuted mt-0.5">{Math.round(pct)}%</p>
                      </div>
                    </td>
                    <td><StatusBadge status={f.status} /></td>
                  </tr>
                );
              })}
              {!data.length && <tr><td colSpan={7} className="text-center py-8 text-textMuted">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
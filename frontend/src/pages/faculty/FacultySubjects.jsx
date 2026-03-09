// FacultySubjects.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

export function FacultySubjects() {
  const [allocations, setAllocations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filterSem, setFilterSem] = useState("");

  useEffect(() => {
    api.get("/allocations/my").then(r => {
      setAllocations(r.data.data || []);
      setSummary(r.data.summary);
    });
  }, []);

  const semesters = [...new Set(allocations.map(a => a.semester))].sort();
  const filtered  = allocations.filter(a => !filterSem || a.semester == filterSem);

  return (
    <DashboardLayout title="My Subjects">
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Subjects", value: allocations.length },
            { label: "Weekly Hours",   value: `${summary.totalHours}/${summary.maxHours}` },
            { label: "Status",         value: <StatusBadge status={summary.status} /> }
          ].map(({ label, value }) => (
            <div key={label} className="card text-center">
              <p className="text-lg font-bold text-textMain dark:text-white">{value}</p>
              <p className="text-xs text-textMuted mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-textMain dark:text-white">Assigned Subjects</h3>
          <select className="select text-xs w-32" value={filterSem} onChange={e => setFilterSem(e.target.value)}>
            <option value="">All Sems</option>
            {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>{["Subject","Code","Sem","Hrs/wk","Duty Type","Year"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="font-medium text-sm text-textMain dark:text-white">{a.subject_name}</td>
                  <td className="font-mono text-xs">{a.subject_code}</td>
                  <td>Sem {a.semester}</td>
                  <td className="font-bold">{a.hours_per_week}</td>
                  <td><StatusBadge status={a.duty_type} /></td>
                  <td className="text-xs">{a.academic_year}</td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={6} className="text-center py-8 text-textMuted">No subjects assigned</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
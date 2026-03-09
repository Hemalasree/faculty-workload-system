// FacultyReports.jsx
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import React from "react";

export function FacultyReports() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/allocations/my").then(r => {
      setData(r.data.data || []);
      setSummary(r.data.summary);
    });
  }, []);

  const downloadCSV = () => {
    const headers = ["Subject","Code","Semester","Hours/Week","Duty Type","Year"];
    const rows = data.map(r => [r.subject_name, r.subject_code, r.semester, r.hours_per_week, r.duty_type, r.academic_year]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `my_workload_report.csv`; a.click();
  };

  return (
    <DashboardLayout title="My Workload Report">
      {summary && (
        <div className="card mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-textMuted">Total: <strong className="text-textMain dark:text-white">{summary.totalHours} / {summary.maxHours} hrs/week</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={summary.status}/>
            <button onClick={downloadCSV} disabled={!data.length} className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={14}/> Download CSV
            </button>
          </div>
        </div>
      )}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr>{["Subject","Code","Semester","Hours/Week","Duty Type","Academic Year"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {data.map(r => (
                <tr key={r.id}>
                  <td className="font-medium text-sm text-textMain dark:text-white">{r.subject_name}</td>
                  <td className="font-mono text-xs">{r.subject_code}</td>
                  <td>Sem {r.semester}</td>
                  <td className="font-bold">{r.hours_per_week}</td>
                  <td><StatusBadge status={r.duty_type}/></td>
                  <td className="text-xs">{r.academic_year}</td>
                </tr>
              ))}
              {!data.length && <tr><td colSpan={6} className="text-center py-8 text-textMuted">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
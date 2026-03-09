import { useEffect, useState } from "react";
import { Download, Filter } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

export default function Reports() {
  const [data, setData]       = useState([]);
  const [depts, setDepts]     = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [filters, setFilters] = useState({ department_id: "", faculty_id: "", semester: "", academic_year: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/departments").then(r => setDepts(r.data.data || []));
    api.get("/faculty").then(r => setFaculty(r.data.data || []));
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v]) => v)));
      const res = await api.get(`/allocations/report?${params}`);
      setData(res.data.data || []);
    } finally { setLoading(false); }
  };

  const downloadCSV = () => {
    if (!data.length) return;
    const headers = ["Faculty","Employee ID","Department","Subject","Code","Hours/Week","Duty Type","Semester","Year","Total Hours","Max Hours"];
    const rows = data.map(r => [
      r.faculty_name, r.employee_id, r.department, r.subject_name, r.subject_code,
      r.hours_per_week, r.duty_type, r.semester, r.academic_year, r.total_hours, r.max_hours
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `workload_report_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Reports">
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-textMain dark:text-white">Filter Report</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="form-group">
            <label className="label">Department</label>
            <select className="select text-xs" value={filters.department_id} onChange={e => setFilters({...filters, department_id: e.target.value})}>
              <option value="">All</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Faculty</label>
            <select className="select text-xs" value={filters.faculty_id} onChange={e => setFilters({...filters, faculty_id: e.target.value})}>
              <option value="">All</option>
              {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Semester</label>
            <select className="select text-xs" value={filters.semester} onChange={e => setFilters({...filters, semester: e.target.value})}>
              <option value="">All</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Year</label>
            <select className="select text-xs" value={filters.academic_year} onChange={e => setFilters({...filters, academic_year: e.target.value})}>
              <option value="">All</option>
              {["2023-24","2024-25","2025-26"].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={loadReport} className="btn-primary">Generate Report</button>
          <button onClick={downloadCSV} disabled={!data.length}
            className="btn-secondary flex items-center gap-2 disabled:opacity-40">
            <Download size={14}/> Download CSV
          </button>
          <span className="text-xs text-textMuted self-center">{data.length} records</span>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>{["Faculty","Dept","Subject","Code","Hrs/Wk","Duty","Sem","Year","Total Hrs"].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              ) : data.map((r, i) => (
                <tr key={i}>
                  <td>
                    <p className="text-sm font-medium text-textMain dark:text-white">{r.faculty_name}</p>
                    <p className="text-xs text-textMuted">{r.employee_id}</p>
                  </td>
                  <td className="text-xs">{r.department || "—"}</td>
                  <td className="text-sm">{r.subject_name}</td>
                  <td className="text-xs font-mono">{r.subject_code}</td>
                  <td>{r.hours_per_week}</td>
                  <td><StatusBadge status={r.duty_type} /></td>
                  <td>Sem {r.semester}</td>
                  <td className="text-xs">{r.academic_year}</td>
                  <td>
                    <span className="font-semibold">{r.total_hours}</span>
                    <span className="text-xs text-textMuted">/{r.max_hours}</span>
                  </td>
                </tr>
              ))}
              {!loading && !data.length && <tr><td colSpan={9} className="text-center py-12 text-textMuted">No data found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
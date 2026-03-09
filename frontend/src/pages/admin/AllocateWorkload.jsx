import { useEffect, useState } from "react";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import api from "../../api/api";
import React from "react";

const DUTY_TYPES = ["TEACHING", "LAB", "NON_TEACHING", "ADMINISTRATIVE", "RESEARCH"];
const ACADEMIC_YEARS = ["2024-25", "2025-26", "2026-27"];

export default function AllocateWorkload() {
  const [faculty, setFaculty]       = useState([]);
  const [subjects, setSubjects]     = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [form, setForm]             = useState({ faculty_id: "", subject_id: "", hours_per_week: "", duty_type: "TEACHING", semester: "", academic_year: "2024-25" });
  const [warning, setWarning]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [confirm, setConfirm]       = useState(null);
  const [selectedFacultyInfo, setSelectedFacultyInfo] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [fr, sr, ar] = await Promise.all([
      api.get("/faculty"), api.get("/subjects"), api.get("/allocations")
    ]);
    setFaculty(fr.data.data || []);
    setSubjects(sr.data.data || []);
    setAllocations(ar.data.data || []);
  };

  const onFacultyChange = (id) => {
    setForm({ ...form, faculty_id: id });
    const f = faculty.find(f => f.id == id);
    setSelectedFacultyInfo(f || null);
    setWarning(null);
  };

  const onSubjectChange = (id) => {
    const s = subjects.find(s => s.id == id);
    setForm({ ...form, subject_id: id, hours_per_week: s?.hours_per_week || "", semester: s?.semester || form.semester });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setWarning(null);
    try {
      await api.post("/allocations", form);
      toast.success("Workload allocated!");
      setForm({ faculty_id: "", subject_id: "", hours_per_week: "", duty_type: "TEACHING", semester: "", academic_year: "2024-25" });
      setSelectedFacultyInfo(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || "Allocation failed";
      if (err.response?.data?.overload) setWarning(msg);
      else toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/allocations/${confirm}`); toast.success("Removed"); load(); }
    catch { toast.error("Failed"); }
    setConfirm(null);
  };

  const currentHours = selectedFacultyInfo
    ? allocations.filter(a => a.faculty_id == selectedFacultyInfo.id).reduce((s, a) => s + a.hours_per_week, 0)
    : 0;
  const pct = selectedFacultyInfo ? Math.min((currentHours / selectedFacultyInfo.max_hours) * 100, 100) : 0;

  return (
    <DashboardLayout title="Subject Allocation">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card h-fit">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-5">Assign Subject to Faculty</h3>

          {/* Faculty workload preview */}
          {selectedFacultyInfo && (
            <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-border dark:border-borderDark">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-textMuted">Current workload</span>
                <span className="font-semibold text-textMain dark:text-white">{currentHours} / {selectedFacultyInfo.max_hours} hrs</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {warning && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-300">{warning}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-group">
              <label className="label">Faculty</label>
              <select className="select" value={form.faculty_id} onChange={e => onFacultyChange(e.target.value)} required>
                <option value="">-- Select Faculty --</option>
                {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Subject</label>
              <select className="select" value={form.subject_id} onChange={e => onSubjectChange(e.target.value)} required>
                <option value="">-- Select Subject --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Sem {s.semester})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Hours/Week</label>
                <input type="number" className="input" min={1} max={20} required
                  value={form.hours_per_week} onChange={e => setForm({ ...form, hours_per_week: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Semester</label>
                <input type="number" className="input" min={1} max={8} required
                  value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Duty Type</label>
              <select className="select" value={form.duty_type} onChange={e => setForm({ ...form, duty_type: e.target.value })}>
                {DUTY_TYPES.map(d => <option key={d} value={d}>{d.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Academic Year</label>
              <select className="select" value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })}>
                {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Allocating..." : "Allocate"}
            </button>
          </form>
        </div>

        {/* Allocations table */}
        <div className="lg:col-span-3 card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-4">Allocation Records</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>{["Faculty", "Subject", "Hrs", "Type", "Sem", ""].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {allocations.map(a => (
                  <tr key={a.id}>
                    <td className="text-sm font-medium text-textMain dark:text-white">{a.faculty_name}</td>
                    <td>
                      <p className="text-sm">{a.subject_name}</p>
                      <p className="text-xs text-textMuted font-mono">{a.subject_code}</p>
                    </td>
                    <td className="font-semibold">{a.hours_per_week}</td>
                    <td><StatusBadge status={a.duty_type} /></td>
                    <td>Sem {a.semester}</td>
                    <td>
                      <button onClick={() => setConfirm(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                        <Trash2 size={14}/>
                      </button>
                    </td>
                  </tr>
                ))}
                {!allocations.length && <tr><td colSpan={6} className="text-center py-8 text-textMuted text-sm">No allocations yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmModal open={!!confirm} title="Remove Allocation" message="Remove this subject allocation?"
        onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
    </DashboardLayout>
  );
}
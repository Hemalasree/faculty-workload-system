import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ConfirmModal from "../../components/ui/ConfirmModal";
import api from "../../api/api";
import React from "react";

const empty = { name: "", code: "", semester: "", department_id: "", credits: 3, hours_per_week: 4 };

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [depts, setDepts]       = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [confirm, setConfirm]   = useState(null);
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem]   = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [sr, dr] = await Promise.all([api.get("/subjects"), api.get("/departments")]);
    setSubjects(sr.data.data || []);
    setDepts(dr.data.data || []);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.semester) return toast.error("Name, code, and semester are required");
    try {
      if (editId) {
        await api.put(`/subjects/${editId}`, form);
        toast.success("Subject updated");
        setEditId(null);
      } else {
        await api.post("/subjects", form);
        toast.success("Subject added");
      }
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const startEdit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, code: s.code, semester: s.semester, department_id: s.department_id || "", credits: s.credits, hours_per_week: s.hours_per_week });
  };

  const handleDelete = async () => {
    try { await api.delete(`/subjects/${confirm}`); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
    setConfirm(null);
  };

  const filtered = subjects.filter(s =>
    (!filterDept || s.department_id == filterDept) &&
    (!filterSem  || s.semester == filterSem)
  );

  const semesters = [...new Set(subjects.map(s => s.semester))].sort();

  return (
    <DashboardLayout title="Subject Management">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card h-fit">
          <h3 className="text-base font-semibold mb-5 text-textMain dark:text-white">
            {editId ? "Edit Subject" : "Add New Subject"}
          </h3>
          <div className="space-y-3">
            <div className="form-group">
              <label className="label">Subject Name</label>
              <input className="input" placeholder="Data Structures" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Subject Code</label>
              <input className="input" placeholder="CS301" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Semester</label>
                <input type="number" className="input" min={1} max={8} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Credits</label>
                <input type="number" className="input" min={1} max={6} value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Hours/Week</label>
              <input type="number" className="input" min={1} max={10} value={form.hours_per_week} onChange={e => setForm({ ...form, hours_per_week: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Department</label>
              <select className="select" value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                <option value="">-- Select --</option>
                {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={handleSubmit} className="btn-primary flex-1">{editId ? "Update" : "Add Subject"}</button>
              {editId && <button onClick={() => { setEditId(null); setForm(empty); }} className="btn-secondary">Cancel</button>}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-textMain dark:text-white">Subject List</h3>
            <span className="text-xs text-textMuted">{filtered.length} subjects</span>
          </div>
          <div className="flex gap-2 mb-4">
            <select className="select text-xs flex-1" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="">All Departments</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select className="select text-xs w-32" value={filterSem} onChange={e => setFilterSem(e.target.value)}>
              <option value="">All Sems</option>
              {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>{["Subject", "Code", "Semester", "Credits", "Hrs/week", ""].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <p className="font-medium text-sm text-textMain dark:text-white">{s.name}</p>
                      <p className="text-xs text-textMuted">{s.department_name || "—"}</p>
                    </td>
                    <td className="text-xs font-mono">{s.code}</td>
                    <td>{s.semester}</td>
                    <td>{s.credits}</td>
                    <td>{s.hours_per_week}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"><Pencil size={14}/></button>
                        <button onClick={() => setConfirm(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={6} className="text-center py-8 text-textMuted text-sm">No subjects found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmModal open={!!confirm} title="Delete Subject" message="This will remove the subject from all allocations."
        onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
    </DashboardLayout>
  );
}
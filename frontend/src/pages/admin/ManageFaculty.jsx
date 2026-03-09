import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Search, UserCheck, UserX, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ConfirmModal from "../../components/ui/ConfirmModal";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

const empty = { name: "", email: "", password: "", department_id: "", designation: "", max_hours: 18, phone: "" };

export default function ManageFaculty() {
  const [faculty, setFaculty]     = useState([]);
  const [depts, setDepts]         = useState([]);
  const [form, setForm]           = useState(empty);
  const [editId, setEditId]       = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [fr, dr] = await Promise.all([api.get("/faculty"), api.get("/departments")]);
    setFaculty(fr.data.data || []);
    setDepts(dr.data.data || []);
  };

  const getStatus = (assigned, max) => {
    const pct = (assigned / max) * 100;
    if (pct >= 100) return "OVERLOADED";
    if (pct >= 80)  return "NEAR_LIMIT";
    return "NORMAL";
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return toast.error("Name and email required");
    if (!editId && !form.password)  return toast.error("Password required for new faculty");
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/faculty/${editId}`, form);
        toast.success("Faculty updated");
        setEditId(null);
      } else {
        await api.post("/auth/register-faculty", form);
        toast.success("Faculty added");
      }
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  const startEdit = (f) => {
    setEditId(f.id);
    setForm({ name: f.name, email: f.email, password: "", department_id: f.department_id || "", designation: f.designation || "", max_hours: f.max_hours, phone: f.phone || "" });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/faculty/${confirm}`);
      toast.success("Faculty removed");
      load();
    } catch { toast.error("Delete failed"); }
    setConfirm(null);
  };

  const filtered = faculty.filter(f =>
    (f.name?.toLowerCase().includes(search.toLowerCase()) || f.email?.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || f.department_id == filter)
  );

  return (
    <DashboardLayout title="Faculty Management">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Add / Edit Form */}
        <div className="lg:col-span-2 card h-fit">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-5">
            {editId ? "Edit Faculty" : "Add New Faculty"}
          </h3>
          <div className="space-y-3">
            {[
              { label: "Full Name", key: "name", type: "text", ph: "Dr. John Doe" },
              { label: "Email", key: "email", type: "email", ph: "john@college.edu" },
              { label: "Password", key: "password", type: "password", ph: editId ? "Leave blank to keep" : "Min 6 characters" },
              { label: "Designation", key: "designation", type: "text", ph: "Associate Professor" },
              { label: "Phone", key: "phone", type: "text", ph: "9876543210" },
            ].map(({ label, key, type, ph }) => (
              <div key={key} className="form-group">
                <label className="label">{label}</label>
                <input type={type} className="input" placeholder={ph}
                  value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}

            <div className="form-group">
              <label className="label">Department</label>
              <select className="select" value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                <option value="">-- Select Department --</option>
                {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Max Hours/Week</label>
              <input type="number" className="input" min={8} max={30}
                value={form.max_hours} onChange={e => setForm({ ...form, max_hours: e.target.value })} />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Plus size={15} /> {editId ? "Update" : "Add Faculty"}
              </button>
              {editId && (
                <button onClick={() => { setEditId(null); setForm(empty); }} className="btn-secondary">Cancel</button>
              )}
            </div>
          </div>
        </div>

        {/* Faculty List */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-textMain dark:text-white">Faculty List</h3>
            <span className="text-xs text-textMuted">{faculty.length} total</span>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input className="input pl-9 text-xs" placeholder="Search faculty..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="select text-xs w-40" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Depts</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  {["Name", "Department", "Hours", "Status", "Actions"].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id}>
                    <td>
                      <p className="font-medium text-textMain dark:text-white text-sm">{f.name}</p>
                      <p className="text-xs text-textMuted">{f.designation}</p>
                    </td>
                    <td className="text-xs">{f.department || "—"}</td>
                    <td>
                      <span className="text-sm font-semibold text-textMain dark:text-white">{f.assigned_hours}</span>
                      <span className="text-xs text-textMuted">/{f.max_hours}h</span>
                    </td>
                    <td><StatusBadge status={getStatus(f.assigned_hours, f.max_hours)} /></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(f)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setConfirm(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={5} className="text-center py-8 text-textMuted text-sm">No faculty found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!confirm}
        title="Remove Faculty"
        message="This will permanently remove the faculty and all their allocations."
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </DashboardLayout>
  );
}
import { useEffect, useState } from "react";
import { Plus, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

export default function FacultyLeave() {
  const [leaves, setLeaves]   = useState([]);
  const [form, setForm]       = useState({ leave_type: "CASUAL", from_date: "", to_date: "", reason: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);
  const load = () => api.get("/leaves/my").then(r => setLeaves(r.data.data || []));

  const handleApply = async () => {
    if (!form.from_date || !form.to_date) return toast.error("Please select dates");
    if (new Date(form.from_date) > new Date(form.to_date)) return toast.error("Invalid date range");
    setLoading(true);
    try {
      await api.post("/leaves", form);
      toast.success("Leave application submitted");
      setForm({ leave_type: "CASUAL", from_date: "", to_date: "", reason: "" });
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const getDays = (from, to) => {
    const diff = new Date(to) - new Date(from);
    return Math.ceil(diff / (1000*60*60*24)) + 1;
  };

  return (
    <DashboardLayout title="Leave Management">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Apply form */}
        <div className="lg:col-span-2 card h-fit">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-5 flex items-center gap-2">
            <CalendarCheck size={16} className="text-primary"/> Apply for Leave
          </h3>
          <div className="space-y-3">
            <div className="form-group">
              <label className="label">Leave Type</label>
              <select className="select" value={form.leave_type} onChange={e => setForm({...form, leave_type: e.target.value})}>
                {["CASUAL","MEDICAL","DUTY","OTHER"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">From Date</label>
                <input type="date" className="input" value={form.from_date} onChange={e => setForm({...form, from_date: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">To Date</label>
                <input type="date" className="input" value={form.to_date} onChange={e => setForm({...form, to_date: e.target.value})} />
              </div>
            </div>
            {form.from_date && form.to_date && new Date(form.from_date) <= new Date(form.to_date) && (
              <p className="text-xs text-primary font-medium">{getDays(form.from_date, form.to_date)} day(s) requested</p>
            )}
            <div className="form-group">
              <label className="label">Reason</label>
              <textarea className="input min-h-[80px] resize-none" placeholder="Brief description..."
                value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
            </div>
            <button onClick={handleApply} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus size={14}/> {loading ? "Submitting..." : "Apply for Leave"}
            </button>
          </div>
        </div>

        {/* Leave history */}
        <div className="lg:col-span-3 card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-4">Leave History</h3>
          <div className="space-y-3">
            {leaves.map(l => (
              <div key={l.id} className="p-4 rounded-xl border border-border dark:border-borderDark">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-blue">{l.leave_type}</span>
                      <StatusBadge status={l.status} />
                    </div>
                    <p className="text-sm text-textMain dark:text-gray-300">
                      {new Date(l.from_date).toLocaleDateString()} → {new Date(l.to_date).toLocaleDateString()}
                      <span className="text-xs text-textMuted ml-2">({getDays(l.from_date, l.to_date)} days)</span>
                    </p>
                    <p className="text-xs text-textMuted mt-1">{l.reason}</p>
                    {l.admin_remarks && (
                      <p className="text-xs text-textMuted italic mt-1">Remarks: "{l.admin_remarks}"</p>
                    )}
                  </div>
                  <p className="text-xs text-textMuted">{new Date(l.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {!leaves.length && <div className="text-center py-12 text-textMuted text-sm">No leave applications</div>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
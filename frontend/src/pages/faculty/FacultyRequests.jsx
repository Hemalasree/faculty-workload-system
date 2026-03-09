import { useEffect, useState } from "react";
import { Plus, Send } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

export default function FacultyRequests() {
  const [requests, setRequests]   = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [form, setForm]           = useState({ type: "WORKLOAD_REDUCTION", subject_id: "", reason: "" });
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    load();
    api.get("/allocations/my").then(r => setSubjects(r.data.data || []));
  }, []);

  const load = () => api.get("/requests/my").then(r => setRequests(r.data.data || []));

  const handleSubmit = async () => {
    if (!form.reason) return toast.error("Reason is required");
    setLoading(true);
    try {
      await api.post("/requests", form);
      toast.success("Request submitted");
      setForm({ type: "WORKLOAD_REDUCTION", subject_id: "", reason: "" });
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const REQUEST_TYPES = ["WORKLOAD_REDUCTION","SUBJECT_SWAP","SCHEDULE_CHANGE","OTHER"];

  return (
    <DashboardLayout title="Workload Requests">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 card h-fit">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-5">Submit Request</h3>
          <div className="space-y-3">
            <div className="form-group">
              <label className="label">Request Type</label>
              <select className="select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {REQUEST_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Related Subject (optional)</label>
              <select className="select" value={form.subject_id} onChange={e => setForm({...form, subject_id: e.target.value})}>
                <option value="">General request</option>
                {subjects.map(s => <option key={s.id} value={s.subject_id}>{s.subject_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Reason</label>
              <textarea className="input min-h-[100px] resize-none" placeholder="Describe your request..."
                value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Send size={14}/> {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
        <div className="lg:col-span-3 card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-4">My Requests</h3>
          <div className="space-y-3">
            {requests.map(r => (
              <div key={r.id} className="p-4 rounded-xl border border-border dark:border-borderDark">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-blue">{r.type?.replace(/_/g," ")}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    {r.subject_name && <p className="text-xs text-textMuted mb-1">Subject: {r.subject_name}</p>}
                    <p className="text-sm text-textMain dark:text-gray-300">{r.reason}</p>
                    {r.admin_remarks && <p className="text-xs text-textMuted italic mt-1">"{r.admin_remarks}"</p>}
                  </div>
                  <p className="text-xs text-textMuted">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {!requests.length && <div className="text-center py-12 text-textMuted text-sm">No requests submitted</div>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
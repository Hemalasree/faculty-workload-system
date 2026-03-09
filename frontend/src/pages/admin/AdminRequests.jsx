import { useEffect, useState } from "react";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import api from "../../api/api";
import React from "react";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [leaves, setLeaves]     = useState([]);
  const [tab, setTab]           = useState("requests");
  const [remarks, setRemarks]   = useState({});

  useEffect(() => { load(); }, []);
  const load = async () => {
    const [rr, lr] = await Promise.all([api.get("/requests/all"), api.get("/leaves/all")]);
    setRequests(rr.data.data || []);
    setLeaves(lr.data.data || []);
  };

  const updateRequest = async (id, status) => {
    try {
      await api.put(`/requests/${id}/status`, { status, admin_remarks: remarks[id] || "" });
      toast.success(`Request ${status.toLowerCase()}`);
      load();
    } catch { toast.error("Failed"); }
  };

  const updateLeave = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status, admin_remarks: remarks[id] || "" });
      toast.success(`Leave ${status.toLowerCase()}`);
      load();
    } catch { toast.error("Failed"); }
  };

  const pendingCount = (arr) => arr.filter(r => r.status === "PENDING").length;

  return (
    <DashboardLayout title="Requests & Leave Management">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[
          { key: "requests", label: `Requests (${pendingCount(requests)} pending)` },
          { key: "leaves",   label: `Leaves (${pendingCount(leaves)} pending)` }
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-white dark:bg-cardDark shadow-sm text-primary" : "text-textMuted hover:text-textMain dark:hover:text-gray-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className="text-primary" />
                    <span className="text-sm font-semibold text-textMain dark:text-white">{r.faculty_name}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-textMuted mb-1">{r.department} • {r.type?.replace(/_/g," ")} • {r.subject_name || "General"}</p>
                  <p className="text-sm text-textMain dark:text-gray-300">{r.reason}</p>
                  <p className="text-xs text-textMuted mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                {r.status === "PENDING" && (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <input className="input text-xs" placeholder="Admin remarks (optional)"
                      value={remarks[r.id] || ""} onChange={e => setRemarks({ ...remarks, [r.id]: e.target.value })} />
                    <div className="flex gap-2">
                      <button onClick={() => updateRequest(r.id, "APPROVED")} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 transition-colors">
                        <CheckCircle size={13}/> Approve
                      </button>
                      <button onClick={() => updateRequest(r.id, "REJECTED")} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                        <XCircle size={13}/> Reject
                      </button>
                    </div>
                  </div>
                )}
                {r.status !== "PENDING" && r.admin_remarks && (
                  <p className="text-xs text-textMuted italic">"{r.admin_remarks}"</p>
                )}
              </div>
            </div>
          ))}
          {!requests.length && <div className="card text-center py-12 text-textMuted">No requests yet</div>}
        </div>
      )}

      {tab === "leaves" && (
        <div className="space-y-4">
          {leaves.map(l => (
            <div key={l.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-textMain dark:text-white">{l.faculty_name}</span>
                    <StatusBadge status={l.status} />
                    <span className="badge-gray">{l.leave_type}</span>
                  </div>
                  <p className="text-xs text-textMuted mb-1">{l.department}</p>
                  <p className="text-sm">{new Date(l.from_date).toLocaleDateString()} → {new Date(l.to_date).toLocaleDateString()}</p>
                  <p className="text-sm text-textMain dark:text-gray-300 mt-1">{l.reason}</p>
                </div>
                {l.status === "PENDING" && (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <input className="input text-xs" placeholder="Remarks..."
                      value={remarks[l.id] || ""} onChange={e => setRemarks({ ...remarks, [l.id]: e.target.value })} />
                    <div className="flex gap-2">
                      <button onClick={() => updateLeave(l.id, "APPROVED")} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition-colors">
                        <CheckCircle size={13}/> Approve
                      </button>
                      <button onClick={() => updateLeave(l.id, "REJECTED")} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                        <XCircle size={13}/> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!leaves.length && <div className="card text-center py-12 text-textMuted">No leave applications</div>}
        </div>
      )}
    </DashboardLayout>
  );
}
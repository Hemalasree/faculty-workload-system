import React from "react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmLabel = "Delete", danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-cardDark border border-border dark:border-borderDark rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-base font-semibold text-textMain dark:text-white mb-2">{title}</h2>
        <p className="text-sm text-textMuted dark:text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className={danger ? "btn-danger" : "btn-primary"}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
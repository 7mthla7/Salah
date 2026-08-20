import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={32} color={danger ? 'var(--danger)' : 'var(--warning)'} />
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-msg">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

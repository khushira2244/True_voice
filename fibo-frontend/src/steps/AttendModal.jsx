// src/app/steps/AttendModal.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * AttendModal
 * - Reusable modal to mark an episode as "attended"
 * - Returns minimal info to parent via onSubmit(payload)
 *
 * payload shape:
 * {
 *   type: "guardian" | "other",
 *   name: string,
 *   relationship: string,
 *   attendedAt: ISOString
 * }
 */
export default function AttendModal({
  open,
  title = "Mark as attended",
  initialMode = "guardian", // "guardian" | "other"
  guardianDefault = { name: "", relationship: "Mother" }, // from profile (optional)
  onClose,
  onSubmit,
}) {
  const [mode, setMode] = useState(initialMode);

  const [guardianName, setGuardianName] = useState(guardianDefault?.name || "");
  const [guardianRel, setGuardianRel] = useState(
    guardianDefault?.relationship || "Mother"
  );

  const [otherName, setOtherName] = useState("");
  const [otherRel, setOtherRel] = useState("");

  const [err, setErr] = useState("");

  // reset on open
  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setGuardianName(guardianDefault?.name || "");
    setGuardianRel(guardianDefault?.relationship || "Mother");
    setOtherName("");
    setOtherRel("");
    setErr("");
  }, [open, initialMode, guardianDefault?.name, guardianDefault?.relationship]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isOther = mode === "other";

  const canSubmit = useMemo(() => {
    if (mode === "guardian") {
      return guardianName.trim().length > 0 && guardianRel.trim().length > 0;
    }
    return otherName.trim().length > 0 && otherRel.trim().length > 0;
  }, [mode, guardianName, guardianRel, otherName, otherRel]);

  function validate() {
    if (mode === "guardian") {
      if (!guardianName.trim()) return "Guardian name is required.";
      if (!guardianRel.trim()) return "Relationship is required.";
      return "";
    }
    if (!otherName.trim()) return "Name is required.";
    if (!otherRel.trim()) return "Relationship is required.";
    return "";
  }

  function handleSubmit() {
    const msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }
    setErr("");

    const payload = {
      type: mode,
      name: mode === "guardian" ? guardianName.trim() : otherName.trim(),
      relationship: mode === "guardian" ? guardianRel.trim() : otherRel.trim(),
      attendedAt: new Date().toISOString(),
    };

    onSubmit?.(payload);
  }

  if (!open) return null;

  return (
    <div
      className="tv-modal-overlay"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="tv-modal" role="dialog" aria-modal="true">
        <div className="tv-modal-head">
          <div className="tv-modal-title">{title}</div>
          <button className="tv-modal-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="tv-modal-sub">
          Choose who attended this episode. This will be used in analytics.
        </div>

        {/* Tabs */}
        <div className="tv-tabs">
          <button
            type="button"
            className={`tv-tab ${mode === "guardian" ? "is-active" : ""}`}
            onClick={() => {
              setMode("guardian");
              setErr("");
            }}
          >
            Guardian
          </button>

          <button
            type="button"
            className={`tv-tab ${mode === "other" ? "is-active" : ""}`}
            onClick={() => {
              setMode("other");
              setErr("");
            }}
          >
            Other
          </button>
        </div>

        {/* Body */}
        <div className="tv-modal-body">
          {!isOther ? (
            <>
              <label className="tv-field">
                <div className="tv-label">Guardian Name</div>
                <input
                  className="tv-input"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g., Khushboo"
                  autoComplete="name"
                />
              </label>

              <label className="tv-field">
                <div className="tv-label">Relationship</div>
                <select
                  className="tv-input"
                  value={guardianRel}
                  onChange={(e) => setGuardianRel(e.target.value)}
                >
                  <option>Mother</option>
                  <option>Father</option>
                  <option>Guardian</option>
                  <option>Caregiver</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <label className="tv-field">
                <div className="tv-label">Name</div>
                <input
                  className="tv-input"
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  placeholder="e.g., Aunt / Relative name"
                  autoComplete="name"
                />
              </label>

              <label className="tv-field">
                <div className="tv-label">Relationship</div>
                <input
                  className="tv-input"
                  value={otherRel}
                  onChange={(e) => setOtherRel(e.target.value)}
                  placeholder="e.g., Aunt / Uncle / Relative"
                />
              </label>

              <div className="tv-hint">
                Tip: This info stays for the current session. (We’ll store it
                later if needed.)
              </div>
            </>
          )}

          {err ? <div className="tv-error">{err}</div> : null}
        </div>

        {/* Footer */}
        <div className="tv-modal-actions">
          <button className="tv-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="tv-btn tv-btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Minimal styles - keep or move to App.css */}
      <style>{`
        .tv-modal-overlay{
          position:fixed; inset:0; z-index:99999;
          background:rgba(0,0,0,.45);
          display:grid; place-items:center;
          padding:18px;
        }
        .tv-modal{
          width:min(520px, 95vw);
          background:rgba(255,255,255,.92);
          backdrop-filter: blur(8px);
          border-radius:18px;
          box-shadow:0 20px 60px rgba(0,0,0,.25);
          border:1px solid rgba(0,0,0,.08);
          overflow:hidden;
        }
        .tv-modal-head{
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 16px 8px;
        }
        .tv-modal-title{font-size:18px; font-weight:900; color:#0f172a;}
        .tv-modal-x{
          width:36px; height:36px; border-radius:10px;
          border:1px solid rgba(0,0,0,.12);
          background:white; cursor:pointer; font-weight:900;
        }
        .tv-modal-sub{
          padding:0 16px 12px;
          opacity:.75;
          font-size:13px;
          line-height:1.35;
        }
        .tv-tabs{
          display:flex; gap:8px; padding:0 16px 12px;
        }
        .tv-tab{
          flex:1;
          height:40px;
          border-radius:12px;
          border:1px solid rgba(0,0,0,.12);
          background:white;
          font-weight:800;
          cursor:pointer;
        }
        .tv-tab.is-active{
          background:rgba(217,139,0,.12);
          border-color:rgba(217,139,0,.35);
        }
        .tv-modal-body{
          padding:0 16px 12px;
          display:flex;
          flex-direction:column;
          gap:12px;
        }
        .tv-field{display:flex; flex-direction:column; gap:6px;}
        .tv-label{font-weight:800; color:#0f172a;}
        .tv-input{
          height:44px;
          border-radius:12px;
          border:1px solid rgba(0,0,0,.14);
          padding:0 12px;
          outline:none;
          background:white;
        }
        .tv-input:focus{border-color:rgba(0,0,0,.35);}
        .tv-hint{font-size:12px; opacity:.72; margin-top:-4px;}
        .tv-error{
          background:rgba(255,0,0,.08);
          border:1px solid rgba(255,0,0,.2);
          padding:10px 12px;
          border-radius:12px;
          font-weight:800;
          color:#7f1d1d;
        }
        .tv-modal-actions{
          padding:12px 16px 16px;
          display:flex; justify-content:flex-end; gap:10px;
          border-top:1px solid rgba(0,0,0,.08);
          background:rgba(255,255,255,.75);
        }
        .tv-btn{
          height:42px;
          padding:0 14px;
          border-radius:12px;
          border:1px solid rgba(0,0,0,.14);
          background:white;
          cursor:pointer;
          font-weight:900;
        }
        .tv-btn:disabled{opacity:.55; cursor:not-allowed;}
        .tv-btn-primary{
          background:#d98b00;
          color:white;
          border-color:#d98b00;
        }
      `}</style>
    </div>
  );
}

// src/app/steps/AttendModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import SupportImagePanel from "./SupportImagePanel.jsx";

/**
 * AttendModal (2-step)
 * stage:
 *  - "attend": fill who attended
 *  - "support": generate/choose support image OR skip
 *
 * Final payload returned to parent via onSubmit:
 * {
 *   attended: true,
 *   attendedBy: { type, name, relationship, attendedAt },
 *   support: { promptMeta, imageUrl, createdAt } | null
 * }
 */
export default function AttendModal({
  open,
  title = "Mark as attended",
  initialMode = "guardian", // "guardian" | "other"
  guardianDefault = { name: "", relationship: "Mother" },

  // Optional: pass context so SupportImagePanel can include scenario info
  scenarioMeta = null, // e.g. { heroId, scenarioId, symptomId, severityId, scenarioLabel }

  onClose,
  onSubmit,

  // ✅ NEW: forwarded from App.jsx so SupportImagePanel can live-update header
  // Pass setHeaderOverride as this prop.
  onHeaderChange,
}) {
  const [stage, setStage] = useState("attend"); // "attend" | "support"
  const [attendedByDraft, setAttendedByDraft] = useState(null);

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

    setStage("attend");
    setAttendedByDraft(null);

    setMode(initialMode);
    setGuardianName(guardianDefault?.name || "");
    setGuardianRel(guardianDefault?.relationship || "Mother");
    setOtherName("");
    setOtherRel("");
    setErr("");

    // ✅ ensure header override resets when modal opens fresh
    onHeaderChange?.(null);
  }, [
    open,
    initialMode,
    guardianDefault?.name,
    guardianDefault?.relationship,
    onHeaderChange,
  ]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") {
        onHeaderChange?.(null);
        onClose?.();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onHeaderChange]);

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

  // Step 1 confirm → move to Support step
  function handleConfirmAttended() {
    const msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }
    setErr("");

    const attendedBy = {
      type: mode,
      name: mode === "guardian" ? guardianName.trim() : otherName.trim(),
      relationship: mode === "guardian" ? guardianRel.trim() : otherRel.trim(),
      attendedAt: new Date().toISOString(),
    };

    setAttendedByDraft(attendedBy);

    // ✅ when we enter support step, show default header text (until user types)
    onHeaderChange?.("We are here For You");

    setStage("support");
  }

  // ✅ central finish helper: parent always gets consistent payload
  function finish(supportPayloadOrNull = null) {
-  onHeaderChange?.(null);

  onSubmit?.({
    attended: true,
    attendedBy: attendedByDraft,
    support: supportPayloadOrNull
      ? { ...supportPayloadOrNull, createdAt: new Date().toISOString() }
      : null,
  });
}


  if (!open) return null;

  // ✅ PORTAL SUPPORT STEP (no nested modal, no clipping, no double overlay)
  if (stage === "support") {
    return createPortal(
      <SupportImagePanel
        scenarioMeta={scenarioMeta}
        attendedBy={attendedByDraft}
        initialMessage=""

        // ✅ NEW: push header text live while typing
        onHeaderChange={onHeaderChange}
        // (SupportImagePanel will call onHeaderChange(val) on input change)

        onBack={() => {
          onHeaderChange?.(null);
          setStage("attend");
        }}
        onSkip={() => finish(null)}
        onDone={(supportPayload) => {
          // SupportImagePanel can call onDone() with or without payload
          // If it returns nothing, treat as "no support"
          finish(supportPayload || null);
        }}
      />,
      document.body
    );
  }

  // ✅ ATTEND STEP (normal modal)
  return (
    <div
      className="tv-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onHeaderChange?.(null);
          onClose?.();
        }
      }}
    >
      <div className="tv-modal" role="dialog" aria-modal="true">
        <div className="tv-modal-head">
          <div className="tv-modal-title">{title}</div>
          <button
            className="tv-modal-x"
            onClick={() => {
              onHeaderChange?.(null);
              onClose?.();
            }}
            aria-label="Close"
          >
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
          {mode !== "other" ? (
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
          <button
            className="tv-btn"
            onClick={() => {
              onHeaderChange?.(null);
              onClose?.();
            }}
          >
            Cancel
          </button>

          <button
            className="tv-btn tv-btn-primary"
            onClick={handleConfirmAttended}
            disabled={!canSubmit}
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Inline styles (kept from your original) */}
      <style>{`
        .tv-modal-overlay{
          position:fixed; inset:0; z-index:99999;
          background:rgba(0,0,0,.45);
          display:grid; place-items:center;
          padding:18px;
        }
        .tv-modal{
          width:min(720px, 95vw);
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

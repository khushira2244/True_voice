// ProfileStep.jsx
import React, { useMemo, useState } from "react";

function inferAgeGroup(age) {
    const n = Number(age);
    if (!Number.isFinite(n)) return "5-12";
    if (n <= 5) return "3-5";
    if (n <= 12) return "5-12";
    return "13-18";
}

function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function Accordion({ title, subtitle, isOpen, onToggle, children, rightBadge }) {
    return (
        <div className="acc">
            <button
                type="button"
                className="acc-head"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className="acc-head-left">
                    <div className="acc-title">{title}</div>
                    {subtitle ? <div className="acc-sub">{subtitle}</div> : null}
                </div>

                <div className="acc-head-right">
                    {rightBadge ? <span className="acc-badge">{rightBadge}</span> : null}
                    <span className={`acc-chevron ${isOpen ? "open" : ""}`}>⌄</span>
                </div>
            </button>

            <div className={`acc-body ${isOpen ? "open" : ""}`}>
                <div className="acc-inner">{children}</div>
            </div>
        </div>
    );
}

export default function ProfileStep({ initialProfile = null, onBack, onContinue }) {
    const [childName, setChildName] = useState(initialProfile?.childName || "");
    const [childAge, setChildAge] = useState(
        initialProfile?.childAge?.toString?.() || ""
    );

    const [guardianName, setGuardianName] = useState(
        initialProfile?.guardianName || ""
    );
    const [guardianEmail, setGuardianEmail] = useState(
        initialProfile?.guardianEmail || ""
    );
    const [relationship, setRelationship] = useState(
        initialProfile?.relationship || "Mother"
    );

    const [err, setErr] = useState("");


    const [openChild, setOpenChild] = useState(true);
    const [openGuardian, setOpenGuardian] = useState(false);
    const [openSection, setOpenSection] = useState("child");

    function toggleSection(key) {
        setOpenSection((prev) => (prev === key ? null : key));
    }
    const ageGroup = useMemo(() => inferAgeGroup(childAge), [childAge]);

    const childValid = useMemo(() => {
        const ageNum = Number(childAge);
        if (!childName.trim()) return false;
        if (!childAge.trim() || !Number.isFinite(ageNum)) return false;
        if (ageNum < 2 || ageNum > 18) return false;
        return true;
    }, [childName, childAge]);

    const guardianValid = useMemo(() => {
        if (!guardianName.trim()) return false;
        if (!guardianEmail.trim() || !isEmail(guardianEmail)) return false;
        if (!relationship.trim()) return false;
        return true;
    }, [guardianName, guardianEmail, relationship]);

    const canContinue = childValid && guardianValid;

    function validate() {
        const ageNum = Number(childAge);

        if (!childName.trim()) return { msg: "Child name is required.", open: "child" };
        if (!childAge.trim() || !Number.isFinite(ageNum))
            return { msg: "Age must be a number.", open: "child" };
        if (ageNum < 2 || ageNum > 18)
            return { msg: "Age must be between 2 and 18.", open: "child" };

        if (!guardianName.trim())
            return { msg: "Guardian name is required.", open: "guardian" };
        if (!guardianEmail.trim())
            return { msg: "Guardian email is required.", open: "guardian" };
        if (!isEmail(guardianEmail))
            return { msg: "Enter a valid guardian email.", open: "guardian" };
        if (!relationship.trim())
            return { msg: "Relationship is required.", open: "guardian" };

        return { msg: "", open: null };
    }

    function handleSubmit(e) {
        e.preventDefault();

        const { msg, open } = validate();
        if (msg) {
            setErr(msg);

            // expand the relevant accordion so user sees the fields
            if (open === "child") setOpenChild(true);
            if (open === "guardian") setOpenGuardian(true);
            return;
        }

        setErr("");

        const payload = {
            childName: childName.trim(),
            childAge: Number(childAge),
            ageGroup,
            guardianName: guardianName.trim(),
            guardianEmail: guardianEmail.trim(),
            relationship: relationship.trim(),
        };

        onContinue?.(payload);
    }

    return (
        <div className="step-shell">
            <div className="step-card">
                <div className="step-title">Profile</div>
                <div className="step-subtitle">
                    This keeps the language age-appropriate and shares the report with the guardian.
                </div>

                <form onSubmit={handleSubmit} className="form-col">
                    <Accordion
                        title="Child Details"
                        subtitle="Name + age → helps choose age-appropriate prompts."
                        isOpen={openSection === "child"}
                        onToggle={() =>
                            setOpenSection((prev) => (prev === "child" ? null : "child"))
                        }
                        rightBadge={childValid ? "✓" : ""}
                    >
                        <label className="field">
                            <div className="field-label">Child Name</div>
                            <input
                                className="field-input"
                                value={childName}
                                onChange={(e) => setChildName(e.target.value)}
                                placeholder="e.g., Riya"
                                autoComplete="name"
                            />
                        </label>

                        <label className="field">
                            <div className="field-label">Age</div>
                            <input
                                className="field-input"
                                value={childAge}
                                onChange={(e) => setChildAge(e.target.value)}
                                placeholder="e.g., 7"
                                inputMode="numeric"
                            />
                            <div className="field-hint">
                                Age group: <b>{ageGroup}</b>
                            </div>
                        </label>
                    </Accordion>

                    <Accordion
                        title="Guardian Details"
                        subtitle="Who should receive/support the report."
                        isOpen={openSection === "guardian"}
                        onToggle={() =>
                            setOpenSection((prev) => (prev === "guardian" ? null : "guardian"))
                        }
                        rightBadge={guardianValid ? "✓" : ""}
                    >
                        <label className="field">
                            <div className="field-label">Guardian Name</div>
                            <input
                                className="field-input"
                                value={guardianName}
                                onChange={(e) => setGuardianName(e.target.value)}
                                placeholder="e.g., Khushboo"
                                autoComplete="name"
                            />
                        </label>

                        <label className="field">
                            <div className="field-label">Guardian Email</div>
                            <input
                                className="field-input"
                                value={guardianEmail}
                                onChange={(e) => setGuardianEmail(e.target.value)}
                                placeholder="e.g., parent@gmail.com"
                                autoComplete="email"
                            />
                        </label>

                        <label className="field">
                            <div className="field-label">Relationship</div>
                            <select
                                className="field-input"
                                value={relationship}
                                onChange={(e) => setRelationship(e.target.value)}
                            >
                                <option>Mother</option>
                                <option>Father</option>
                                <option>Guardian</option>
                                <option>Other</option>
                            </select>
                        </label>

                        {relationship === "Other" ? (
                            <div className="field-hint">
                                You can keep “Other” or refine it later in the report view.
                            </div>
                        ) : null}
                    </Accordion>

                    {err ? <div className="form-error">{err}</div> : null}

                    <div className="form-actions">
                        {onBack ? (
                            <button type="button" className="btn" onClick={onBack}>
                                Back
                            </button>
                        ) : (
                            <span />
                        )}

                        <button type="submit" className="btn btn-primary" disabled={!canContinue}>
                            Continue
                        </button>
                    </div>
                </form>
            </div>


            <style>{`
        .step-shell{min-height:calc(100vh - 90px);display:grid;place-items:center;padding:24px;}
        .step-card{width:min(560px,92vw);background:rgba(255,255,255,.85);backdrop-filter:blur(6px);
          border-radius:18px;padding:18px 18px 16px;box-shadow:0 12px 30px rgba(0,0,0,.12);}
        .step-title{font-size:22px;font-weight:800;margin-bottom:6px;}
        .step-subtitle{opacity:.8;margin-bottom:14px;line-height:1.35;}
        .form-col{display:flex;flex-direction:column;gap:12px;}

        /* Accordion */
        .acc{border:1px solid rgba(0,0,0,.12);border-radius:16px;overflow:hidden;background:rgba(255,255,255,.7);}
        .acc-head{width:100%;text-align:left;border:none;background:transparent;cursor:pointer;
          display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 12px;}
        .acc-head-left{display:flex;flex-direction:column;gap:2px;}
        .acc-title{font-weight:900;font-size:16px;}
        .acc-sub{font-size:12px;opacity:.75;}
        .acc-head-right{display:flex;align-items:center;gap:10px;}
        .acc-badge{font-weight:900;border:1px solid rgba(0,0,0,.15);padding:2px 8px;border-radius:999px;background:white;}
        .acc-chevron{display:inline-block;transition:transform .18s ease;opacity:.7;}
        .acc-chevron.open{transform:rotate(180deg);}

        .acc-body{max-height:0;overflow:hidden;transition:max-height .22s ease;}
        .acc-body.open{max-height:520px;} /* enough for inputs; prevents overflow */
        .acc-inner{padding:12px 12px 14px;border-top:1px solid rgba(0,0,0,.10);display:flex;flex-direction:column;gap:12px;}

        /* Fields */
        .field{display:flex;flex-direction:column;gap:6px;}
        .field-label{font-weight:700;}
        .field-input{
  height:44px;
  border-radius:12px;
  border:1px solid rgba(0,0,0,.15);
  padding:0 12px;
  outline:none;

  /* 🔒 lock background */
  background-color:#dadee8 !important;
  color:#0f172a;

  /* 🔒 stop browser highlight */
  -webkit-appearance: none;
  appearance: none;
}

/* 🔥 VERY IMPORTANT: stop focus/active override */
.field-input:focus,
.field-input:active,
.field-input:focus-visible{
  background-color:#dadee8 !important;
  color:#0f172a;
  border-color: rgba(0,0,0,.35);
  outline: none;
  box-shadow: none;
}

/* Placeholder */
.field-input::placeholder{
  color: rgba(15,23,42,.55);
}


        .form-error{background:rgba(255,0,0,.08);border:1px solid rgba(255,0,0,.2);
          padding:10px 12px;border-radius:12px;font-weight:700;color:#7f1d1d;}
        .form-actions{display:flex;justify-content:space-between;align-items:center;margin-top:6px;}
        .btn{height:42px;padding:0 14px;border-radius:12px;border:1px solid rgba(0,0,0,.15);background:white;cursor:pointer;font-weight:700;}
        .btn:disabled{opacity:.55;cursor:not-allowed;}
        .btn-primary{background:#d98b00;color:white;border-color:#d98b00;}
      `}</style>
        </div>
    );
}

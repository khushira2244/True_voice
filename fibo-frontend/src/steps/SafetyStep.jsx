import React, { useEffect, useState } from "react";
import { api } from "../api.js";

function SafetyStep({ episodeState, onRedEmergency, onGreenContinue, onBack }) {
  const [options, setOptions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.getSafety();
        if (resp?.ok && Array.isArray(resp.options)) {
          setOptions(resp.options);
        }
      } catch (e) {
        console.error("Load safety options failed", e);
      }
    })();
  }, []);

  const current = options[currentIdx] || null;

  function next() {
    if (options.length === 0) return;
    setCurrentIdx((i) => (i + 1) % options.length);
  }

  function prev() {
    if (options.length === 0) return;
    setCurrentIdx((i) => (i - 1 + options.length) % options.length);
  }

  function handleSelect() {
    if (!current) return;
    if (current.riskTag === "red") {
      onRedEmergency(current.id);
    } else {
      onGreenContinue(current.id);
    }
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-title">Is anything big scary happening?</div>
        <div className="step-subtitle">
          This helps us keep you safe first, then talk about feelings.
        </div>
      </div>

      <div className="image-frame">
        {/* Later: static emergency / OK hero illustration */}
        <span style={{ color: "#9ca3af", fontSize: 14 }}>
          Safety hero image will appear here.
        </span>
      </div>

      <div className="carousel-shell">
        {current && (
          <>
            <div
              className="carousel-main-card"
              style={{
                background:
                  current.riskTag === "red" ? "#FEE2E2" : "#DCFCE7",
              }}
            >
              <div>
                <div className="carousel-title">
                  {current.childLabel || current.label}
                </div>
                <div className="carousel-desc">{current.description}</div>
              </div>
              <div className="carousel-controls">
                <button className="btn btn-secondary" onClick={prev}>
                  ◀
                </button>
                <span>
                  {currentIdx + 1} / {options.length}
                </span>
                <button className="btn btn-secondary" onClick={next}>
                  ▶
                </button>
              </div>
            </div>

            <div className="button-row">
              <button className="btn btn-secondary" onClick={onBack}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleSelect}>
                {current.riskTag === "red"
                  ? "This is happening"
                  : "This feels like me"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SafetyStep;

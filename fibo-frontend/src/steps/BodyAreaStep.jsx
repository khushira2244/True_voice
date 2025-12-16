import React, { useEffect, useState } from "react";
import { api } from "../api.js";

function BodyAreaStep({ episodeState, onSelectBodyArea, onBack }) {
  const [areas, setAreas] = useState([]);
  const [selectedId, setSelectedId] = useState(episodeState.bodyAreaId || null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.getBodyAreas();
        if (resp?.ok && Array.isArray(resp.bodyAreas)) {
          setAreas(resp.bodyAreas);
        }
      } catch (e) {
        console.error("Load body areas failed", e);
      }
    })();
  }, []);

  function handleContinue() {
    if (!selectedId) return;
    let nonSpecific = null;
    const area = areas.find((a) => a.id === selectedId);
    if (area?.pathType === "non_specific_entry") {
      nonSpecific = "unknown";
    }
    onSelectBodyArea(selectedId, nonSpecific);
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-title">Where does it feel bad?</div>
        <div className="step-subtitle">
          If it’s hard to point, you can choose “I don’t know”.
        </div>
      </div>

      <div className="image-frame">
        <span style={{ color: "#9ca3af", fontSize: 14 }}>
          Later we can add a soft body outline here.
        </span>
      </div>

      <div className="option-list">
        {areas.map((a) => (
          <button
            key={a.id}
            className={
              "option-item " + (a.id === selectedId ? "selected" : "")
            }
            onClick={() => setSelectedId(a.id)}
          >
            <div className="option-label">{a.label}</div>
            {a.description && (
              <div className="option-desc">{a.description}</div>
            )}
          </button>
        ))}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          disabled={!selectedId}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default BodyAreaStep;

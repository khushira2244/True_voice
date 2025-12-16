import React, { useEffect, useState } from "react";
import { api } from "../api.js";

function ScenarioStep({ episodeState, onSelectScenario, onBack }) {
  const [scenarios, setScenarios] = useState([]);
  const [selectedId, setSelectedId] = useState(episodeState.scenarioId || null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.getScenarios();
        if (resp?.ok && Array.isArray(resp.scenarios)) {
          setScenarios(resp.scenarios);
        }
      } catch (e) {
        console.error("Load scenarios failed", e);
      }
    })();
  }, []);

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-title">Where are you?</div>
        <div className="step-subtitle">
          Choose the place that feels most like now.
        </div>
      </div>

      <div className="image-frame">
        <span style={{ color: "#9ca3af", fontSize: 14 }}>
          Later we can show a place illustration here.
        </span>
      </div>

      <div className="option-list">
        {scenarios.map((s) => (
          <button
            key={s.id}
            className={
              "option-item " + (s.id === selectedId ? "selected" : "")
            }
            onClick={() => setSelectedId(s.id)}
          >
            <div className="option-label">{s.label}</div>
            {s.description && (
              <div className="option-desc">{s.description}</div>
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
          onClick={() => selectedId && onSelectScenario(selectedId)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default ScenarioStep;

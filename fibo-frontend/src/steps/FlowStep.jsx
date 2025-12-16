import React, { useEffect, useState } from "react";
import { api } from "../api.js";

function FlowStep({ episodeState, onUpdateEpisode, onFinish, onBack }) {
  const [loading, setLoading] = useState(true);
  const [uiPayload, setUiPayload] = useState(null);
  const [error, setError] = useState(null);

  async function loadNext() {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.nextFlow(episodeState);
      if (!resp.ok) throw new Error(resp.error || "Flow failed");
      setUiPayload(resp);
    } catch (e) {
      console.error("Flow /next failed", e);
      setError("Something went wrong asking the helper.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="step-container">
        <div className="step-header">
          <div className="step-title">Thinking about next step…</div>
          <div className="step-subtitle">Asking LLM planner.</div>
        </div>
        <div className="image-frame">
          <span style={{ color: "#9ca3af", fontSize: 14 }}>
            Image loading…
          </span>
        </div>
      </div>
    );
  }

  if (error || !uiPayload) {
    return (
      <div className="step-container">
        <div className="step-header">
          <div className="step-title">Oops.</div>
          <div className="step-subtitle">{error || "No flow data."}</div>
        </div>
        <div className="button-row">
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button className="btn btn-primary" onClick={loadNext}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (uiPayload.next_step === "finish") {
    onFinish();
    return null;
  }

  const stepLabelMap = {
    ask_feeling: "What does it feel like?",
    ask_intensity: "How strong is it?",
    ask_behaviour: "What is your body doing?",
  };

  const title = stepLabelMap[uiPayload.next_step] || "Next question";
  const options = uiPayload.options || [];

  function handleOptionSelect(option) {
    const patch = {};
    if (uiPayload.next_step === "ask_feeling") {
      patch.feelingId = option.id;
    } else if (uiPayload.next_step === "ask_intensity") {
      patch.intensityId = option.id;
    } else if (uiPayload.next_step === "ask_behaviour") {
      patch.behaviourId = option.id;
    }
    onUpdateEpisode(patch);
    loadNext();
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-title">{title}</div>
        <div className="step-subtitle">
          Tap the one that looks or sounds closest.
        </div>
      </div>

      <div className="image-frame">
        {uiPayload.image_url ? (
          <img src={uiPayload.image_url} alt="Hero state" />
        ) : (
          <span style={{ color: "#9ca3af", fontSize: 14 }}>
            Helper did not send an image this time.
          </span>
        )}
      </div>

      <div className="option-list">
        {options.map((opt) => (
          <button
            key={opt.id}
            className="option-item"
            onClick={() => handleOptionSelect(opt)}
          >
            <div className="option-label">{opt.label}</div>
            {opt.description && (
              <div className="option-desc">{opt.description}</div>
            )}
          </button>
        ))}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}

export default FlowStep;

import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { INITIAL_EPISODE_STATE } from "./episodeState.js";
import { seedFakeEpisodes, EPISODE_KEY } from "./data/fakeEpisode.js";


import Landing from "./steps/Landing.jsx";
import LoginPage from "./steps/Login.jsx";
import HeroStep from "./steps/HeroStep.jsx";
import "./App.css";


import {
  HERO_SCENARIO_,
  HERO_SCENARIO_SYMPTOMS,
  HERO_SCENARIO_SYMPTOM_WITH_SRVERITY,
} from "./data/heroes";


import avaSympathyImg from "./data/ava_symphathy.png";

const STEP_ORDER = ["landing", "login", "hero", "scenario", "symptoms", "severity", "final"];

function CarouselStep({ items, onPick, onBack, debugName = "step" }) {
  const [idx, setIdx] = useState(0);

  // ✅ reset index whenever items change (IMPORTANT FIX)
  useEffect(() => {
    setIdx(0);
    console.log(`[${debugName}] items changed -> reset idx=0`, {
      len: items?.length,
      items,
    });
  }, [items]); // (using items is safest)

  const current = items?.[idx] || null;

  // ✅ log every render state
  useEffect(() => {
    console.log(`[${debugName}] render`, {
      idx,
      itemsLen: items?.length,
      current,
      currentSrc: current?.imageUrl,
    });
  }, [debugName, idx, items, current]);

  function next() {
    if (!items?.length) return;
    setIdx((i) => (i + 1) % items.length);
  }

  function prev() {
    if (!items?.length) return;
    setIdx((i) => (i - 1 + items.length) % items.length);
  }

  return (
    <div className="step-container hero-step">
      <button type="button" className="hero-nav hero-nav-left" onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}>
        ◀
      </button>

      <button type="button" className="hero-nav hero-nav-right" onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}>
        ▶
      </button>

      <div className="hero-card">
        {/* ✅ if current is null, show placeholder text (no broken img) */}
        {current?.imageUrl ? (
          <img
            src={current.imageUrl}
            alt={current.id || "option"}
            className="hero-main-image"
            onClick={() => onPick?.(current)}
            onError={(e) => {
              console.error(`[${debugName}] IMG ERROR`, {
                idx,
                src: e.currentTarget?.src,
                current,
                items,
              });
            }}
            onLoad={() => {
              console.log(`[${debugName}] IMG LOADED`, { idx, src: current.imageUrl });
            }}
          />
        ) : (
          <div style={{ color: "white", padding: 20, fontWeight: 700 }}>
            No image available (idx={idx}, len={items?.length})
          </div>
        )}
      </div>

      {onBack ? (
        <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 9999 }}>
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      ) : null}
    </div>
  );
}


function App() {
  const [backendOk, setBackendOk] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const [currentStep, setCurrentStep] = useState("landing");
  const [authed, setAuthed] = useState(false);

   const [finalView, setFinalView] = useState("episodes"); // "episodes" | "analytics"

  const [episodeState, setEpisodeState] = useState(INITIAL_EPISODE_STATE);

  const [showSympathy, setShowSympathy] = useState(false);
  const [pendingSymptomId, setPendingSymptomId] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const resp = await api.health();
        if (resp?.ok) setBackendOk(true);
      } catch (e) {
        console.error("Health check failed", e);
      } finally {
        setLoadingHealth(false);
      }
    })();
  }, []);

  useEffect(() => {

    if (currentStep === "symptoms" && episodeState?.symptomId && episodeState.symptomId !== "emergency") {
      goTo("severity");
    }
  }, [currentStep, episodeState?.symptomId]);

  useEffect(() => {
  if (currentStep === "final") setFinalView("episodes");
}, [currentStep]);


  function updateEpisode(patch) {
    setEpisodeState((prev) => ({ ...prev, ...patch }));
  }

  function goTo(step) {
    setCurrentStep(step);
  }


  const headerText = useMemo(() => {
    switch (currentStep) {
      case "hero":
        return "You can share your feeling with your HERO";
      case "scenario":
        return "Where are you right now?";
      case "symptoms":
        return (
          <>
            What kind of problem are you facing?
            <br />
            Head | Chest | Stomach | Leg | Throat | Emergency
          </>
        );

      case "severity":
        return "Is it more or normal problem?";
      case "final":
        return "All done 💌";
      default:
        return "";
    }
  }, [currentStep]);


  if (currentStep === "landing") {
    return <Landing ms={4000} onDone={() => goTo("login")} />;
  }


  if (currentStep === "login") {
    return (
      <LoginPage
        onSuccess={() => {
          setAuthed(true);

       
          const existing = JSON.parse(localStorage.getItem(EPISODE_KEY) || "[]");
          if (!existing.length) {
            const eps = seedFakeEpisodes({ count: 20 });
            console.log("✅ Demo seeded episodes:", eps);
          } else {
            console.log("ℹ️ Episodes already exist, not seeding again.", existing.length);
          }

          goTo("hero");
        }}
      />

    );
  }

  async function showSympathyThenSaveAndFinish(payload) {
    setShowSympathy(true);

    setTimeout(() => {
      setShowSympathy(false);

      const key = "truevoice_episodes";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      const next = [
        ...prev,
        {
          ...payload,
          savedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(key, JSON.stringify(next));

      goTo("final");
    }, 4000);
  }


  const heroId = episodeState?.heroId;
  const scenarioId = episodeState?.scenarioId;
  const symptomId = episodeState?.symptomId;

  function getScenarioItems() {
    const obj = HERO_SCENARIO_?.[heroId];
    if (!obj) return [];
    return Object.keys(obj).map((k) => ({ id: k, imageUrl: obj[k].imageUrl }));
  }

  function getSymptomItems() {
    const obj = HERO_SCENARIO_SYMPTOMS?.[heroId]?.[scenarioId];
    if (!obj) return [];
    return Object.keys(obj).map((k) => ({ id: k, imageUrl: obj[k].imageUrl }));
  }
  function normalizeSymptomKey(id) {
    if (!id) return id;

    return id.replace("_pain", "");
  }

  function getSeverityItems() {
    const sId = pendingSymptomId || symptomId;

    if (!heroId || !scenarioId || !sId) return [];

    const node =
      HERO_SCENARIO_SYMPTOM_WITH_SRVERITY?.[heroId]?.[scenarioId]?.[sId];

    const img = node?.severe?.imageUrl || node?.imageUrl;
    if (!img) return [];

    return [{ id: "severe", imageUrl: img }];
  }




  let stepComponent = null;

  if (showSympathy) {
    stepComponent = (
      <div className="step-container hero-step">
        <div className="hero-card">
          <img src={avaSympathyImg} alt="sympathy" className="hero-main-image" />
        </div>
      </div>
    );
  } else if (currentStep === "hero") {
    stepComponent = (
      <HeroStep
        episodeState={episodeState}
        onSelectHero={(pickedHeroId) => {
          updateEpisode({
            heroId: pickedHeroId,
            scenarioId: null,
            symptomId: null,
            severityId: null,
          });
          goTo("scenario");
        }}
      />
    );
  } else if (currentStep === "scenario") {
    const items = getScenarioItems();

    stepComponent = (
      <CarouselStep
        items={items}
        onPick={(picked) => {
          updateEpisode({ scenarioId: picked.id, symptomId: null, severityId: null });
          goTo("symptoms");
        }}
        onBack={() => goTo("hero")}
      />
    );
  } else if (currentStep === "symptoms") {
    const items = getSymptomItems();

    stepComponent = (
      <CarouselStep
        items={items}
        onPick={(picked) => {

          if (picked.id === "emergency") {
            const payload = {
              heroId,
              scenarioId,
              symptomId: "emergency",
              severityId: null,
              pathImage: "ava_outside_emergency",
            };
            updateEpisode({ symptomId: "emergency", severityId: null });
            showSympathyThenSaveAndFinish(payload);
            return;
          }

          setPendingSymptomId(picked.id);
          updateEpisode({ symptomId: picked.id, severityId: null });
          goTo("severity");

        }}
        onBack={() => goTo("scenario")}
      />
    );
  } else if (currentStep === "severity") {
    const items = getSeverityItems();

    stepComponent = (
      <CarouselStep
        items={items}
        onPick={() => {

          const payload = {
            heroId,
            scenarioId,
            symptomId,
            severityId: "severe",
            pathImage: `${heroId}_${scenarioId}_${symptomId}_severe`,
          };
          updateEpisode({ severityId: "severe" });
          showSympathyThenSaveAndFinish(payload);
        }}
        onBack={() => goTo("symptoms")}
      />
    );
  } 
 else if (currentStep === "final") {
  const saved = JSON.parse(localStorage.getItem(EPISODE_KEY) || "[]");
  const episodes10 = saved.slice(-10).reverse();

  // basic analytics (counts)
  const symptomCount = saved.reduce((acc, e) => {
    acc[e.symptomId] = (acc[e.symptomId] || 0) + 1;
    return acc;
  }, {});
  const scenarioCount = saved.reduce((acc, e) => {
    acc[e.scenarioId] = (acc[e.scenarioId] || 0) + 1;
    return acc;
  }, {});
  const emergencyCount = saved.filter(
    (e) => e.symptomId === "emergency"
  ).length;

  stepComponent = (
  <div className="final-page">
    <div className="final-panel">
      {/* HEADER */}
      <div className="final-head">
        {finalView === "analytics" ? (
          // ✅ Analytics header row: title left, back button right
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div>
              <div className="final-title">All done 💌</div>
              <div className="final-subtitle">Analytics</div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setFinalView("episodes")}
            >
              ← Back to Episodes
            </button>
          </div>
        ) : (
          // ✅ Episodes header (no button here)
          <div>
            <div className="final-title">All done 💌</div>
            <div className="final-subtitle">Last 10 episodes</div>
          </div>
        )}
      </div>

      {/* BODY */}
      {finalView === "episodes" ? (
        <>
          <div className="episode-grid">
            {episodes10.map((ep, idx) => (
              <div className="episode-card" key={ep.id || idx}>
                <div>
                  <b>Hero:</b> {ep.heroId}
                </div>
                <div>
                  <b>Where:</b> {ep.scenarioId}
                </div>
                <div>
                  <b>Symptom:</b> {ep.symptomId}
                </div>
                <div>
                  <b>Severity:</b> {ep.severityId || "-"}
                </div>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="final-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setAuthed(false);
                setCurrentStep("login");
              }}
            >
              Logout
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setFinalView("analytics")}
            >
              Show Analytics
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                setEpisodeState(INITIAL_EPISODE_STATE);
                setCurrentStep("hero");
              }}
            >
              Start new episode
            </button>
          </div>
        </>
      ) : (
        <div className="analytics-wrap">
          {/* ✅ ONE KPI BOX */}
          <div className="analytics-kpiBox">
            <div className="kpiBlock">
              <div className="kpiNum">{saved.length}</div>
              <div className="kpiText">Total episodes</div>
            </div>

            <div className="kpiDivider" />

            <div className="kpiBlock">
              <div className="kpiNum">{emergencyCount}</div>
              <div className="kpiText">Emergency</div>
            </div>
          </div>

          {/* ✅ PIE CHART (Symptoms) */}
          {(() => {
            const total =
              Object.values(symptomCount).reduce((a, b) => a + b, 0) || 1;

            const entries = Object.entries(symptomCount)
              .filter(([k]) => k)
              .sort((a, b) => b[1] - a[1]);

            let acc = 0;
            const stops = entries.map(([label, value]) => {
              const start = acc;
              acc += (value / total) * 360;
              return { label, value, start, end: acc };
            });

            const palette = [
              "#6a5acd",
              "#20b2aa",
              "#ffa500",
              "#ff6b6b",
              "#4caf50",
              "#00bcd4",
              "#9c27b0",
              "#795548",
              "#607d8b",
            ];

            const pieStyle = {
              background: `conic-gradient(${stops
                .map(
                  (s, i) =>
                    `${palette[i % palette.length]} ${s.start}deg ${s.end}deg`
                )
                .join(", ")})`,
            };

            return (
              <div className="analytics-pieSection">
                <div className="analytics-pieTitle">Symptoms distribution</div>

                {/* legend ABOVE pie */}
                <div className="legendChips">
                  {stops.slice(0, 10).map((s, i) => (
                    <div className="chip" key={s.label}>
                      <span
                        className="chipDot"
                        style={{ background: palette[i % palette.length] }}
                      />
                      <span className="chipText">
                        {s.label}: <b>{s.value}</b>
                      </span>
                    </div>
                  ))}
                </div>

                {/* pie BELOW */}
                <div className="pieCenter">
                  <div className="analytics-pie" style={pieStyle} />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  </div>
);

}



  const showNavbar = authed && currentStep !== "landing" && currentStep !== "login";

  return (
    <div className="app-root">

      {showNavbar ? (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <div
            style={{
              position: "relative",
              height: 64,
              background: "#dc941fff",
              color: "white",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              fontWeight: 700,
              fontSize: 18,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div>True Voice</div>
            </div>

            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                fontWeight: 600,
                opacity: 0.95,
                whiteSpace: "nowrap",
              }}
            >
              {headerText}
            </div>

            <div style={{ marginLeft: "auto" }}>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setAuthed(false);
                  goTo("login");
                }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.45)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ paddingTop: showNavbar ? 72 : 0 }}>
        <div className={`app-shell ${currentStep === "final" ? "app-shell--flat" : ""
          }`}>{stepComponent}</div>
      </div>
    </div>
  );
}

export default App;

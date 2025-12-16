import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { INITIAL_EPISODE_STATE } from "./episodeState.js";

import Landing from "./steps/Landing.jsx";
import LoginPage from "./steps/Login.jsx";
import HeroStep from "./steps/HeroStep.jsx";

import "./App.css";

// ✅ use your image maps
import {
  HERO_SCENARIO_,
  HERO_SCENARIO_SYMPTOMS,
  HERO_SCENARIO_SYMPTOM_WITH_SRVERITY,
} from "./data/heroes"; // adjust path if different


import avaSympathyImg from "./data/ava_symphathy.png"; // adjust path

const STEP_ORDER = ["landing", "login", "hero", "scenario", "symptoms", "severity", "final"];

function CarouselStep({ items, onPick, onBack }) {
  const [idx, setIdx] = useState(0);
  const current = items[idx] || null;

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
      <button
        type="button"
        className="hero-nav hero-nav-left"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          prev();
        }}
      >
        ◀
      </button>

      <button
        type="button"
        className="hero-nav hero-nav-right"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          next();
        }}
      >
        ▶
      </button>

      <div className="hero-card">
        <img
          src={current?.imageUrl}
          alt={current?.id || "option"}
          className="hero-main-image"
          onClick={() => current && onPick(current)}
        />
      </div>

      {/* optional back (no CSS change, keep simple) */}
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

  // minimal state we need for demo
  const [episodeState, setEpisodeState] = useState(INITIAL_EPISODE_STATE);

  // for showing sympathy for a few seconds
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
    // when symptom is selected, move to severity automatically
    if (currentStep === "symptoms" && episodeState?.symptomId && episodeState.symptomId !== "emergency") {
      goTo("severity");
    }
  }, [currentStep, episodeState?.symptomId]);


  function updateEpisode(patch) {
    setEpisodeState((prev) => ({ ...prev, ...patch }));
  }

  function goTo(step) {
    setCurrentStep(step);
  }

  // ✅ Step message in navbar
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

  // ✅ FULL SCREEN LANDING (no navbar)
  if (currentStep === "landing") {
    return <Landing ms={4000} onDone={() => goTo("login")} />;
  }

  // ✅ FULL SCREEN LOGIN (no navbar)
  if (currentStep === "login") {
    return (
      <LoginPage
        onSuccess={() => {
          setAuthed(true);
          goTo("hero");
        }}
      />
    );
  }

  async function showSympathyThenSaveAndFinish(payload) {
    setShowSympathy(true);

    // show sympathy image for ~2 sec
    setTimeout(() => {
      setShowSympathy(false);

      // ✅ save episode to localStorage (append)
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

  // ---- BUILD OPTIONS FROM YOUR MAPS ----
  const heroId = episodeState?.heroId;
  const scenarioId = episodeState?.scenarioId; // outside/home/school
  const symptomId = episodeState?.symptomId; // head/chest/stomach/leg/throat/emergency

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
    // convert stomach_pain -> stomach
    return id.replace("_pain", "");
  }

  function getSeverityItems() {
    const sId = pendingSymptomId || symptomId;   // ✅ THIS LINE

    if (!heroId || !scenarioId || !sId) return [];

    const node =
      HERO_SCENARIO_SYMPTOM_WITH_SRVERITY?.[heroId]?.[scenarioId]?.[sId];

    const img = node?.severe?.imageUrl || node?.imageUrl;
    if (!img) return [];

    return [{ id: "severe", imageUrl: img }];
  }




  // ---- STEP RENDER ----
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
          // ✅ emergency: skip severity + save
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

          // normal symptom: go severity
          setPendingSymptomId(picked.id);          // ✅ immediate value
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
  } else if (currentStep === "final") {
    const saved = JSON.parse(localStorage.getItem("episodes") || "[]");

    stepComponent = (
      <div
        style={{
          width: "100%",
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "min(500px, 90vw)",
            background: "rgba(173, 216, 230, 0.85)", // light blue
            borderRadius: 22,
            padding: 22,
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            All done 💌
          </div>

          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 14 }}>
            Saved episodes (latest on top):
          </div>

          <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
            {saved.slice(0, 5).map((ep, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255,255,255,0.75)",
                  borderRadius: 18,
                  padding: 14,
                }}
              >
                <div><b>Hero:</b> {ep.heroId}</div>
                <div><b>Where:</b> {ep.scenarioId}</div>
                <div><b>Symptom:</b> {ep.symptomId}</div>
                <div><b>Severity:</b> {ep.severityId}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                  {ep.ts}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
              className="btn btn-primary"
              onClick={() => {
                setEpisodeState(INITIAL_EPISODE_STATE);
                setCurrentStep("hero");
              }}
            >
              Start new episode
            </button>
          </div>
        </div>
      </div>
    );
  }


  const showNavbar = authed && currentStep !== "landing" && currentStep !== "login";

  return (
    <div className="app-root">
      {/* ✅ NAVBAR hidden on Login */}
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

      {/* push content below navbar */}
      <div style={{ paddingTop: showNavbar ? 72 : 0 }}>
        <div className={`app-shell ${currentStep === "final" ? "app-shell--flat" : ""
          }`}>{stepComponent}</div>
      </div>
    </div>
  );
}

export default App;


import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { INITIAL_EPISODE_STATE } from "./episodeState.js";
import { seedFakeEpisodes, EPISODE_KEY } from "./data/fakeEpisode.js";

import Landing from "./steps/Landing.jsx";
import LoginPage from "./steps/Login.jsx";
import HeroStep from "./steps/HeroStep.jsx";
import "./App.css";

import avaSympathyImg from "./data/ava_symphathy.png";

import { STEP_ORDER } from "./app/constants.js";
import CarouselStep from "./app/components/CarouselStep.jsx";
import { getScenarioItems, getSymptomItems, getSeverityItems } from "./app/episode/episodeSelectors.js";
import AppNavbar from "./app/layout/AppNavbar.jsx";
import FinalStep from "./app/steps/FinalStep.jsx";

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
        const resp = await api.ping();
        if (resp?.ok) setBackendOk(true);
      } catch (e) {
        console.error("Ping failed", e);
      } finally {
        setLoadingHealth(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (
      currentStep === "symptoms" &&
      episodeState?.symptomId &&
      episodeState.symptomId !== "emergency"
    ) {
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
    const items = getScenarioItems(heroId);

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
    const items = getSymptomItems(heroId, scenarioId);

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
    const items = getSeverityItems({ heroId, scenarioId, symptomId, pendingSymptomId });

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
    stepComponent = (
      <FinalStep
        EPISODE_KEY={EPISODE_KEY}
        INITIAL_EPISODE_STATE={INITIAL_EPISODE_STATE}
        setEpisodeState={setEpisodeState}
        setCurrentStep={setCurrentStep}
        setAuthed={setAuthed}
        finalView={finalView}
        setFinalView={setFinalView}
      />
    );
  }

  const showNavbar = authed && currentStep !== "landing" && currentStep !== "login";

  return (
    <div className="app-root">
      {showNavbar ? (
        <AppNavbar
          headerText={headerText}
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuthed(false);
            goTo("login");
          }}
        />
      ) : null}

      <div style={{ paddingTop: showNavbar ? 72 : 0 }}>
        <div
          className={`app-shell
    ${currentStep === "final" ? "app-shell--flat" : ""}
    ${currentStep === "final" && finalView === "analytics" ? "app-shell--scroll" : ""}
  `}
        >
          {stepComponent}
        </div>
      </div>
    </div>
  );
}

export default App;

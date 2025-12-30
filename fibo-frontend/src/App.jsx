import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { INITIAL_EPISODE_STATE } from "./episodeState.js";
import { seedFakeEpisodes, EPISODE_KEY } from "./data/fakeEpisode.js";
import { SOS_IMAGE } from "./data/heroes.js";

import Landing from "./steps/Landing.jsx";
import LoginPage from "./steps/Login.jsx";
import HeroStep from "./steps/HeroStep.jsx";
import "./App.css";




import ProfileStep from "./steps/ProfileStep.jsx";

import CarouselStep from "./app/components/CarouselStep.jsx";
import {
  getScenarioItems,
  getSymptomItems,
  getSeverityItems,
} from "./app/episode/episodeSelectors.js";
import AppNavbar from "./app/layout/AppNavbar.jsx";
import FinalStep from "./app/steps/FinalStep.jsx";

const PROFILE_KEY = "truevoice_profile";
const SUPPORT_STORE_KEY = "truevoice_support_images_v1";

function safeReadSupportStore() {
  try {
    return JSON.parse(localStorage.getItem(SUPPORT_STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

const avaSympathyImg = "/ava_symphathy.png";

function App() {
  const [backendOk, setBackendOk] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [headerOverride, setHeaderOverride] = useState(null);

  const [currentStep, setCurrentStep] = useState("landing");
  const [authed, setAuthed] = useState(false);

  const [finalView, setFinalView] = useState("episodes"); 

  const [episodeState, setEpisodeState] = useState(INITIAL_EPISODE_STATE);

  const [showSympathy, setShowSympathy] = useState(false);
  const [pendingSymptomId, setPendingSymptomId] = useState(null);

  const [profile, setProfile] = useState(() => {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
  });

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
      case "profile":
        return "Child and Guardian Details";
      case "hero":
        return "You can share your feeling with your HERO";
      case "scenario":
        return "Where are you right now?";
      case "symptoms":
        return (
          <>
            What kind of problem are you facing?
            <br />
            Head | Chest | Stomach | Emergency
          </>
        );
      case "severity":
        return "Is it severe or not severe?";
      case "final":
        return "All done 💌";
      default:
        return "";
    }
  }, [currentStep]);

  // ✅ derive sympathy overlay image + header from the same store key
  const sympathyMeta = useMemo(() => {
    if (!showSympathy) return { overlayImage: null, headerText: null };

    // Emergency flow
    if (episodeState?.symptomId === "emergency") {
      return {
        overlayImage: SOS_IMAGE,
        headerText: "Emergency — Call for help",
      };
    }

    // Normal flow
    let overlayImage = avaSympathyImg;
    let headerText = "We are there for help 👪";

    const store = safeReadSupportStore();
    const supportKey = `${episodeState?.heroId}__${episodeState?.scenarioId}__${episodeState?.symptomId}__${episodeState?.severityId}`;
    const entry = store?.[supportKey];

    if (entry?.enabled === true && entry?.imageUrl) {
      overlayImage = entry.imageUrl;
    }

    const h = (entry?.headerText || "").trim();
    if (h) headerText = h;

    return { overlayImage, headerText };
  }, [
    showSympathy,
    episodeState?.heroId,
    episodeState?.scenarioId,
    episodeState?.symptomId,
    episodeState?.severityId,
  ]);

  // ✅ apply header override only while sympathy is showing (avoid setState during render)
  useEffect(() => {
    if (showSympathy) {
      setHeaderOverride(sympathyMeta.headerText || null);
    }
  }, [showSympathy, sympathyMeta.headerText]);

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
            console.log(
              "ℹ️ Episodes already exist, not seeding again.",
              existing.length
            );
          }

          goTo("profile");
        }}
      />
    );
  }

  if (currentStep === "profile") {
    return (
      <ProfileStep
        initialProfile={profile}
        onBack={() => goTo("login")}
        onContinue={(data) => {
          setProfile(data);
          localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
          goTo("hero");
        }}
      />
    );
  }

  async function showSympathyThenSaveAndFinish(payload) {
    setShowSympathy(true);

    setTimeout(() => {
      setShowSympathy(false);
      setHeaderOverride(null); // ✅ clear after sympathy ends

      const key = "truevoice_episodes";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      const next = [
        ...prev,
        {
          ...payload,
          savedAt: new Date().toISOString(),

          // ✅ attendance defaults
          attended: false,
          attendedBy: null,
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
          <img
            src={sympathyMeta.overlayImage || avaSympathyImg}
            alt="overlay"
            className="hero-main-image"
          />
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
          // ✅ Emergency flow
          if (picked.id === "breathing_or_choking") {
            const payload = {
              heroId,
              scenarioId,
              symptomId: "emergency",
              severityId: null,
              pathImage: "sos_image",
            };

            // mark emergency in episode state
            updateEpisode({ symptomId: "emergency", severityId: null });

            // ✅ show SOS overlay for 4s (NO API call for hackathon)
            setShowSympathy(true);

            setTimeout(() => {
              setShowSympathy(false);
              setHeaderOverride(null); // ✅ clear after sympathy ends

              // ✅ save episode
              const key = "truevoice_episodes";
              const prev = JSON.parse(localStorage.getItem(key) || "[]");
              const next = [
                ...prev,
                {
                  ...payload,
                  savedAt: new Date().toISOString(),

                  // ✅ attendance defaults
                  attended: false,
                  attendedBy: null,
                },
              ];

              localStorage.setItem(key, JSON.stringify(next));

              // ✅ go final
              goTo("final");
            }, 4000);

            return;
          }

          // ✅ Normal symptom → go severity
          setPendingSymptomId(picked.id);
          updateEpisode({ symptomId: picked.id, severityId: null });
          goTo("severity");
        }}
        onBack={() => goTo("scenario")}
      />
    );
  } else if (currentStep === "severity") {
    const items = getSeverityItems({
      heroId,
      scenarioId,
      symptomId,
      pendingSymptomId,
    });
    const img = items?.[0]?.imageUrl; // we show ONLY ONE image (severe preview)

    const sId = pendingSymptomId || symptomId;

    function finishWithSeverity(sev) {
      const payload = {
        heroId,
        scenarioId,
        symptomId: sId,
        severityId: sev, // "mild" | "severe"
        pathImage: `${heroId}_${scenarioId}_${sId}_${sev}`,
      };

      updateEpisode({ severityId: sev });
      showSympathyThenSaveAndFinish(payload);
    }

    stepComponent = (
      <div className="step-container hero-step">
        <div className="hero-card">
          {img ? (
            <img
              src={img}
              alt="severity"
              className="hero-main-image"
              draggable={false}
            />
          ) : (
            <div style={{ color: "white", padding: 20, fontWeight: 700 }}>
              No severity image available
            </div>
          )}
        </div>

        {/* ✅ Two buttons */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => finishWithSeverity("mild")}
          >
            Not Severe
          </button>

          <button
            className="btn btn-primary"
            onClick={() => finishWithSeverity("severe")}
          >
            Severe
          </button>
        </div>

        {/* back */}
        <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 9999 }}>
          <button className="btn btn-secondary" onClick={() => goTo("symptoms")}>
            Back
          </button>
        </div>
      </div>
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
        setHeaderOverride={setHeaderOverride}
      />
    );
  }

  const showNavbar =
    authed && currentStep !== "landing" && currentStep !== "login";

  console.log("headerOverride =", headerOverride, "| currentStep =", currentStep);

  return (
    <div className="app-root">
      {showNavbar ? (
        <AppNavbar
          headerText={headerOverride || headerText}
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
    ${
      currentStep === "final" && finalView === "analytics"
        ? "app-shell--scroll"
        : ""
    }
  `}
        >
          {stepComponent}
        </div>
      </div>
    </div>
  );
}

export default App;

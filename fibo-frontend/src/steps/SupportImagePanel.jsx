// src/app/steps/SupportImagePanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./SupportImagePanel.css";
import { SUPPORT_IMAGE_MAP,SUPPORT_HEADER_MAP } from "../data/supportImageMap";

const SUPPORT_STORE_KEY = "truevoice_support_images_v1";

function readSupportStore() {
  try {
    const raw = localStorage.getItem(SUPPORT_STORE_KEY);
    const parsed = JSON.parse(raw || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeSupportStore(next) {
  localStorage.setItem(SUPPORT_STORE_KEY, JSON.stringify(next || {}));
}

/** ================================
 *  FIBO-LIKE PRESETS (DEMO KNOBS)
 *  ================================
 * Keep options SMALL + HUMAN.
 * Later backend can map these to structured_prompt fields.
 */

const MOODS = [
  { id: "reassuring", label: "Reassuring (default)" },
  { id: "encouraging", label: "Encouraging" },
  { id: "protective", label: "Protective" },
];

const SCENES = [
  { id: "home", label: "Home (safe corner)" },
  { id: "school", label: "School (quiet nurse room)" },
  { id: "outside", label: "Outside (calm park bench)" },
];

const LIGHTING_PRESETS = [
  {
    id: "mild_daylight",
    label: "Mild daylight",
    lighting: {
      conditions: "soft mild daylight, low contrast",
      direction: "from a side window",
      shadows: "very soft shadows",
    },
  },
  {
    id: "warm_lamp",
    label: "Warm lamp",
    lighting: {
      conditions: "warm indoor lamp light, gentle glow",
      direction: "from above-left",
      shadows: "soft warm shadows",
    },
  },
  {
    id: "cloudy_soft",
    label: "Cloudy soft",
    lighting: {
      conditions: "diffused cloudy daylight, very gentle",
      direction: "ambient",
      shadows: "minimal shadows",
    },
  },
];

const COLOR_PALETTES = [
  {
    id: "pastel_blue",
    label: "Pastel Blue (calm)",
    color_scheme: "soft pastel blues, muted beige accents, low saturation",
  },
  {
    id: "warm_beige",
    label: "Warm Beige (soothing)",
    color_scheme: "warm beige and soft peach tones, low saturation",
  },
  {
    id: "mint_soft",
    label: "Mint Soft (clean calm)",
    color_scheme: "soft mint and pale gray palette, calm clinical feel",
  },
];

const CAMERA_FOCUS = [
  {
    id: "soft_focus",
    label: "Soft focus",
    photographic: {
      depth_of_field: "medium depth of field",
      focus: "soft focus on subject, gentle clarity",
    },
  },
  {
    id: "sharp_focus",
    label: "Sharp focus",
    photographic: {
      depth_of_field: "shallow depth of field",
      focus: "sharp focus on subject, background blurred",
    },
  },
  {
    id: "portrait_focus",
    label: "Portrait focus",
    photographic: {
      depth_of_field: "shallow depth of field",
      focus: "face and hands sharp, background very soft",
    },
  },
];

const CAMERA_ANGLES = [
  { id: "eye_level", label: "Eye-level", camera_angle: "eye-level, centered framing" },
  { id: "slightly_high", label: "Slightly high", camera_angle: "slightly high angle, comforting perspective" },
  { id: "close_up", label: "Close-up", camera_angle: "close-up portrait framing, gentle crop" },
];

function getSceneDescription(sceneId) {
  if (sceneId === "home") {
    return "A cozy home safe corner with a soft blanket, plush cushion, and minimal background details.";
  }
  if (sceneId === "school") {
    return "A quiet school nurse room corner with soft chair, warm colors, minimal medical hints (child-safe).";
  }
  return "A calm outdoor park bench with soft sky and minimal trees, quiet and safe.";
}

function getSymptomFriendlyLine(symptomId, severityId) {
  // Keep it non-scary and child-safe.
  if (!symptomId) return "A gentle supportive moment for a child feeling unwell.";
  const base =
    symptomId === "stomach"
      ? "A comforting support scene for tummy discomfort."
      : symptomId === "head"
      ? "A gentle support scene for a headache."
      : symptomId === "chest"
      ? "A calm support scene for discomfort in the chest area."
      : "A calm, child-safe supportive scene.";

  if (severityId && severityId !== "na") {
    return `${base} The mood stays safe and reassuring even for a severe moment.`;
  }
  return base;
}

export default function SupportImagePanel({
  title = "Generate Support / Sympathy Image",
  initialMessage = "",
  scenarioMeta = null, // { heroId, scenarioId, symptomId, severityId, scenarioLabel }
  attendedBy = null, // { type, name, relationship, attendedAt }

  // ✅ NEW: lets parent (AppNavbar) show this text live
  onHeaderChange,

  onBack,
  onSkip,
  onDone,
  onGenerate, // optional backend later
}) {
  // text inputs
  const [message, setMessage] = useState(initialMessage);
  const [shortDesc, setShortDesc] = useState(
    "A calm, child-safe supportive scene that feels safe and comforting."
  );

  // FIBO-like controls
  const [mood, setMood] = useState("reassuring");
  const [scene, setScene] = useState("home");
  const [lightingPresetId, setLightingPresetId] = useState("mild_daylight");
  const [paletteId, setPaletteId] = useState("pastel_blue");
  const [cameraFocusId, setCameraFocusId] = useState("portrait_focus");
  const [cameraAngleId, setCameraAngleId] = useState("eye_level");
  const [guidanceScale, setGuidanceScale] = useState(5); // 1..10 (demo UI)

  const TABS = [
    { id: "prompt", label: "Prompt" },
    { id: "scene", label: "Scene" },
    { id: "lighting", label: "Lighting" },
    { id: "camera", label: "Camera" },
    { id: "preview", label: "JSON" },
  ];
  const [tab, setTab] = useState("prompt");

  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // ✅ key for demo image lookup + localStorage store
  const pathKey = useMemo(() => {
    const h = scenarioMeta?.heroId || "na";
    const sc = scenarioMeta?.scenarioId || "na";
    const sy = scenarioMeta?.symptomId || "na";
    const se = scenarioMeta?.severityId || "na";
    return `${h}__${sc}__${sy}__${se}`;
  }, [
    scenarioMeta?.heroId,
    scenarioMeta?.scenarioId,
    scenarioMeta?.symptomId,
    scenarioMeta?.severityId,
  ]);

  // ✅ set initial header text when panel opens
 useEffect(() => {
  const fallback = "Support / Sympathy Image";
  const initial = (initialMessage || "").trim();

  // set header ONCE when panel opens
  onHeaderChange?.(initial || fallback);

  // ❌ DO NOT clear header here
}, []);

  // ✅ default scene from scenarioMeta when it changes
  useEffect(() => {
    const sc = scenarioMeta?.scenarioId;
    if (sc === "home" || sc === "school" || sc === "outside") {
      setScene(sc);
    }
  }, [scenarioMeta?.scenarioId]);

  const lightingPreset = useMemo(
    () => LIGHTING_PRESETS.find((x) => x.id === lightingPresetId) || LIGHTING_PRESETS[0],
    [lightingPresetId]
  );

  const palettePreset = useMemo(
    () => COLOR_PALETTES.find((x) => x.id === paletteId) || COLOR_PALETTES[0],
    [paletteId]
  );

  const cameraFocusPreset = useMemo(
    () => CAMERA_FOCUS.find((x) => x.id === cameraFocusId) || CAMERA_FOCUS[0],
    [cameraFocusId]
  );

  const cameraAnglePreset = useMemo(
    () => CAMERA_ANGLES.find((x) => x.id === cameraAngleId) || CAMERA_ANGLES[0],
    [cameraAngleId]
  );

  const promptMeta = useMemo(() => {
    return {
      mood,
      scene,
      lightingPresetId,
      paletteId,
      cameraFocusId,
      cameraAngleId,
      guidanceScale,
      message: message?.trim() || "",
      shortDesc: shortDesc?.trim() || "",
      scenario: scenarioMeta?.scenarioLabel || scenarioMeta?.scenarioId || "",
      keyParts: scenarioMeta
        ? {
            heroId: scenarioMeta.heroId,
            scenarioId: scenarioMeta.scenarioId,
            symptomId: scenarioMeta.symptomId,
            severityId: scenarioMeta.severityId,
          }
        : null,
      attendedBy: attendedBy
        ? { type: attendedBy.type, relationship: attendedBy.relationship }
        : null,
    };
  }, [
    mood,
    scene,
    lightingPresetId,
    paletteId,
    cameraFocusId,
    cameraAngleId,
    guidanceScale,
    message,
    shortDesc,
    scenarioMeta,
    attendedBy,
  ]);

  // ✅ This is the "FIBO structured prompt" you can show in JSON tab
  const payload = useMemo(() => {
    return {
      seed: 5555, // demo; later you can hash pathKey
      steps_num: 35,
      aspect_ratio: "3:4",
      guidance_scale: guidanceScale,
      sync_mode: false,

      structured_prompt: {
        short_description: shortDesc,
        objects: [
          {
            description: "a calm child-safe supportive symbol (soft heart icon)",
            location: "subtle, not distracting",
            relative_size: "small",
            texture: "soft",
            appearance_details: "gentle, minimal, non-scary",
          },
        ],
        background_setting: getSceneDescription(scene),
        lighting: lightingPreset.lighting,
        aesthetics: {
          composition: "centered subject, clean framing, lots of breathing space",
          color_scheme: palettePreset.color_scheme,
          mood_atmosphere: `${mood}, safe, comforting, child-friendly`,
        },
        photographic_characteristics: {
          ...cameraFocusPreset.photographic,
          camera_angle: cameraAnglePreset.camera_angle,
          lens_focal_length: "50mm equivalent",
        },
        style_medium: "soft digital illustration",
        artistic_style: "storybook, non-vibrant, child-friendly, gentle outlines",
        text_render: message
          ? [{ text: message, position: "top_center", style: "soft" }]
          : [],
        context: getSymptomFriendlyLine(scenarioMeta?.symptomId, scenarioMeta?.severityId),
      },

      _demo_pathKey: pathKey,
    };
  }, [
    guidanceScale,
    shortDesc,
    scene,
    lightingPreset,
    palettePreset,
    cameraFocusPreset,
    cameraAnglePreset,
    message,
    scenarioMeta?.symptomId,
    scenarioMeta?.severityId,
    pathKey,
  ]);

  async function handleGenerate() {
    setErr("");
    setBusy(true);
    try {
     
      if (onGenerate) {
        const res = await onGenerate(payload);
        const url = res?.imageUrl || res?.url || "";
        if (!url) throw new Error("No imageUrl returned from onGenerate().");
        setGeneratedImageUrl(url);
        return;
      }

     
      const urlFromMap = SUPPORT_IMAGE_MAP?.[pathKey];

      if (!urlFromMap) {
        setGeneratedImageUrl("");
        throw new Error(`No demo image found for key: ${pathKey}. Add it to SUPPORT_IMAGE_MAP.`);
      }

      await new Promise((r) => setTimeout(r, 450));
      setGeneratedImageUrl(urlFromMap);
    } catch (e) {
      setErr(e?.message || "Failed to generate image.");
    } finally {
      setBusy(false);
    }
  }

 function handleUseImage() {
  setErr("");
  if (!generatedImageUrl) {
    setErr("Generate an image first (demo uses SUPPORT_IMAGE_MAP).");
    return;
  }

  
  const headerTextToSave = (message || "").trim() || "Support / Sympathy Image";

  const store = readSupportStore();
  store[pathKey] = {
    enabled: true,
    imageUrl: generatedImageUrl,
    headerText: headerTextToSave, 
    savedAt: new Date().toISOString(),
    savedBy: attendedBy
      ? {
          name: attendedBy.name,
          relationship: attendedBy.relationship,
          type: attendedBy.type,
        }
      : null,
    promptMeta,
    payload, 
  };
  writeSupportStore(store);


  onDone?.({
    pathKey,
    imageUrl: generatedImageUrl,
    headerText: headerTextToSave,
    promptMeta,
    payload,
  });
}


  return (
    <div className="sip-root">
      <div className="sip-card">
        <div className="sip-head">
          <div>
            <div className="sip-title">{title}</div>
            <div className="sip-sub">Step 2 of 2 — Generate a supportive image, or skip.</div>

            {scenarioMeta?.scenarioLabel ? (
              <div className="sip-sub" style={{ marginTop: 4 }}>
                Scenario: <b>{scenarioMeta.scenarioLabel}</b>
              </div>
            ) : null}

            {scenarioMeta ? (
              <div className="sip-sub" style={{ marginTop: 4 }}>
                Key: <b>{pathKey}</b>
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {onBack ? (
              <button
                className="sip-btn sip-btn-ghost"
                onClick={() => {
                  onHeaderChange?.(null);
                  onBack();
                }}
                type="button"
              >
                ← Back
              </button>
            ) : null}
            {onSkip ? (
              <button
                className="sip-btn sip-btn-ghost"
                onClick={() => {
                  onHeaderChange?.(null);
                  onSkip();
                }}
                type="button"
              >
                Skip
              </button>
            ) : null}
          </div>
        </div>

        <div className="sip-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`sip-tab ${tab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sip-body">
          {tab === "prompt" ? (
            <>
              <label className="sip-field">
                <div className="sip-label">Parent message (shown on header)</div>
                <input
                  className="sip-input"
                  value={message}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMessage(val);

                  
                    onHeaderChange?.((val || "").trim() || "Support / Sympathy Image");
                  }}
                  placeholder="e.g., I’m here with you. You’re safe."
                />
              </label>

              <label className="sip-field">
                <div className="sip-label">Short description</div>
                <textarea
                  className="sip-textarea"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={4}
                />
              </label>

              <label className="sip-field">
                <div className="sip-label">Mood</div>
                <select className="sip-input" value={mood} onChange={(e) => setMood(e.target.value)}>
                  {MOODS.map((p) => (
                    <option value={p.id} key={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sip-field">
                <div className="sip-label">Guidance scale (1–10)</div>
                <input
                  className="sip-input"
                  type="number"
                  min="1"
                  max="10"
                  value={guidanceScale}
                  onChange={(e) => setGuidanceScale(Math.max(1, Math.min(10, Number(e.target.value) || 5)))}
                />
              </label>
            </>
          ) : null}

          {tab === "scene" ? (
            <>
              <div className="sip-row">
                <label className="sip-field">
                  <div className="sip-label">Scene</div>
                  <select className="sip-input" value={scene} onChange={(e) => setScene(e.target.value)}>
                    {SCENES.map((b) => (
                      <option value={b.id} key={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sip-field">
                  <div className="sip-label">Color palette</div>
                  <select className="sip-input" value={paletteId} onChange={(e) => setPaletteId(e.target.value)}>
                    {COLOR_PALETTES.map((p) => (
                      <option value={p.id} key={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="sip-sub" style={{ marginTop: 6, opacity: 0.8 }}>
                Scene preview idea: {getSceneDescription(scene)}
              </div>
            </>
          ) : null}

          {tab === "lighting" ? (
            <>
              <label className="sip-field">
                <div className="sip-label">Lighting preset</div>
                <select
                  className="sip-input"
                  value={lightingPresetId}
                  onChange={(e) => setLightingPresetId(e.target.value)}
                >
                  {LIGHTING_PRESETS.map((p) => (
                    <option value={p.id} key={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>

              <pre className="sip-json" style={{ marginTop: 10 }}>
                {JSON.stringify(lightingPreset.lighting, null, 2)}
              </pre>
            </>
          ) : null}

          {tab === "camera" ? (
            <>
              <div className="sip-row">
                <label className="sip-field">
                  <div className="sip-label">Focus</div>
                  <select
                    className="sip-input"
                    value={cameraFocusId}
                    onChange={(e) => setCameraFocusId(e.target.value)}
                  >
                    {CAMERA_FOCUS.map((p) => (
                      <option value={p.id} key={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sip-field">
                  <div className="sip-label">Camera angle</div>
                  <select
                    className="sip-input"
                    value={cameraAngleId}
                    onChange={(e) => setCameraAngleId(e.target.value)}
                  >
                    {CAMERA_ANGLES.map((p) => (
                      <option value={p.id} key={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <pre className="sip-json" style={{ marginTop: 10 }}>
                {JSON.stringify(
                  {
                    ...cameraFocusPreset.photographic,
                    camera_angle: cameraAnglePreset.camera_angle,
                    lens_focal_length: "50mm equivalent",
                  },
                  null,
                  2
                )}
              </pre>
            </>
          ) : null}

          {tab === "preview" ? (
            <pre className="sip-json">{JSON.stringify({ payload, promptMeta }, null, 2)}</pre>
          ) : null}

          {err ? (
            <div style={{ marginTop: 10 }} className="sip-error">
              {err}
            </div>
          ) : null}

          {generatedImageUrl ? (
            <div style={{ marginTop: 12 }}>
              <div className="sip-label">Preview</div>
              <div className="sip-previewBox">
                <img
                  src={generatedImageUrl}
                  alt="Generated support"
                  style={{ width: "100%", borderRadius: 12 }}
                  draggable={false}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="sip-foot">
          <button className="sip-btn" onClick={() => setTab("preview")} type="button">
            View JSON
          </button>

          <button className="sip-btn" onClick={handleGenerate} disabled={busy} type="button">
            {busy ? "Generating..." : "Generate"}
          </button>

          <button className="sip-btn sip-btn-primary" onClick={handleUseImage} disabled={!generatedImageUrl} type="button">
            Use this image
          </button>
        </div>
      </div>
    </div>
  );
}

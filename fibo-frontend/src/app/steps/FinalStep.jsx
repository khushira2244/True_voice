import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AttendModal from "../../steps/AttendModal.jsx"

export default function FinalStep({
  EPISODE_KEY,
  INITIAL_EPISODE_STATE,
  setEpisodeState,
  setCurrentStep,
  setAuthed,
  finalView,
  setFinalView,
}) {
  // Optional: if finalView ever becomes undefined, default to episodes
  const view = finalView || "episodes";

  // ✅ state (modal)
  const [attendOpen, setAttendOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  // ✅ refresh tick to re-read localStorage after save
  const [refreshTick, setRefreshTick] = useState(0);

  // ✅ profile (guardian defaults)
  const PROFILE_KEY = "truevoice_profile";
  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    } catch {
      return null;
    }
  }, []);

  // ✅ helper to save episodes back
  function saveEpisodes(next) {
    localStorage.setItem(EPISODE_KEY, JSON.stringify(next));
    setRefreshTick((t) => t + 1); // force saved to refresh
  }

  // 1) Read saved episodes safely
  const saved = useMemo(() => {
    try {
      const raw = localStorage.getItem(EPISODE_KEY);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [EPISODE_KEY, refreshTick]);

  const episodes10 = useMemo(() => saved.slice(-10).reverse(), [saved]);

  const PIE_COLORS = [
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

  // 2) ✅ Counts must be defined BEFORE symptomData uses them
  const symptomCount = useMemo(() => {
    return saved.reduce((acc, e) => {
      const key = e?.symptomId;
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [saved]);

  const scenarioCount = useMemo(() => {
    return saved.reduce((acc, e) => {
      const key = e?.scenarioId;
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [saved]);

  const emergencyCount = useMemo(() => {
    return saved.filter((e) => e?.symptomId === "emergency").length;
  }, [saved]);

  // 3) ✅ Build chart data AFTER counts exist
  const symptomData = useMemo(() => {
    return Object.entries(symptomCount)
      .filter(([name]) => name)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [symptomCount]);

  return (
    <div className="final-page">
      <div className="final-panel">
        {/* HEADER */}
        <div className="final-head">
          {view === "analytics" ? (
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
            <div>
              <div className="final-title">All done 💌</div>
              <div className="final-subtitle">Last 10 episodes</div>
            </div>
          )}
        </div>

        {/* BODY */}
        {view === "episodes" ? (
          <>
            <div className="episode-grid">
              {episodes10.length === 0 ? (
                <div style={{ opacity: 0.8 }}>
                  No episodes yet. Start one to see it here.
                </div>
              ) : (
                // ✅ replaced map block (dot + color + click)
                episodes10.map((ep, idx) => {
                  const attended = ep?.attended === true; // ✅ strict fallback

                  return (
                    <div
                      key={ep.id || idx}
                      className={`episode-card ${
                        attended
                          ? "episode-card--attended"
                          : "episode-card--notAttended"
                      } ${!attended ? "episode-card--clickable" : ""}`}
                      onClick={() => {
                        if (attended) return; // ✅ attended not clickable
                        setSelectedIdx(idx);
                        setAttendOpen(true);
                      }}
                    >
                      {/* ✅ status dot only */}
                      <span
                        className={`status-dot ${
                          attended
                            ? "status-dot--attended"
                            : "status-dot--notAttended"
                        }`}
                      />

                      <div>
                        <b>Hero:</b> {ep.heroId || "-"}
                      </div>
                      <div>
                        <b>Where:</b> {ep.scenarioId || "-"}
                      </div>
                      <div>
                        <b>Symptom:</b> {ep.symptomId || "-"}
                      </div>
                      <div>
                        <b>Severity:</b> {ep.severityId || "-"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ✅ modal just below grid */}
            <AttendModal
              open={attendOpen}
              title="Mark as attended"
              guardianDefault={{
                name: profile?.guardianName || "",
                relationship: profile?.relationship || "Mother",
              }}
              onClose={() => {
                setAttendOpen(false);
                setSelectedIdx(null);
              }}
              onSubmit={(payload) => {
                // payload: { type, name, relationship, attendedAt }

                // IMPORTANT: selectedIdx is index in episodes10 (last 10 reversed)
                // We must map it back to the real index in `saved`.
                const realIndex = saved.length - 1 - selectedIdx; // because reversed

                const next = [...saved];
                const old = next[realIndex] || {};

                next[realIndex] = {
                  ...old,
                  attended: true,
                  attendedBy: payload,
                };

                saveEpisodes(next);

                setAttendOpen(false);
                setSelectedIdx(null);

                // keep view on episodes
                setFinalView("episodes");
              }}
            />

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
            {/* ONE KPI BOX */}
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

            {/* PIE CHART (Symptoms) */}
            {symptomData.length === 0 ? (
              <div style={{ opacity: 0.8 }}>
                No symptom data yet. Create some episodes first.
              </div>
            ) : (
              <div className="analytics-pieSection">
                <div className="analytics-pieTitle">Symptoms distribution</div>

                <div className="pieRow">
                  {/* legend */}
                  <div className="legendChips">
                    {symptomData.slice(0, 10).map((s, i) => (
                      <div className="chip" key={s.name}>
                        <span
                          className="chipDot"
                          style={{
                            background: PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                        <span className="chipText">
                          {s.name}: <b>{s.value}</b>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* chart */}
                  <div className="pieBox">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={symptomData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          paddingAngle={2}
                        >
                          {symptomData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

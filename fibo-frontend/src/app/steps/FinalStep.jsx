import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function FinalStep({
  EPISODE_KEY,
  INITIAL_EPISODE_STATE,
  setEpisodeState,
  setCurrentStep,
  setAuthed,
  finalView,
  setFinalView,
}) {
  // 1) Read saved episodes safely
  const saved = useMemo(() => {
    try {
      const raw = localStorage.getItem(EPISODE_KEY);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [EPISODE_KEY]);

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

  // Optional: if finalView ever becomes undefined, default to episodes
  const view = finalView || "episodes";

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
                episodes10.map((ep, idx) => (
                  <div className="episode-card" key={ep.id || idx}>
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
                ))
              )}
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
                            background:
                              PIE_COLORS[i % PIE_COLORS.length],
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

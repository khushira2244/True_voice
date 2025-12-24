import React, { useEffect, useState } from "react";
import {
  HEROES,
  HERO_SCENARIO_,
  HERO_SCENARIO_SYMPTOMS,
  HERO_SCENARIO_SYMPTOM_WITH_SRVERITY,
} from "../data/heroes";

const API_BASE = import.meta.env.VITE_API_BASE || "";

// ---------------- helpers ----------------
function preloadImages(urls = []) {
  urls.forEach((url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  });
}

function preloadInBatches(urls = [], batchSize = 6, delay = 300) {
  let i = 0;
  function run() {
    const batch = urls.slice(i, i + batchSize);
    preloadImages(batch);
    i += batchSize;
    if (i < urls.length) setTimeout(run, delay);
  }
  run();
}

function collectAllOtherImages() {
  const urls = [];

  // scenarios
  Object.values(HERO_SCENARIO_).forEach((hero) => {
    Object.values(hero).forEach((node) => {
      if (node?.imageUrl) urls.push(node.imageUrl);
    });
  });

  // symptoms
  Object.values(HERO_SCENARIO_SYMPTOMS).forEach((hero) => {
    Object.values(hero).forEach((scenario) => {
      Object.values(scenario).forEach((node) => {
        if (node?.imageUrl) urls.push(node.imageUrl);
      });
    });
  });

  // severity
  Object.values(HERO_SCENARIO_SYMPTOM_WITH_SRVERITY).forEach((hero) => {
    Object.values(hero).forEach((scenario) => {
      Object.values(scenario).forEach((sym) => {
        if (sym?.severe?.imageUrl) urls.push(sym.severe.imageUrl);
      });
    });
  });

  // de-dupe (optional)
  return Array.from(new Set(urls));
}

// ---------------- location (silent) ----------------
function getBrowserLocation({ timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: false,
        timeout: timeoutMs,
        maximumAge: 60_000,
      }
    );
  });
}

async function postLocationSilently({ token }) {
  // don’t re-ask too frequently (optional guard)
  const last = JSON.parse(localStorage.getItem("tv_location") || "null");
  if (last?.savedAt) {
    const ageMs = Date.now() - new Date(last.savedAt).getTime();
    if (ageMs < 10 * 60 * 1000) return; // 10 minutes
  }

  try {
    const loc = await getBrowserLocation({ timeoutMs: 8000 });

    const res = await fetch(`${API_BASE}/api/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ lat: loc.lat, lon: loc.lon }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      // fail silently
      return;
    }

    const payload = {
      lat: data?.location?.lat ?? loc.lat,
      lon: data?.location?.lon ?? loc.lon,
      label: data?.location?.label || "",
      accuracy: loc.accuracy,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("tv_location", JSON.stringify(payload));
  } catch (e) {
    // user denied / timeout / any error -> ignore silently
  }
}

// ---------------- component ----------------
function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ PRELOAD HERO IMAGES ON PAGE LOAD (FAST, ONLY 2)
  useEffect(() => {
    preloadImages(HEROES.map((h) => h.imageUrl));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ PRELOAD ALL OTHER IMAGES AFTER SUCCESS (BATCHED)
      preloadInBatches(collectAllOtherImages());

      // ✅ SILENT LOCATION CAPTURE (DO NOT BLOCK UI)
      // fire-and-forget
      postLocationSilently({ token: data.token });

      onSuccess?.(data);
    } catch (e2) {
      setErr(e2?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-title">Login</div>
        <div className="auth-subtitle">Use the same email as you registered.</div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="a@b.com"
              autoComplete="email"
            />
          </label>

          <label className="auth-label">
            Password
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
            />
          </label>

          {err ? <div className="auth-error">{err}</div> : null}

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

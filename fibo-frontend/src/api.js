const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  // ✅ login is handled in Login.jsx already, so keep only protected calls here

  generateHero(hero) {
    return request("/api/hero", {
      method: "POST",
      body: JSON.stringify({ hero }),
    });
  },

  generateScenario(hero, scenario) {
    return request("/api/scenario", {
      method: "POST",
      body: JSON.stringify({ hero, scenario }),
    });
  },

  generateSymptom(hero, scenario, symptom) {
    return request("/api/symptom", {
      method: "POST",
      body: JSON.stringify({ hero, scenario, symptom }),
    });
  },

  generateSeverity(hero, scenario, symptom, severity) {
    return request("/api/severity", {
      method: "POST",
      body: JSON.stringify({ hero, scenario, symptom, severity }),
    });
  },
};

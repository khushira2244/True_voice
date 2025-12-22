// HeroStep.jsx
import React, { useState } from "react";
import { HEROES } from "../data/heroes";

function HeroStep({ episodeState, onSelectHero }) {
  // ✅ static heroes from heroes.js
  const [heroes] = useState(HEROES);
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentHero = heroes[currentIdx] || null;

  function next() {
    if (!heroes.length) return;
    setCurrentIdx((i) => (i + 1) % heroes.length);
  }

  function prev() {
    if (!heroes.length) return;
    setCurrentIdx((i) => (i - 1 + heroes.length) % heroes.length);
  }

  return (
    <div className="step-container hero-step">
      {/* arrows */}
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
        {currentHero?.imageUrl ? (
          <img
            src={currentHero.imageUrl}
            alt={currentHero.label || currentHero.id}
            className="hero-main-image"
            onClick={() => onSelectHero(currentHero.id)}
            draggable={false}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              opacity: 0.75,
              fontWeight: 700,
            }}
          >
            No hero image
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroStep;

// 
// HeroStep.jsx
import React, { useState } from "react";
// remove: import { api } from "../api.js";
import { HEROES } from "../data/heroes";


function HeroStep({ episodeState, onSelectHero }) {
  // we already have the heroes locally
  const [heroes] = useState(HEROES);
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentHero = heroes[currentIdx] || null;

  function next() {
    if (heroes.length === 0) return;
    setCurrentIdx((i) => (i + 1) % heroes.length);
  }

  function prev() {
    if (heroes.length === 0) return;
    setCurrentIdx((i) => (i - 1 + heroes.length) % heroes.length);
  }

  console.log("HEROES length:", heroes.length, heroes);
console.log("currentIdx:", currentIdx, "currentHero:", currentHero);


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
        src={currentHero?.imageUrl}
        alt="Hero"
        className="hero-main-image"
        onClick={() => currentHero && onSelectHero(currentHero.id)}
      />

     

    </div>
  </div>
);



}

export default HeroStep;

//1050*630
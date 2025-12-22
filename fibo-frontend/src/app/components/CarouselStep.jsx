import React, { useEffect, useState } from "react";

export default function CarouselStep({ items, onPick, onBack, debugName = "step" }) {
  const [idx, setIdx] = useState(0);

  // ✅ reset index whenever items change (IMPORTANT FIX)
  useEffect(() => {
    setIdx(0);
    console.log(`[${debugName}] items changed -> reset idx=0`, {
      len: items?.length,
      items,
    });
  }, [items]); // (using items is safest)

  const current = items?.[idx] || null;

  // ✅ log every render state
  useEffect(() => {
    console.log(`[${debugName}] render`, {
      idx,
      itemsLen: items?.length,
      current,
      currentSrc: current?.imageUrl,
    });
  }, [debugName, idx, items, current]);

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
        {/* ✅ if current is null, show placeholder text (no broken img) */}
        {current?.imageUrl ? (
          <img
            src={current.imageUrl}
            alt={current.id || "option"}
            className="hero-main-image"
            onClick={() => onPick?.(current)}
            onError={(e) => {
              console.error(`[${debugName}] IMG ERROR`, {
                idx,
                src: e.currentTarget?.src,
                current,
                items,
              });
            }}
            onLoad={() => {
              console.log(`[${debugName}] IMG LOADED`, { idx, src: current.imageUrl });
            }}
          />
        ) : (
          <div style={{ color: "white", padding: 20, fontWeight: 700 }}>
            No image available (idx={idx}, len={items?.length})
          </div>
        )}
      </div>

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

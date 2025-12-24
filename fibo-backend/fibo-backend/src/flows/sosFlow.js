// src/flows/sosFlow.js

const HERO_NAME_MAP = {
  ava_child: "AVA",
  leo_child: "LEO",
};

function safeText(x) {
  return typeof x === "string" ? x.trim() : "";
}

/**
 * SOS image is for confidence only (not real navigation).
 * No child face, no real readable map labels.
 * Dark map UI + red alert + SOS SENT + pulsing pin.
 */
export function buildSosPrompt({ hero, placeLabel }) {
  const heroName = HERO_NAME_MAP[hero] || "CHILD";
  const loc = safeText(placeLabel) || "your current location";

  return (
    `Dark-mode emergency map interface style poster. ` +
    `Abstract grayscale map background with thin roads/lines, but NO readable real place labels. ` +
    `A single pulsing location pin icon marks the center. ` +
    `Top-center small label: '${loc}'. ` +
    `Center: a red glowing exclamation mark inside a circle. ` +
    `Bottom: large bold white text: 'SOS SENT'. ` +
    `Minimal modern flat UI, high contrast, calm but urgent. ` +
    `No child/person visible. No faces. No real street names. ` +
    `Theme tag: ${heroName}.`
  );
}

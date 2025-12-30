import React, { useEffect } from "react";
function Landing({ onDone, ms = 30000 }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), ms);
    return () => clearTimeout(t);
  }, [onDone, ms]);

  return (
    <div className="landing">
      <div className="landing-bg" />
      <div className="landing-overlay" />

      <div className="landing-center">
        <div className="landing-title">
          <img src="/logo.svg" alt="True Voice logo" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
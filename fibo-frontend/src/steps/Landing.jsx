import React, { useEffect } from "react";
import LogoSVG from "../data/logo.svg";
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

           <img src={LogoSVG} alt="True Voice logo" />
        </div>
      </div>
    </div>
  );
}

export default Landing;

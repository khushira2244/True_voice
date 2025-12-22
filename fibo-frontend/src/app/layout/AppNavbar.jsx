import React from "react";

export default function AppNavbar({ headerText, onLogout }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <div
        style={{
          position: "relative",
          height: 64,
          background: "#dc941fff",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontWeight: 700,
          fontSize: 18,
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>True Voice</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: 600,
            opacity: 0.95,
            whiteSpace: "nowrap",
          }}
        >
          {headerText}
        </div>

        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.45)",
              color: "white",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

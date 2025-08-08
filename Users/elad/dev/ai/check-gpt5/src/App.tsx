import "./App.css";
import React from "react";
import { RubiksCubeScene } from "./components/RubiksCube";
import { ControlsPanel } from "./components/UI/ControlsPanel";
import { KeyboardHandler } from "./components/KeyboardHandler";

export default function App() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 16,
        height: "100dvh",
        padding: 12,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #222",
        }}
      >
        <RubiksCubeScene />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ margin: 0 }}>קוביה הונגרית</h2>
        <ControlsPanel />
        <KeyboardHandler />
        <div style={{ marginTop: "auto", fontSize: 12, opacity: 0.8 }}>
          בנוי עם React, Three.js, zustand ו-@react-three/fiber. סיבובים חלקים,
          אנימציות מלאות, מקלדת וכפתורים.
        </div>
      </div>
    </div>
  );
}

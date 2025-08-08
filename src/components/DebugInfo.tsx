import React from "react";
import { useCubeStore } from "../state/cubeStore";

export function DebugInfo() {
  const active = useCubeStore((s) => s.activeRotation);
  const queue = useCubeStore((s) => s.moveQueue);
  
  return (
    <div style={{
      position: "fixed",
      top: 10,
      left: 10,
      background: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      fontFamily: "monospace",
      fontSize: "12px",
      zIndex: 1000
    }}>
      <div>Animation Status:</div>
      {active ? (
        <div style={{ color: "#00ff00" }}>
          ANIMATING: {active.axis.toUpperCase()} layer {active.layer} dir: {active.direction}
        </div>
      ) : (
        <div style={{ color: "#ffff00" }}>IDLE</div>
      )}
      <div>Queue: {queue.length} moves</div>
    </div>
  );
}
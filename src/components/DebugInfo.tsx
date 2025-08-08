import { useCubeStore } from "../state/cubeStore";

export function DebugInfo() {
  const active = useCubeStore((s) => s.activeRotation);
  const queue = useCubeStore((s) => s.moveQueue);
  
  return (
    <div style={{
      position: "fixed",
      top: 10,
      left: 10,
      background: "rgba(0,0,0,0.9)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      fontFamily: "monospace",
      fontSize: "11px",
      zIndex: 1000,
      lineHeight: "1.3"
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>Store Active: {active ? 
        <span style={{ color: "#00ff00" }}>
          {active.axis.toUpperCase()}-{active.layer}-{active.direction > 0 ? "CW" : "CCW"}
        </span> : 
        <span style={{ color: "#888" }}>null</span>
      }</div>
      <div>Queue: {queue.length} moves</div>
      <div>Time: {Date.now() % 10000}</div>
    </div>
  );
}
import { useEffect } from "react";
import { useCubeStore, movesFromString } from "../state/cubeStore";

export function KeyboardHandler() {
  const enqueue = useCubeStore((s) => s.enqueueMoves);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const prime = e.shiftKey ? "'" : "";
      const dbl = e.code === "Digit2" || e.key === "2" ? "2" : "";
      const valid = ["U", "D", "L", "R", "F", "B"];
      if (valid.includes(key)) {
        // Prevent double modifier conflict
        const suffix = dbl ? "2" : prime;
        enqueue(movesFromString(`${key}${suffix}`));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enqueue]);
  return null;
}

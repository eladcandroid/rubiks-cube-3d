import React, { useCallback, useMemo, useState } from "react";
import {
  useCubeStore,
  movesFromString,
  randomScramble,
} from "../../state/cubeStore";

const BUTTONS: Array<{ label: string; seq: string }> = [
  { label: "U", seq: "U" },
  { label: "U'", seq: "U'" },
  { label: "U2", seq: "U2" },
  { label: "D", seq: "D" },
  { label: "D'", seq: "D'" },
  { label: "D2", seq: "D2" },
  { label: "L", seq: "L" },
  { label: "L'", seq: "L'" },
  { label: "L2", seq: "L2" },
  { label: "R", seq: "R" },
  { label: "R'", seq: "R'" },
  { label: "R2", seq: "R2" },
  { label: "F", seq: "F" },
  { label: "F'", seq: "F'" },
  { label: "F2", seq: "F2" },
  { label: "B", seq: "B" },
  { label: "B'", seq: "B'" },
  { label: "B2", seq: "B2" },
];

export function ControlsPanel() {
  const enqueue = useCubeStore((s) => s.enqueueMoves);
  const reset = useCubeStore((s) => s.reset);
  const [seq, setSeq] = useState("");
  const [scramble, setScramble] = useState(() => randomScramble());

  const runSeq = useCallback(
    (text: string) => {
      const moves = movesFromString(text);
      enqueue(moves);
    },
    [enqueue]
  );

  const onScramble = useCallback(() => {
    const s = randomScramble();
    setScramble(s);
    runSeq(s);
  }, [runSeq]);

  const disabled = useCubeStore((s) => !!s.activeRotation);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          gap: 6,
        }}
      >
        {BUTTONS.map((b) => (
          <button
            key={b.label}
            onClick={() => runSeq(b.seq)}
            disabled={disabled}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => runSeq(scramble)} disabled={disabled}>
          Run Scramble
        </button>
        <button onClick={onScramble} disabled={disabled}>
          New Scramble
        </button>
        <button onClick={() => reset()} disabled={disabled}>
          Reset
        </button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={seq}
          onChange={(e) => setSeq(e.target.value)}
          placeholder="Enter sequence e.g., R U R' U'"
          style={{ flex: 1 }}
        />
        <button onClick={() => runSeq(seq)} disabled={!seq.trim() || disabled}>
          Run
        </button>
      </div>
      <small>
        Tip: Keyboard shortcuts: U D L R F B, with Shift for prime, 2 for
        double.
      </small>
    </div>
  );
}

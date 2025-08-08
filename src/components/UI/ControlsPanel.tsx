import { useCallback, useState } from "react";
import {
  useCubeStore,
  movesFromString,
  randomScramble,
} from "../../state/cubeStore";
import { useLanguage } from "../../contexts/LanguageContext";

const MOVE_BUTTONS = [
  { key: "moves.U", seq: "U" },
  { key: "moves.U_prime", seq: "U'" },
  { key: "moves.U2", seq: "U2" },
  { key: "moves.D", seq: "D" },
  { key: "moves.D_prime", seq: "D'" },
  { key: "moves.D2", seq: "D2" },
  { key: "moves.L", seq: "L" },
  { key: "moves.L_prime", seq: "L'" },
  { key: "moves.L2", seq: "L2" },
  { key: "moves.R", seq: "R" },
  { key: "moves.R_prime", seq: "R'" },
  { key: "moves.R2", seq: "R2" },
  { key: "moves.F", seq: "F" },
  { key: "moves.F_prime", seq: "F'" },
  { key: "moves.F2", seq: "F2" },
  { key: "moves.B", seq: "B" },
  { key: "moves.B_prime", seq: "B'" },
  { key: "moves.B2", seq: "B2" },
];

export function ControlsPanel() {
  const { t } = useLanguage();
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
        {MOVE_BUTTONS.map((button) => (
          <button
            key={button.seq}
            onClick={() => runSeq(button.seq)}
            disabled={disabled}
            style={{
              minHeight: "36px",
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "monospace"
            }}
          >
            {t(button.key)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => runSeq(scramble)} disabled={disabled}>
          {t('controls.runScramble')}
        </button>
        <button onClick={onScramble} disabled={disabled}>
          {t('controls.newScramble')}
        </button>
        <button onClick={() => reset()} disabled={disabled}>
          {t('controls.reset')}
        </button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={seq}
          onChange={(e) => setSeq(e.target.value)}
          placeholder={t('controls.inputPlaceholder')}
          style={{ flex: 1 }}
        />
        <button onClick={() => runSeq(seq)} disabled={!seq.trim() || disabled}>
          {t('controls.run')}
        </button>
      </div>
      <small>
        {t('controls.keyboardTip')}
      </small>
    </div>
  );
}

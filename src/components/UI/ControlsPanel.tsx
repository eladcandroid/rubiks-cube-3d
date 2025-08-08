import { useCallback, useState } from "react";
import {
  useCubeStore,
  movesFromString,
  randomScramble,
} from "../../state/cubeStore";
import { useLanguage } from "../../contexts/LanguageContext";
import { generateActualSolvingSteps, setLastScramble } from "../../utils/realCubeSolver";
import { SolvingSteps } from "./SolvingSteps";

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
  const addSolvingStep = useCubeStore((s) => s.addSolvingStep);
  const clearSolvingSteps = useCubeStore((s) => s.clearSolvingSteps);
  const setIsSolving = useCubeStore((s) => s.setIsSolving);
  const setCurrentSolvingStep = useCubeStore((s) => s.setCurrentSolvingStep);
  const setBaseCubeState = useCubeStore((s) => s.setBaseCubeState);
  const isSolving = useCubeStore((s) => s.isSolving);
  const cubies = useCubeStore((s) => s.cubies);
  const [seq, setSeq] = useState("");

  const runSeq = useCallback(
    (text: string) => {
      const moves = movesFromString(text);
      enqueue(moves);
    },
    [enqueue]
  );

  const onScramble = useCallback(() => {
    const s = randomScramble();
    console.log('🎲 SCRAMBLE: Generated new scramble:', s);
    setLastScramble(s); // Store for solving
    
    // Store the current cube state before scrambling
    setTimeout(() => {
      setBaseCubeState(JSON.parse(JSON.stringify(cubies)));
      console.log('📦 SCRAMBLE: Stored base cube state for step navigation');
    }, s.split(' ').length * 600 + 100); // Wait for scramble to complete
    
    runSeq(s);
  }, [runSeq, cubies, setBaseCubeState]);

  const onAutoSolve = useCallback(async () => {
    if (isSolving) return;

    clearSolvingSteps();
    setIsSolving(true);
    setCurrentSolvingStep(-1);

    const steps = generateActualSolvingSteps();

    // Add initial step
    addSolvingStep({
      stepKey: "solve.starting",
      descKey: "solve.starting",
      moves: "",
    });
    setCurrentSolvingStep(0);

    // Execute each step with delay for educational effect
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait between steps

      addSolvingStep(steps[i]);
      setCurrentSolvingStep(i + 1);

      // Execute the moves
      enqueue(steps[i].moveCommands);

      // Wait for moves to complete before next step
      await new Promise((resolve) =>
        setTimeout(resolve, steps[i].moveCommands.length * 600)
      );
    }

    // Complete solving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addSolvingStep({
      stepKey: "solve.completed",
      descKey: "solve.completed",
      moves: "",
    });
    setCurrentSolvingStep(steps.length + 1);
    setIsSolving(false);
  }, [
    isSolving,
    clearSolvingSteps,
    setIsSolving,
    setCurrentSolvingStep,
    addSolvingStep,
    enqueue,
  ]);

  const disabled = useCubeStore((s) => !!s.activeRotation) || isSolving;

  return (
    <div style={{ display: "grid", gap: 8, overflow: "auto", flex: 1, minHeight: 0 }}>
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
              fontFamily: "monospace",
            }}
          >
            {t(button.key)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={onScramble} disabled={disabled}>
          {t("controls.newScramble")}
        </button>
        <button
          onClick={onAutoSolve}
          disabled={disabled}
          style={{
            backgroundColor: isSolving ? "#ff9800" : "#4caf50",
            color: "white",
            border: "none",
            fontWeight: "bold",
          }}
        >
          {t("controls.autoSolve")}
        </button>
        <button onClick={() => reset()} disabled={disabled}>
          {t("controls.reset")}
        </button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={seq}
          onChange={(e) => setSeq(e.target.value)}
          placeholder={t("controls.inputPlaceholder")}
          style={{ flex: 1 }}
        />
        <button onClick={() => runSeq(seq)} disabled={!seq.trim() || disabled}>
          {t("controls.run")}
        </button>
      </div>
      <small>{t("controls.keyboardTip")}</small>
      <SolvingSteps />
    </div>
  );
}

import { create } from "zustand";

export type Axis = "x" | "y" | "z";

export type Face = "U" | "D" | "L" | "R" | "F" | "B";

export type Layer = -1 | 0 | 1;

export interface CubieData {
  id: string;
  position: [number, number, number];
  // Quaternion [x, y, z, w]
  orientation: [number, number, number, number];
  // Sticker colors per local face, hex string (e.g. '#ffffff')
  stickers: Partial<Record<"px" | "nx" | "py" | "ny" | "pz" | "nz", string>>;
}

export interface ActiveRotation {
  axis: Axis;
  layer: Layer;
  direction: 1 | -1; // +1 clockwise looking at positive axis direction, -1 counter clockwise
  startTime: number;
  durationMs: number;
}

export interface MoveCommand {
  axis: Axis;
  layer: Layer;
  direction: 1 | -1;
}

export interface SolvingStep {
  stepKey: string;
  descKey: string;
  moves: string;
}

export interface CubeState {
  cubies: CubieData[];
  activeRotation: ActiveRotation | null;
  moveQueue: MoveCommand[];
  solvingSteps: SolvingStep[];
  isSolving: boolean;
  currentSolvingStep: number;
  setActiveRotation: (rot: ActiveRotation | null) => void;
  enqueueMoves: (moves: MoveCommand[]) => void;
  startNextMove: () => void;
  commitActiveRotation: () => void;
  addSolvingStep: (step: SolvingStep) => void;
  clearSolvingSteps: () => void;
  setIsSolving: (solving: boolean) => void;
  setCurrentSolvingStep: (step: number) => void;
  reset: () => void;
}

// Standard Rubik's cube color scheme (exact colors)
export const FACE_COLORS: Record<Face, string> = {
  U: "#ffffff", // white (top)
  D: "#ffd500", // yellow (bottom)
  L: "#ff6900", // orange (left)
  R: "#ba0000", // red (right)
  F: "#009b48", // green (front)
  B: "#0045ad", // blue (back)
};

function makeSolvedCubies(): CubieData[] {
  const cubies: CubieData[] = [];
  let idCounter = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue; // hidden core
        const stickers: CubieData["stickers"] = {};
        if (x === 1) stickers.px = FACE_COLORS.R; // Right
        if (x === -1) stickers.nx = FACE_COLORS.L; // Left
        if (y === 1) stickers.py = FACE_COLORS.U; // Up
        if (y === -1) stickers.ny = FACE_COLORS.D; // Down
        if (z === 1) stickers.pz = FACE_COLORS.F; // Front
        if (z === -1) stickers.nz = FACE_COLORS.B; // Back
        cubies.push({
          id: `c${idCounter++}`,
          position: [x, y, z],
          orientation: [0, 0, 0, 1],
          stickers,
        });
      }
    }
  }
  return cubies;
}

function rotateVector90(
  v: [number, number, number],
  axis: Axis,
  direction: 1 | -1
): [number, number, number] {
  const [x, y, z] = v;
  // 90 deg rotation matrix variants
  // Rotation around X-axis: [1, 0, 0; 0, cos, -sin; 0, sin, cos]
  if (axis === "x") {
    if (direction === 1) {
      // 90 degrees clockwise looking from positive x
      return [x, -z, y];
    } else {
      // 90 degrees counter-clockwise
      return [x, z, -y];
    }
  }
  // Rotation around Y-axis: [cos, 0, sin; 0, 1, 0; -sin, 0, cos]
  if (axis === "y") {
    if (direction === 1) {
      // 90 degrees clockwise looking from positive y
      return [z, y, -x];
    } else {
      // 90 degrees counter-clockwise
      return [-z, y, x];
    }
  }
  // Rotation around Z-axis: [cos, -sin, 0; sin, cos, 0; 0, 0, 1]
  if (direction === 1) {
    // 90 degrees clockwise looking from positive z
    return [-y, x, z];
  } else {
    // 90 degrees counter-clockwise
    return [y, -x, z];
  }
}

function multiplyQuaternion(
  q1: [number, number, number, number],
  q2: [number, number, number, number]
): [number, number, number, number] {
  const [x1, y1, z1, w1] = q1;
  const [x2, y2, z2, w2] = q2;
  return [
    w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
    w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
    w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
    w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
  ];
}

function quatFromAxisAngle(
  axis: Axis,
  angle: number
): [number, number, number, number] {
  const half = angle / 2;
  const s = Math.sin(half);
  if (axis === "x") return [s, 0, 0, Math.cos(half)];
  if (axis === "y") return [0, s, 0, Math.cos(half)];
  return [0, 0, s, Math.cos(half)];
}

export const useCubeStore = create<CubeState>((set, get) => ({
  cubies: makeSolvedCubies(),
  activeRotation: null,
  moveQueue: [],
  solvingSteps: [],
  isSolving: false,
  currentSolvingStep: -1,
  setActiveRotation: (rot) => set({ activeRotation: rot }),
  enqueueMoves: (moves) =>
    set((s) => ({ moveQueue: [...s.moveQueue, ...moves] })),
  startNextMove: () => {
    const { activeRotation, moveQueue } = get();
    if (activeRotation || moveQueue.length === 0) return;
    const next = moveQueue[0];
    set({
      activeRotation: {
        axis: next.axis,
        layer: next.layer,
        direction: next.direction,
        startTime: performance.now(),
        durationMs: 500,
      },
      moveQueue: moveQueue.slice(1),
    });
  },
  commitActiveRotation: () => {
    const rot = get().activeRotation;
    if (!rot) return;

    set((state) => {
      const q = quatFromAxisAngle(rot.axis, (Math.PI / 2) * rot.direction);
      const updated = state.cubies.map((c) => {
        // Select layer
        const axisIndex = rot.axis === "x" ? 0 : rot.axis === "y" ? 1 : 2;
        const coord = c.position[axisIndex];
        if (coord !== rot.layer) return c;
        // Rotate position and orientation
        const newPos = rotateVector90(c.position, rot.axis, rot.direction);
        // Apply rotation quaternion: new_orientation = rotation_q * current_orientation
        const newOrient = multiplyQuaternion(q, c.orientation);
        // Round tiny floats to -1, 0, 1 for stability
        const snap = (n: number) => (Math.abs(n) < 0.001 ? 0 : Math.round(n));
        return {
          ...c,
          position: [snap(newPos[0]), snap(newPos[1]), snap(newPos[2])] as [
            number,
            number,
            number
          ],
          orientation: newOrient,
        };
      });

      return { cubies: updated, activeRotation: null };
    });
  },
  addSolvingStep: (step) =>
    set((s) => ({ solvingSteps: [...s.solvingSteps, step] })),
  clearSolvingSteps: () => set({ solvingSteps: [], currentSolvingStep: -1 }),
  setIsSolving: (solving) => set({ isSolving: solving }),
  setCurrentSolvingStep: (step) => set({ currentSolvingStep: step }),
  reset: () =>
    set({
      cubies: makeSolvedCubies(),
      activeRotation: null,
      moveQueue: [],
      solvingSteps: [],
      isSolving: false,
      currentSolvingStep: -1,
    }),
}));

// Helpers to express human moves (U, D, L, R, F, B)
export function parseMove(token: string): MoveCommand[] {
  // Supports notations like: U, U', U2
  const face = token[0] as Face;
  const suffix = token.slice(1);
  const { axis, layer, cw } = faceToAxis(face);
  const dir: 1 | -1 = cw ? 1 : -1;
  const times = suffix === "2" ? 2 : 1;
  const direction = suffix === "'" ? (dir === 1 ? -1 : 1) : dir;
  const cmds: MoveCommand[] = [];
  for (let i = 0; i < times; i++) cmds.push({ axis, layer, direction });
  return cmds;
}

export function faceToAxis(face: Face): {
  axis: Axis;
  layer: Layer;
  cw: boolean;
} {
  switch (face) {
    case "U":
      return { axis: "y", layer: 1, cw: 1 === 1 };
    case "D":
      return { axis: "y", layer: -1, cw: false };
    case "R":
      return { axis: "x", layer: 1, cw: 1 === 1 };
    case "L":
      return { axis: "x", layer: -1, cw: false };
    case "F":
      return { axis: "z", layer: 1, cw: 1 === 1 };
    case "B":
      return { axis: "z", layer: -1, cw: false };
  }
}

export function movesFromString(seq: string): MoveCommand[] {
  // Split by spaces
  const tokens = seq.trim().split(/\s+/).filter(Boolean);
  return tokens.flatMap((t) => parseMove(t));
}

export function randomScramble(length = 25): string {
  const faces: Face[] = ["U", "D", "L", "R", "F", "B"];
  const suffixes = ["", "'", "2"];
  const moves: string[] = [];
  const isOpposite = (a: Face, b: Face) =>
    (a === "U" && b === "D") ||
    (a === "D" && b === "U") ||
    (a === "L" && b === "R") ||
    (a === "R" && b === "L") ||
    (a === "F" && b === "B") ||
    (a === "B" && b === "F");
  for (let i = 0; i < length; i++) {
    let f: Face;
    do {
      f = faces[Math.floor(Math.random() * faces.length)];
    } while (moves.length > 0 && (moves[moves.length - 1][0] as Face) === f);
    // Avoid sequences like R L R or opposite faces alternating too much
    if (moves.length > 0) {
      const prev = moves[moves.length - 1][0] as Face;
      if (isOpposite(prev, f) && Math.random() < 0.5) {
        i--;
        continue;
      }
    }
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    moves.push(f + suf);
  }
  return moves.join(" ");
}

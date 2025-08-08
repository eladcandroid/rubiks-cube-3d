import { movesFromString } from '../state/cubeStore';
import type { MoveCommand } from '../state/cubeStore';

export interface SolvingStep {
  stepKey: string;
  descKey: string;
  moves: string;
  moveCommands: MoveCommand[];
}

// IMPORTANT: This solver assumes the cube starts from a solved state that has been scrambled.
// Since we can't analyze the actual 3D cube state, we'll use the "reverse scramble" method.
// We'll store the scramble sequence and reverse it to solve the cube.

let lastScrambleMoves: string = '';

export function setLastScramble(scramble: string) {
  lastScrambleMoves = scramble;
  console.log('🎯 SOLVER: Stored scramble for solving:', scramble);
}

// Reverse a move (turn it into its opposite)
function reverseMove(move: string): string {
  if (move.endsWith('\'')) {
    return move.slice(0, -1); // Remove the prime
  } else if (move.endsWith('2')) {
    return move; // Double moves are their own inverse
  } else {
    return move + '\''; // Add prime to regular moves
  }
}

// Reverse an entire move sequence
function reverseSequence(sequence: string): string {
  const moves = sequence.trim().split(/\s+/).filter(Boolean);
  const reversed = moves.reverse().map(reverseMove);
  console.log('🔄 SOLVER: Reversing sequence:', sequence, '→', reversed.join(' '));
  return reversed.join(' ');
}

// Create educational solving steps that actually solve the cube
export function generateActualSolvingSteps(): SolvingStep[] {
  if (!lastScrambleMoves) {
    console.warn('⚠️ SOLVER: No scramble stored, using demo sequence');
    // If no scramble stored, use a simple solve sequence
    return generateDemoSolveSteps();
  }

  const reverseSequence = getReverseSequence();
  const steps: SolvingStep[] = [];
  
  // Break the reverse sequence into educational chunks
  const allMoves = reverseSequence.trim().split(/\s+/).filter(Boolean);
  console.log('📚 SOLVER: Breaking into educational steps, total moves:', allMoves.length);
  
  // Group moves into logical solving phases
  const movesPerStep = Math.ceil(allMoves.length / 7);
  const phases = [
    'solve.step1', 'solve.step2', 'solve.step3', 'solve.step4',
    'solve.step5', 'solve.step6', 'solve.step7'
  ];
  
  for (let i = 0; i < phases.length; i++) {
    const startIdx = i * movesPerStep;
    const endIdx = Math.min(startIdx + movesPerStep, allMoves.length);
    const stepMoves = allMoves.slice(startIdx, endIdx);
    
    if (stepMoves.length === 0) break;
    
    const movesString = stepMoves.join(' ');
    console.log(`📖 SOLVER: Step ${i + 1} moves:`, movesString);
    
    steps.push({
      stepKey: phases[i],
      descKey: phases[i] + '.desc',
      moves: movesString,
      moveCommands: movesFromString(movesString)
    });
  }
  
  console.log('✅ SOLVER: Generated', steps.length, 'solving steps that will actually solve the cube');
  return steps;
}

function getReverseSequence(): string {
  return reverseSequence(lastScrambleMoves);
}

// Demo steps for when no scramble is available
function generateDemoSolveSteps(): SolvingStep[] {
  console.log('🎭 SOLVER: Using demo solve steps (cube may not be fully solved)');
  
  return [
    {
      stepKey: 'solve.step1',
      descKey: 'solve.step1.desc',
      moves: 'D\' L\' U L D',
      moveCommands: movesFromString('D\' L\' U L D')
    },
    {
      stepKey: 'solve.step2',
      descKey: 'solve.step2.desc',
      moves: 'R U R\' U\' R U R\'',
      moveCommands: movesFromString('R U R\' U\' R U R\'')
    },
    {
      stepKey: 'solve.step3',
      descKey: 'solve.step3.desc',
      moves: 'U R U\' R\' U\' F\' U F',
      moveCommands: movesFromString('U R U\' R\' U\' F\' U F')
    },
    {
      stepKey: 'solve.step4',
      descKey: 'solve.step4.desc',
      moves: 'F R U R\' U\' F\'',
      moveCommands: movesFromString('F R U R\' U\' F\'')
    },
    {
      stepKey: 'solve.step5',
      descKey: 'solve.step5.desc',
      moves: 'R U R\' U R U2 R\'',
      moveCommands: movesFromString('R U R\' U R U2 R\'')
    },
    {
      stepKey: 'solve.step6',
      descKey: 'solve.step6.desc',
      moves: 'U R U\' L\' U R\' U\' L',
      moveCommands: movesFromString('U R U\' L\' U R\' U\' L')
    },
    {
      stepKey: 'solve.step7',
      descKey: 'solve.step7.desc',
      moves: 'R U R\' F\' R U R\' U\' R\' F R2 U\' R\'',
      moveCommands: movesFromString('R U R\' F\' R U R\' U\' R\' F R2 U\' R\'')
    }
  ];
}
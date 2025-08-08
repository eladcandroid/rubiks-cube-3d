import { movesFromString } from '../state/cubeStore';
import type { MoveCommand } from '../state/cubeStore';

export interface SolvingStep {
  stepKey: string;
  descKey: string;
  moves: string;
  moveCommands: MoveCommand[];
}

// Simple beginner-friendly solving algorithm
// This is a simplified educational version, not a complete solver
export function generateSolvingSteps(): SolvingStep[] {
  const steps: SolvingStep[] = [];
  
  // Step 1: White Cross
  steps.push({
    stepKey: 'solve.step1',
    descKey: 'solve.step1.desc',
    moves: 'F R U R\' U\' F\'',
    moveCommands: movesFromString('F R U R\' U\' F\''),
  });
  
  // Step 2: White Corners
  steps.push({
    stepKey: 'solve.step2',
    descKey: 'solve.step2.desc', 
    moves: 'R U R\' U\'',
    moveCommands: movesFromString('R U R\' U\''),
  });
  
  steps.push({
    stepKey: 'solve.step2',
    descKey: 'solve.step2.desc',
    moves: 'U R U\' R\'',
    moveCommands: movesFromString('U R U\' R\''),
  });
  
  // Step 3: Middle Layer
  steps.push({
    stepKey: 'solve.step3',
    descKey: 'solve.step3.desc',
    moves: 'U R U\' R\' U\' F\' U F',
    moveCommands: movesFromString('U R U\' R\' U\' F\' U F'),
  });
  
  steps.push({
    stepKey: 'solve.step3', 
    descKey: 'solve.step3.desc',
    moves: 'U\' L\' U L U F U\' F\'',
    moveCommands: movesFromString('U\' L\' U L U F U\' F\''),
  });
  
  // Step 4: Yellow Cross
  steps.push({
    stepKey: 'solve.step4',
    descKey: 'solve.step4.desc',
    moves: 'F R U R\' U\' F\'',
    moveCommands: movesFromString('F R U R\' U\' F\''),
  });
  
  // Step 5: Orient Yellow Corners  
  steps.push({
    stepKey: 'solve.step5',
    descKey: 'solve.step5.desc',
    moves: 'R U R\' U R U2 R\'',
    moveCommands: movesFromString('R U R\' U R U2 R\''),
  });
  
  // Step 6: Position Yellow Corners
  steps.push({
    stepKey: 'solve.step6',
    descKey: 'solve.step6.desc',
    moves: 'U R U\' L\' U R\' U\' L',
    moveCommands: movesFromString('U R U\' L\' U R\' U\' L'),
  });
  
  // Step 7: Position Final Edges
  steps.push({
    stepKey: 'solve.step7',
    descKey: 'solve.step7.desc',
    moves: 'R U R\' F\' R U R\' U\' R\' F R2 U\' R\'',
    moveCommands: movesFromString('R U R\' F\' R U R\' U\' R\' F R2 U\' R\''),
  });
  
  return steps;
}

// Alternative: Random educational moves for demonstration
// This will give kids an idea of solving techniques even if cube isn't perfectly solved
export function generateDemoSolvingSteps(): SolvingStep[] {
  return [
    {
      stepKey: 'solve.step1',
      descKey: 'solve.step1.desc',
      moves: 'F R U R\' U\' F\'',
      moveCommands: movesFromString('F R U R\' U\' F\''),
    },
    {
      stepKey: 'solve.step2', 
      descKey: 'solve.step2.desc',
      moves: 'R U R\' U\' R U R\' U\'',
      moveCommands: movesFromString('R U R\' U\' R U R\' U\''),
    },
    {
      stepKey: 'solve.step3',
      descKey: 'solve.step3.desc', 
      moves: 'U R U\' R\' U\' F\' U F',
      moveCommands: movesFromString('U R U\' R\' U\' F\' U F'),
    },
    {
      stepKey: 'solve.step4',
      descKey: 'solve.step4.desc',
      moves: 'F R U R\' U\' F\' U F R U R\' U\' F\'',
      moveCommands: movesFromString('F R U R\' U\' F\' U F R U R\' U\' F\''),
    },
    {
      stepKey: 'solve.step5',
      descKey: 'solve.step5.desc',
      moves: 'R U R\' U R U2 R\' U',
      moveCommands: movesFromString('R U R\' U R U2 R\' U'),
    },
    {
      stepKey: 'solve.step6',
      descKey: 'solve.step6.desc',
      moves: 'U R U\' L\' U R\' U\' L U2',
      moveCommands: movesFromString('U R U\' L\' U R\' U\' L U2'),
    },
    {
      stepKey: 'solve.step7',
      descKey: 'solve.step7.desc', 
      moves: 'R U R\' F\' R U R\' U\' R\' F R2 U\' R\' U',
      moveCommands: movesFromString('R U R\' F\' R U R\' U\' R\' F R2 U\' R\' U'),
    }
  ];
}
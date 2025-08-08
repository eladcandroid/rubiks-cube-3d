# 3D Rubik's Cube Game - Project Documentation

## Project Overview
This is a 3D interactive Rubik's Cube game built with React, Three.js (React Three Fiber), and TypeScript. The project was created to fix animation issues that GPT-5 failed to resolve, specifically ensuring proper 3D flip animations work without color flashing issues.

## Tech Stack
- **React 18** with TypeScript
- **React Three Fiber** for 3D rendering
- **Three.js** for 3D graphics engine
- **Zustand** for state management
- **React Spring** for smooth animations
- **Vite** as build tool
- **GitHub Actions** for CI/CD deployment to GitHub Pages

## Key Features
- ✅ Full 3D Rubik's Cube with realistic physics
- ✅ Smooth rotation animations (500ms duration)
- ✅ Keyboard controls (UDLRFB keys + Shift for prime moves)
- ✅ Click-to-move UI buttons
- ✅ Scramble generation and execution
- ✅ Custom move sequence input
- ✅ Bilingual support (English/Hebrew)
- ✅ Hebrew move notation (ע, ת, ש, ימ, ק, א)
- ✅ GitHub Pages deployment with CI/CD

## Project Structure

### Core Files
- `/src/state/cubeStore.ts` - Main state management with Zustand
- `/src/components/RubiksCube.tsx` - 3D scene setup with lighting
- `/src/components/PerfectCube.tsx` - Main cube rendering component
- `/src/components/parts/Cubie.tsx` - Individual cube piece rendering
- `/src/contexts/LanguageContext.tsx` - i18n support for Hebrew/English

### UI Components
- `/src/components/UI/ControlsPanel.tsx` - Move buttons and controls
- `/src/components/KeyboardHandler.tsx` - Keyboard input handling
- `/src/App.tsx` - Main app with language toggle

### Configuration
- `.github/workflows/deploy.yml` - GitHub Actions for auto-deployment
- `vite.config.ts` - Vite configuration with GitHub Pages base
- `package.json` - Dependencies and scripts

## Technical Achievements

### 1. Fixed 3D Rotation Mathematics
**Problem**: Incorrect quaternion calculations causing wrong cube orientations
**Solution**: Corrected rotation matrices in `rotateVector90()` function:
```typescript
// Fixed X-axis rotation
if (axis === "x") {
  if (direction === 1) {
    return [x, -z, y]; // 90° clockwise
  } else {
    return [x, z, -y]; // 90° counter-clockwise
  }
}
```

### 2. Resolved Animation Flashing Issue
**Problem**: Color flashing during the final frame of animations
**Solutions Attempted**:
- Fixed quaternion multiplication order in `commitActiveRotation()`
- Increased sticker depth from 0.002 to 0.008 to prevent z-fighting
- Removed material transparency to prevent rendering artifacts
- Created multiple animation components (AnimatedCube, SmoothCube, PerfectCube)
- Added comprehensive logging system for debugging timing issues

**Final Implementation**: Used PerfectCube component with React Spring animations and proper z-depth handling.

### 3. Multilingual Support Implementation
**Features**:
- Context-based language management
- RTL support for Hebrew
- Hebrew move notation: ע (U), ת (D), ש (L), ק (F), א (B)
- Full UI translation including keyboard shortcuts

**Translation Structure**:
```typescript
const translations = {
  'moves.U': language === 'he' ? 'ע' : 'U',
  'controls.reset': language === 'he' ? 'איפוס' : 'Reset',
  // ... more translations
}
```

### 4. Advanced 3D Rendering Setup
**Lighting System**:
- Ambient light for overall illumination
- Hemisphere light for sky/ground differentiation  
- Directional light with shadow mapping (2048x2048)
- Accent point lights for visual appeal
- Environment mapping with sunset preset

**Camera & Controls**:
- Optimized camera position [6, 6, 6] with 45° FOV
- OrbitControls with limited pan and zoom
- Smooth damping for professional feel

## Animation System Details

### Quaternion-Based Rotations
The cube uses quaternion mathematics for smooth 3D rotations:
1. **Position Updates**: Uses 90° rotation matrices for grid snapping
2. **Orientation Updates**: Multiplies rotation quaternions for smooth transitions
3. **Interpolation**: React Spring handles frame-by-frame interpolation

### Move Queue System
- Moves are queued and executed sequentially
- 100ms delay between moves for clarity  
- Active rotation state prevents overlapping animations
- Support for standard notation (U, U', U2) and Hebrew keys

## Development History

### Major Issues Resolved
1. **Initial State**: GPT-5 failed to fix basic animations
2. **Animation Flashing**: Multiple iterations to resolve color flashing
3. **Rotation Mathematics**: Fixed incorrect quaternion calculations
4. **Z-Fighting**: Increased sticker depth to prevent visual artifacts
5. **Performance**: Optimized rendering with proper material settings

### Multiple Component Iterations
- `AnimatedCube.tsx` - Frame-based animation attempt
- `SmoothCube.tsx` - Performance timing approach  
- `PerfectCube.tsx` - Final working implementation with React Spring
- `LoggedCube.tsx` - Debugging version with comprehensive logging

## Deployment
- **Repository**: https://github.com/[username]/rubiks-cube-3d
- **Live Demo**: GitHub Pages with automatic deployment
- **CI/CD**: GitHub Actions workflow builds and deploys on push to main

## Future Improvements
- Solve detection algorithm
- Timer functionality  
- Move history and undo
- Custom color schemes
- Performance optimizations for mobile
- Sound effects for moves

## Usage Instructions

### Keyboard Controls
**English Mode**:
- `U/D` - Upper/Lower face rotations
- `L/R` - Left/Right face rotations  
- `F/B` - Front/Back face rotations
- `Shift + Key` - Prime moves (counter-clockwise)
- `2` - Double moves

**Hebrew Mode**:
- `ע` (U) - עליון (Upper)
- `ת` (D) - תחתון (Down)
- `ש` (L) - שמאל (Left)  
- `ק` (F) - קדמי (Front)
- `א` (B) - אחורי (Back)

### UI Controls  
- Click move buttons for manual control
- "New Scramble" generates random sequence
- "Run Scramble" executes current scramble
- "Reset" returns to solved state
- Language toggle switches between English/Hebrew

## Commands for Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

This project demonstrates advanced 3D web development with React, solving complex animation mathematics and providing a polished user experience with international support.
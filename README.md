# 3D Rubik's Cube

A fully interactive 3D Rubik's Cube built with React, Three.js, and TypeScript. Features smooth animations, realistic rendering, and complete cube functionality.

![Rubik's Cube](https://img.shields.io/badge/React-18.0-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.179-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

## Features

- 🎮 **Full Cube Functionality**: All standard Rubik's Cube moves (U, D, L, R, F, B)
- 🎨 **Realistic 3D Rendering**: Rounded corners, glossy stickers, and proper lighting
- ⌨️ **Keyboard Controls**: Use keyboard shortcuts for quick moves
- 🖱️ **Interactive UI**: Button controls and custom move sequences
- 🔀 **Scramble & Reset**: Random scramble generation and instant reset
- 🎬 **Smooth Animations**: 500ms animations with easing for each rotation
- 📱 **Responsive Design**: Works on desktop and tablet devices

## Demo

Visit the live demo: [Coming Soon]

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rubiks-cube-3d.git

# Navigate to the project directory
cd rubiks-cube-3d

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### Keyboard Controls

- **U** - Up face clockwise
- **Shift + U** - Up face counter-clockwise
- **D** - Down face clockwise
- **Shift + D** - Down face counter-clockwise
- **L** - Left face clockwise
- **Shift + L** - Left face counter-clockwise
- **R** - Right face clockwise
- **Shift + R** - Right face counter-clockwise
- **F** - Front face clockwise
- **Shift + F** - Front face counter-clockwise
- **B** - Back face clockwise
- **Shift + B** - Back face counter-clockwise

### Mouse Controls

- **Left Click + Drag** - Rotate camera view
- **Scroll** - Zoom in/out
- **Button Panel** - Click any move button to execute

### Custom Sequences

Enter a sequence of moves in the input field (e.g., "R U R' U'") and click "Run" to execute.

## Technologies Used

- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Spring** - Animation library
- **Zustand** - State management
- **TypeScript** - Type safety
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   ├── AnimatedCube.tsx    # Main cube animation logic
│   ├── RubiksCube.tsx       # 3D scene setup
│   ├── KeyboardHandler.tsx  # Keyboard input handling
│   ├── UI/
│   │   └── ControlsPanel.tsx # UI controls
│   └── parts/
│       └── Cubie.tsx        # Individual cube piece
├── state/
│   └── cubeStore.ts         # Zustand store for cube state
└── main.tsx                 # App entry point
```

## Features in Detail

### Smooth 3D Animations
Each layer rotation is animated over 500ms with cubic easing for natural movement.

### Realistic Rendering
- Rounded corners on cubies
- Physical materials with clearcoat for glossy stickers
- Multiple light sources for depth
- Soft shadows

### State Management
Uses Zustand for efficient state management with:
- Cube position tracking
- Move queue system
- Animation state handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with React Three Fiber ecosystem
- Inspired by the classic Rubik's Cube puzzle
- Thanks to the Three.js community for excellent documentation

## Author

Created with ❤️ by [Your Name]
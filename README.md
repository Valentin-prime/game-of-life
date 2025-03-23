# Conway's Game of Life

A web-based implementation of Conway's Game of Life using HTML5 Canvas, CSS, and JavaScript. This implementation features a responsive, full-viewport display with interactive controls and a modern user interface.

## Features

- Full viewport canvas that automatically adjusts to window size
- Interactive cell toggling with click and drag functionality
- Adjustable simulation speed (1-60 FPS)
- Adjustable cell size (5-30 pixels)
- Wraparound edges (cells at the edges connect to the opposite side)
- Control panel with:
  - Start/Stop simulation
  - Clear grid
  - Generate random pattern
  - Speed control
  - Cell size control

## How to Use

1. Open `index.html` in a web browser
2. Click or click-and-drag on the grid to toggle cells between alive (gray) and dead (black)
3. Use the control panel at the bottom to:
   - Click "Start" to begin the simulation
   - Click "Stop" to pause the simulation
   - Click "Clear" to reset the grid
   - Click "Random" to generate a random pattern
   - Adjust the speed slider to control simulation speed
   - Adjust the cell size slider to change the grid resolution

## Game Rules

The simulation follows Conway's Game of Life rules:

1. Any live cell with 2 or 3 live neighbors survives
2. Any dead cell with exactly 3 live neighbors becomes alive
3. All other cells die or stay dead

## Technical Details

- Uses HTML5 Canvas for rendering
- Responsive design that adapts to window size
- Efficient grid implementation with wraparound edges
- Smooth animation using requestAnimationFrame
- Modern UI with semi-transparent control panel

## Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styles for the interface
- `script.js` - JavaScript implementation of the Game of Life

## Browser Compatibility

This implementation works in all modern browsers that support HTML5 Canvas and ES6+ JavaScript features. 
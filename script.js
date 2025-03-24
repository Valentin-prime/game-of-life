class GameOfLife {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 10;
        this.cells = [];
        this.isRunning = false;
        this.speed = 10;
        this.animationId = null;
        this.lastUpdate = 0;
        this.lastCell = null;

        this.resizeCanvas();
        this.initializeGrid();
        this.addEventListeners();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
    }

    initializeGrid() {
        this.cells = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initializeGrid();
        });

        let isMouseDown = false;
        this.lastCell = null;

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isMouseDown = true;
            this.handlePointerEvent(e);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            if (isMouseDown) {
                this.handlePointerEvent(e);
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            isMouseDown = false;
            this.lastCell = null;
        });

        this.canvas.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            isMouseDown = false;
            this.lastCell = null;
        });

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isMouseDown = true;
            const touch = e.touches[0];
            this.handlePointerEvent(touch);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isMouseDown) {
                const touch = e.touches[0];
                this.handlePointerEvent(touch);
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            isMouseDown = false;
            this.lastCell = null;
        });

        this.canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            isMouseDown = false;
            this.lastCell = null;
        });
    }

    handlePointerEvent(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        // Create a cell identifier
        const cellId = `${row},${col}`;

        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols && cellId !== this.lastCell) {
            this.cells[row][col] = this.cells[row][col] ? 0 : 1;
            this.lastCell = cellId;
            this.draw();
        }
    }

    randomize() {
        this.cells = this.cells.map(row => 
            row.map(() => Math.random() > 0.85 ? 1 : 0)
        );
        this.draw();
    }

    clear() {
        this.cells = this.cells.map(row => row.map(() => 0));
        this.draw();
    }

    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = (row + i + this.rows) % this.rows;
                const newCol = (col + j + this.cols) % this.cols;
                count += this.cells[newRow][newCol];
            }
        }
        return count;
    }

    update() {
        const newCells = this.cells.map(arr => [...arr]);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbors = this.countNeighbors(row, col);
                if (this.cells[row][col]) {
                    newCells[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
                } else {
                    newCells[row][col] = neighbors === 3 ? 1 : 0;
                }
            }
        }

        this.cells = newCells;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#666';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.cells[row][col]) {
                    this.ctx.fillRect(
                        col * this.cellSize,
                        row * this.cellSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
    }

    animate(timestamp) {
        if (!this.isRunning) return;

        const elapsed = timestamp - this.lastUpdate;
        if (elapsed > 1000 / this.speed) {
            this.update();
            this.draw();
            this.lastUpdate = timestamp;
        }

        this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate(performance.now());
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    setSpeed(fps) {
        this.speed = fps;
    }

    setCellSize(size) {
        this.cellSize = size;
        this.resizeCanvas();
        this.initializeGrid();
        this.stop();
        this.draw();
    }
}

// Initialize the game
const canvas = document.getElementById('gameCanvas');
const game = new GameOfLife(canvas);

// Control elements
const startStopBtn = document.getElementById('startStop');
const clearBtn = document.getElementById('clear');
const randomBtn = document.getElementById('random');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const cellSizeSlider = document.getElementById('cellSize');
const cellSizeValue = document.getElementById('cellSizeValue');
const toggleControlsBtn = document.getElementById('toggleControls');
const controlsPanel = document.querySelector('.controls-panel');

// Toggle controls visibility
let isPanelVisible = true;

toggleControlsBtn.addEventListener('click', () => {
    isPanelVisible = !isPanelVisible;
    controlsPanel.classList.toggle('hidden');
    toggleControlsBtn.classList.toggle('panel-hidden');
});

// Event listeners for controls
startStopBtn.addEventListener('click', () => {
    if (game.isRunning) {
        game.stop();
        startStopBtn.textContent = 'Start';
    } else {
        game.start();
        startStopBtn.textContent = 'Stop';
    }
});

clearBtn.addEventListener('click', () => {
    game.stop();
    startStopBtn.textContent = 'Start';
    game.clear();
});

randomBtn.addEventListener('click', () => {
    game.randomize();
});

speedSlider.addEventListener('input', (e) => {
    const speed = parseInt(e.target.value);
    game.setSpeed(speed);
    speedValue.textContent = `${speed} FPS`;
});

cellSizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    game.setCellSize(size);
    startStopBtn.textContent = 'Start';
    cellSizeValue.textContent = `${size}px`;
});

// Initial draw
game.draw(); 
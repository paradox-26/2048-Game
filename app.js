document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("game-board");
    const cells = [];

    // Initialize the board
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cells.push(cell);
            board.appendChild(cell);
        }
    }

    // Initialize the game
    let gameBoard = Array(16).fill(0);
    placeRandomTile();
    placeRandomTile();
    updateBoard();

    // Handle keyboard input
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp") {
            if (moveUp()) {
                placeRandomTile();
                updateBoard();
            }
        } else if (event.key === "ArrowDown") {
            if (moveDown()) {
                placeRandomTile();
                updateBoard();
            }
        } else if (event.key === "ArrowLeft") {
            if (moveLeft()) {
                placeRandomTile();
                updateBoard();
            }
        } else if (event.key === "ArrowRight") {
            if (moveRight()) {
                placeRandomTile();
                updateBoard();
            }
        }
    });

    // Function to place a random tile (2 or 4)
    function placeRandomTile() {
        const emptyCells = gameBoard.map((cell, index) => cell === 0 ? index : null).filter(index => index !== null);
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const value = Math.random() < 0.9 ? 2 : 4;
            gameBoard[emptyCells[randomIndex]] = value;
        }
    }

    // Function to update the game board
    function updateBoard() {
        cells.forEach((cell, index) => {
            cell.textContent = gameBoard[index] !== 0 ? gameBoard[index] : "";
            cell.style.backgroundColor = getTileColor(gameBoard[index]);
        });
    }

    // Function to get the background color for a tile
    function getTileColor(value) {
        const colors = {
            2: "#eee4da",
            4: "#ede0c8",
            8: "#f2b179",
            16: "#f59563",
            32: "#f67c5f",
            64: "#f65e3b",
            128: "#edcf72",
            256: "#edcc61",
            512: "#edc850",
            1024: "#edc53f",
            2048: "#edc22e",
        };
        return colors[value] || "#ccc";
    }

    // Helper function to move and merge tiles in a single row/column
    function slideAndMerge(line) {
        let result = line.filter(val => val !== 0);  // Remove all zeros
        for (let i = 0; i < result.length - 1; i++) {
            if (result[i] === result[i + 1]) {
                result[i] *= 2;
                result[i + 1] = 0;
            }
        }
        result = result.filter(val => val !== 0);  // Remove zeros after merging
        while (result.length < 4) result.push(0);  // Fill the rest with zeros
        return result;
    }

    // Movement functions
    function moveUp() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            let line = [gameBoard[col], gameBoard[col + 4], gameBoard[col + 8], gameBoard[col + 12]];
            let merged = slideAndMerge(line);
            for (let row = 0; row < 4; row++) {
                if (gameBoard[col + row * 4] !== merged[row]) {
                    gameBoard[col + row * 4] = merged[row];
                    moved = true;
                }
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            let line = [gameBoard[col + 12], gameBoard[col + 8], gameBoard[col + 4], gameBoard[col]];
            let merged = slideAndMerge(line);
            merged.reverse();
            for (let row = 0; row < 4; row++) {
                if (gameBoard[col + row * 4] !== merged[row]) {
                    gameBoard[col + row * 4] = merged[row];
                    moved = true;
                }
            }
        }
        return moved;
    }

    function moveLeft() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            let line = gameBoard.slice(row * 4, row * 4 + 4);
            let merged = slideAndMerge(line);
            for (let col = 0; col < 4; col++) {
                if (gameBoard[row * 4 + col] !== merged[col]) {
                    gameBoard[row * 4 + col] = merged[col];
                    moved = true;
                }
            }
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            let line = gameBoard.slice(row * 4, row * 4 + 4).reverse();
            let merged = slideAndMerge(line);
            merged.reverse();
            for (let col = 0; col < 4; col++) {
                if (gameBoard[row * 4 + col] !== merged[col]) {
                    gameBoard[row * 4 + col] = merged[col];
                    moved = true;
                }
            }
        }
        return moved;
    }
});

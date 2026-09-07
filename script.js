const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const restart = document.getElementById("restart");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const computerBtn = document.getElementById("computerBtn");

let currentPlayer = "X";
let gameActive = false;
let gameMode = "";

let board = ["", "", "", "", "", "", "", "",];

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame(mode) {
    gameMode = mode;
    currentPlayer = "X";
    gameActive = true;

    board = ["", "", "", "", "", "", "", "","",];

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });

    if (gameMode === "computer") {
        status.textContent = "Your turn — You are X";
    } else {
        status.textContent = "Player X's turn";
    }
}

function playMove(index) {
    if (!gameActive || board[index] !== "") {
        return;
    }

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;

    checkWinner();

    if (
        gameActive &&
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {
        setTimeout(computerMove, 500);
    }
}

function checkWinner() {
    for (let pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            if (gameMode === "computer") {
                status.textContent =
                    currentPlayer === "X"
                    ? "🎉 You Win!"
                    : "🤖 Computer Wins!";
            } else {
                status.textContent =
                    `🎉 Player ${currentPlayer} Wins!`;
            }

            gameActive = false;
            return;
        }
    }

    if (!board.includes("")) {
        status.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (gameMode === "computer") {
        status.textContent =
            currentPlayer === "X"
            ? "Your turn — You are X"
            : "Computer's turn...";
    } else {
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function computerMove() {

    if (!gameActive) {
        return;
    }

    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[randomIndex] = "O";
    cells[randomIndex].textContent = "O";

    checkWinner();
}

function restartGame() {
    if (gameMode === "") {
        status.textContent = "Choose a game mode first";
        return;
    }

    startGame(gameMode);
}

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {

        if (gameMode === "computer" && currentPlayer === "O") {
            return;
        }

        playMove(index);
    });
});

twoPlayerBtn.addEventListener("click", () => {
    startGame("twoPlayer");
});

computerBtn.addEventListener("click", () => {
    startGame("computer");
});

restart.addEventListener("click", restartGame);
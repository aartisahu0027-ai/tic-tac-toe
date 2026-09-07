/* =========================
   DOM ELEMENTS
========================= */

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const computerBtn = document.getElementById("computerBtn");

const setupArea = document.getElementById("setupArea");

const playerNameInput = document.getElementById("playerName");
const player2NameInput = document.getElementById("player2Name");

const difficultyBox = document.getElementById("difficultyBox");
const difficultyButtons = document.querySelectorAll(".difficulty");

const startGameBtn = document.getElementById("startGameBtn");

const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const xName = document.getElementById("xName");
const oName = document.getElementById("oName");

const xScore = document.getElementById("xScore");
const oScore = document.getElementById("oScore");
const drawScore = document.getElementById("drawScore");

const playAgainBtn = document.getElementById("playAgain");
const resetScoreBtn = document.getElementById("resetScore");

const backBtn = document.getElementById("backBtn");

const themeBtn = document.getElementById("themeBtn");

const howToBtn = document.getElementById("howToBtn");
const howToModal = document.getElementById("howToModal");
const closeModal = document.getElementById("closeModal");
const modalOk = document.getElementById("modalOk");


/* =========================
   WINNER POPUP
========================= */

const winnerModal = document.getElementById("winnerModal");
const winnerTitle = document.getElementById("winnerTitle");
const winnerName = document.getElementById("winnerName");
const winnerMessage = document.getElementById("winnerMessage");

const winnerPlayAgain = document.getElementById("winnerPlayAgain");
const winnerBack = document.getElementById("winnerBack");


/* =========================
   GAME VARIABLES
========================= */

let board = ["", "", "", "", "", "", "", "",];

let currentPlayer = "X";

let gameMode = null;

let difficulty = "hard";

let gameActive = false;

let player1 = "Player 1";
let player2 = "Player 2";

let computerName = "Computer";


/* =========================
   SCORE
========================= */

let scores = {
    X: 0,
    O: 0,
    draws: 0
};


/* =========================
   WINNING PATTERNS
========================= */

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


/* =========================
   LOAD SCORES
========================= */

const savedScores = localStorage.getItem("ticTacToeScores");

if (savedScores) {

    scores = JSON.parse(savedScores);

}

updateScoreboard();


/* =========================
   SOUND
========================= */

let audioContext = null;

function beep(
    frequency = 500,
    duration = 100,
    type = "sine"
) {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        if (audioContext.state === "suspended") {

            audioContext.resume();

        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(
            0.08,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration / 1000
        );

        oscillator.connect(gain);

        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime +
            duration / 1000
        );

    } catch (error) {

        // Sound is optional.
    }
}


/* =========================
   SAVE SCORE
========================= */

function saveScores() {

    localStorage.setItem(
        "ticTacToeScores",
        JSON.stringify(scores)
    );

}


/* =========================
   UPDATE SCOREBOARD
========================= */

function updateScoreboard() {

    xScore.textContent = scores.X;

    oScore.textContent = scores.O;

    drawScore.textContent = scores.draws;

}


/* =========================
   MODE SELECTION
========================= */

twoPlayerBtn.addEventListener(
    "click",
    function () {

        gameMode = "twoPlayer";

        twoPlayerBtn.classList.add("selected");

        computerBtn.classList.remove("selected");

        setupArea.classList.remove("hidden");

        player2NameInput.classList.remove("hidden");

        difficultyBox.classList.add("hidden");

        playerNameInput.placeholder =
            "Player 1 name";

        beep(600, 100);

        setTimeout(function () {

            playerNameInput.focus();

        }, 100);

    }
);


computerBtn.addEventListener(
    "click",
    function () {

        gameMode = "computer";

        computerBtn.classList.add("selected");

        twoPlayerBtn.classList.remove("selected");

        setupArea.classList.remove("hidden");

        player2NameInput.classList.add("hidden");

        difficultyBox.classList.remove("hidden");

        playerNameInput.placeholder =
            "Your name";

        beep(700, 100);

        setTimeout(function () {

            playerNameInput.focus();

        }, 100);

    }
);


/* =========================
   DIFFICULTY
========================= */

difficultyButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            difficulty =
                button.dataset.level;

            difficultyButtons.forEach(
                function (btn) {

                    btn.classList.remove(
                        "selected"
                    );

                }
            );

            button.classList.add("selected");

            beep(800, 80);

        }
    );

});


/* =========================
   START GAME
========================= */

startGameBtn.addEventListener(
    "click",
    function () {

        if (!gameMode) {

            alert(
                "Please choose how you want to play."
            );

            return;

        }


        player1 =
            playerNameInput.value.trim();


        if (!player1) {

            alert(
                "Please enter your name."
            );

            playerNameInput.focus();

            return;

        }


        if (gameMode === "twoPlayer") {

            player2 =
                player2NameInput.value.trim();


            if (!player2) {

                alert(
                    "Please enter Player 2's name."
                );

                player2NameInput.focus();

                return;

            }

        }


        startGame();

        beep(900, 120);

    }
);


/* =========================
   START / RESET BOARD
========================= */

function startGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;


    cells.forEach(function (cell) {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });


    if (gameMode === "twoPlayer") {

        xName.textContent =
            player1 + " (X)";

        oName.textContent =
            player2 + " (O)";

        statusText.textContent =
            player1 + "'s turn";

    } else {

        xName.textContent =
            player1 + " (X)";

        oName.textContent =
            "Computer (O)";

        statusText.textContent =
            player1 + "'s turn";

    }


    updateScoreboard();


    startScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

}


/* =========================
   CELL CLICK
========================= */

cells.forEach(function (cell, index) {

    cell.addEventListener(
        "click",
        function () {

            if (!gameActive) {

                return;

            }


            if (board[index] !== "") {

                return;

            }


            if (
                gameMode === "computer" &&
                currentPlayer === "O"
            ) {

                return;

            }


            makeMove(index, currentPlayer);

        }
    );

});


/* =========================
   MAKE MOVE
========================= */

function makeMove(index, player) {

    if (!gameActive) {

        return;

    }


    if (board[index] !== "") {

        return;

    }


    board[index] = player;


    cells[index].textContent = player;


    if (player === "X") {

        cells[index].classList.add("x");

        beep(600, 100);

    } else {

        cells[index].classList.add("o");

        beep(400, 100);

    }


    const result = checkWinner();


    if (result) {

        handleGameEnd(result);

        return;

    }


    currentPlayer =
        player === "X" ? "O" : "X";


    updateStatus();


    /* COMPUTER TURN */

    if (
        gameMode === "computer" &&
        currentPlayer === "O" &&
        gameActive
    ) {

        setTimeout(
            computerMove,
            500
        );

    }

}


/* =========================
   STATUS
========================= */

function updateStatus() {

    if (!gameActive) {

        return;

    }


    if (gameMode === "computer") {

        if (currentPlayer === "X") {

            statusText.textContent =
                player1 + "'s turn";

        } else {

            statusText.textContent =
                "Computer's turn";

        }

    } else {

        if (currentPlayer === "X") {

            statusText.textContent =
                player1 + "'s turn";

        } else {

            statusText.textContent =
                player2 + "'s turn";

        }

    }

}


/* =========================
   CHECK WINNER
========================= */

function checkWinner() {

    for (
        let i = 0;
        i < winningPatterns.length;
        i++
    ) {

        const pattern =
            winningPatterns[i];

        const a = board[pattern[0]];
        const b = board[pattern[1]];
        const c = board[pattern[2]];


        if (
            a &&
            a === b &&
            b === c
        ) {

            return {
                winner: a,
                pattern: pattern
            };

        }

    }


    if (
        board.every(
            function (cell) {
                return cell !== "";
            }
        )
    ) {

        return {
            winner: "draw",
            pattern: []
        };

    }


    return null;

}


/* =========================
   HANDLE GAME END
========================= */

function handleGameEnd(result) {

    gameActive = false;


    if (result.winner === "draw") {

        scores.draws++;

        saveScores();

        updateScoreboard();

        beep(300, 250, "triangle");

        showWinnerPopup("draw");

        return;

    }


    /* HIGHLIGHT WINNING CELLS */

    result.pattern.forEach(
        function (index) {

            cells[index].classList.add(
                "winner"
            );

        }
    );


    /* UPDATE SCORE */

    scores[result.winner]++;

    saveScores();

    updateScoreboard();


    beep(900, 150);

    setTimeout(
        function () {

            beep(1100, 200);

        },
        150
    );


    showWinnerPopup(
        result.winner
    );

}


/* =========================
   GET PLAYER NAME
========================= */

function getPlayerName(player) {

    if (gameMode === "computer") {

        if (player === "X") {

            return player1;

        }

        return "Computer";

    }


    if (player === "X") {

        return player1;

    }

    return player2;

}


/* =========================
   WINNER POPUP
========================= */

function showWinnerPopup(winner) {

    if (winner === "draw") {

        winnerTitle.textContent =
            "It's a Draw!";

        winnerName.textContent =
            "No Winner";

        winnerMessage.textContent =
            "Both players played well!";

        winnerName.style.background =
            "#e0e0e0";

    } else {

        const name =
            getPlayerName(winner);

        winnerTitle.textContent =
            "🏆 Winner!";

        winnerName.textContent =
            name;

        winnerMessage.textContent =
            "Congratulations! You won!";

        winnerName.style.background =
            winner === "X"
                ? "#ffb3b3"
                : "#a9d9ff";

    }


    winnerModal.classList.remove(
        "hidden"
    );

}


/* =========================
   CLOSE WINNER POPUP
========================= */

function closeWinnerPopup() {

    winnerModal.classList.add(
        "hidden"
    );

}


/* =========================
   PLAY AGAIN FROM POPUP
========================= */

winnerPlayAgain.addEventListener(
    "click",
    function () {

        closeWinnerPopup();

        startGame();

        beep(800, 100);

    }
);


/* =========================
   BACK TO HOME FROM POPUP
========================= */

winnerBack.addEventListener(
    "click",
    function () {

        closeWinnerPopup();

        goBackHome();

        beep(500, 100);

    }
);


/* =========================
   PLAY AGAIN BUTTON
========================= */

playAgainBtn.addEventListener(
    "click",
    function () {

        startGame();

        beep(800, 100);

    }
);


/* =========================
   RESET SCORE
========================= */

resetScoreBtn.addEventListener(
    "click",
    function () {

        const confirmReset =
            confirm(
                "Are you sure you want to reset the scores?"
            );


        if (!confirmReset) {

            return;

        }


        scores = {
            X: 0,
            O: 0,
            draws: 0
        };


        saveScores();

        updateScoreboard();

        beep(300, 120);

    }
);


/* =========================
   BACK BUTTON
========================= */

backBtn.addEventListener(
    "click",
    function () {

        goBackHome();

    }
);


/* =========================
   GO BACK HOME
========================= */

function goBackHome() {

    gameActive = false;

    gameScreen.classList.add("hidden");

    startScreen.classList.remove(
        "hidden"
    );


    /*
       Reset mode selection so
       user chooses again.
    */

    gameMode = null;

    twoPlayerBtn.classList.remove(
        "selected"
    );

    computerBtn.classList.remove(
        "selected"
    );

    setupArea.classList.add(
        "hidden"
    );

}


/* =========================
   COMPUTER MOVE
========================= */

function computerMove() {

    if (!gameActive) {

        return;

    }


    if (
        gameMode !== "computer" ||
        currentPlayer !== "O"
    ) {

        return;

    }


    let move;


    if (difficulty === "easy") {

        move = easyMove();

    }

    else if (difficulty === "medium") {

        move = mediumMove();

    }

    else {

        move = hardMove();

    }


    if (move !== null) {

        makeMove(move, "O");

    }

}


/* =========================
   EASY AI
========================= */

function easyMove() {

    const emptyCells =
        getEmptyCells();


    if (emptyCells.length === 0) {

        return null;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            emptyCells.length
        );


    return emptyCells[randomIndex];

}


/* =========================
   MEDIUM AI
========================= */

function mediumMove() {

    /* Try to win */

    const winningMove =
        findWinningMove("O");


    if (winningMove !== null) {

        return winningMove;

    }


    /* Block player */

    const blockingMove =
        findWinningMove("X");


    if (blockingMove !== null) {

        return blockingMove;

    }


    /* Take center */

    if (board[4] === "") {

        return 4;

    }


    /* Random move */

    return easyMove();

}


/* =========================
   FIND WINNING MOVE
========================= */

function findWinningMove(player) {

    const emptyCells =
        getEmptyCells();


    for (
        let i = 0;
        i < emptyCells.length;
        i++
    ) {

        const index =
            emptyCells[i];


        board[index] = player;


        const result =
            checkWinnerForBoard(board);


        board[index] = "";


        if (
            result &&
            result.winner === player
        ) {

            return index;

        }

    }


    return null;

}


/* =========================
   HARD AI
========================= */

function hardMove() {

    let bestScore = -Infinity;

    let bestMove = null;


    const emptyCells =
        getEmptyCells();


    for (
        let i = 0;
        i < emptyCells.length;
        i++
    ) {

        const index =
            emptyCells[i];


        board[index] = "O";


        const score =
            minimax(
                board,
                0,
                false
            );


        board[index] = "";


        if (score > bestScore) {

            bestScore = score;

            bestMove = index;

        }

    }


    return bestMove;

}


/* =========================
   MINIMAX
========================= */

function minimax(
    position,
    depth,
    isMaximizing
) {

    const result =
        checkWinnerForBoard(position);


    if (result) {

        if (result.winner === "O") {

            return 10 - depth;

        }


        if (result.winner === "X") {

            return depth - 10;

        }


        return 0;

    }


    if (isMaximizing) {

        let bestScore = -Infinity;


        const emptyCells =
            getEmptyCellsFromBoard(
                position
            );


        for (
            let i = 0;
            i < emptyCells.length;
            i++
        ) {

            const index =
                emptyCells[i];


            position[index] = "O";


            const score =
                minimax(
                    position,
                    depth + 1,
                    false
                );


            position[index] = "";


            bestScore =
                Math.max(
                    bestScore,
                    score
                );

        }


        return bestScore;

    }


    else {

        let bestScore = Infinity;


        const emptyCells =
            getEmptyCellsFromBoard(
                position
            );


        for (
            let i = 0;
            i < emptyCells.length;
            i++
        ) {

            const index =
                emptyCells[i];


            position[index] = "X";


            const score =
                minimax(
                    position,
                    depth + 1,
                    true
                );


            position[index] = "";


            bestScore =
                Math.min(
                    bestScore,
                    score
                );

        }


        return bestScore;

    }

}


/* =========================
   CHECK WINNER FOR ANY BOARD
========================= */

function checkWinnerForBoard(position) {

    for (
        let i = 0;
        i < winningPatterns.length;
        i++
    ) {

        const pattern =
            winningPatterns[i];


        const a =
            position[pattern[0]];

        const b =
            position[pattern[1]];

        const c =
            position[pattern[2]];


        if (
            a &&
            a === b &&
            b === c
        ) {

            return {
                winner: a,
                pattern: pattern
            };

        }

    }


    if (
        position.every(
            function (cell) {

                return cell !== "";

            }
        )
    ) {

        return {
            winner: "draw",
            pattern: []
        };

    }


    return null;

}


/* =========================
   EMPTY CELLS
========================= */

function getEmptyCells() {

    return getEmptyCellsFromBoard(
        board
    );

}


function getEmptyCellsFromBoard(
    position
) {

    const empty = [];


    for (
        let i = 0;
        i < position.length;
        i++
    ) {

        if (position[i] === "") {

            empty.push(i);

        }

    }


    return empty;

}


/* =========================
   HOW TO PLAY
========================= */

howToBtn.addEventListener(
    "click",
    function () {

        howToModal.classList.remove(
            "hidden"
        );

        beep(500, 80);

    }
);


closeModal.addEventListener(
    "click",
    function () {

        howToModal.classList.add(
            "hidden"
        );

    }
);


modalOk.addEventListener(
    "click",
    function () {

        howToModal.classList.add(
            "hidden"
        );

    }
);


/* =========================
   CLOSE MODAL WHEN CLICKING
   OUTSIDE
========================= */

howToModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === howToModal
        ) {

            howToModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================
   DARK / LIGHT MODE
========================= */

const savedTheme =
    localStorage.getItem(
        "ticTacToeTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent = "☀️";

}


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        if (isDark) {

            themeBtn.textContent =
                "☀️";

            localStorage.setItem(
                "ticTacToeTheme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙";

            localStorage.setItem(
                "ticTacToeTheme",
                "light"
            );

        }


        beep(700, 80);

    }
);
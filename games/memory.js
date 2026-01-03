const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restart");

const emojis = ["🍎","🍌","🍇","🍒","🍓","🥝","🍍","🍉"];
let cards = [...emojis, ...emojis];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

let bestScore = Number(localStorage.getItem("memoryBestScore")) || null;
let lastScore = Number(localStorage.getItem("memoryLastScore")) || null;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    board.innerHTML = "";
    shuffle(cards);

    cards.forEach(emoji => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.emoji = emoji;
        card.textContent = "";

        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });

    moves = 0;
}

function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");
    card.textContent = card.dataset.emoji;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;
    moves++,
    updateScoreUI();

    checkMatch();
}

function checkMatch() {
    const isMatch = 
        firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        const matchedCards = document.querySelectorAll(".card.matched");
        if (matchedCards.length === cards.length) {
            handleWin();
        }

        resetTurn();
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = "";
            secondCard.textContent = "";
            resetTurn();
        }, 700);
    }
}

function handleWin() {
    lastScore = moves;
    localStorage.setItem("memoryLastScore", lastScore);

    if (bestScore === null || moves < bestScore) {
        bestScore = moves;
        localStorage.setItem("memoryBestScore", bestScore);
    }

    updateScoreUI();
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function updateScoreUI() {
    movesEl.textContent = moves;

  document.getElementById("currentMoves").textContent = moves;
  document.getElementById("lastMoves").textContent =
    lastScore !== null ? lastScore : "--";
  document.getElementById("bestMoves").textContent =
    bestScore !== null ? bestScore : "--";
}

restartBtn.addEventListener("click", () => {
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    movesEl.textContent = moves;

    createBoard();
});

createBoard();
updateScoreUI();

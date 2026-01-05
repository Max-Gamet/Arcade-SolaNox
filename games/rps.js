const buttons = document.querySelectorAll("#choices button");
const resultEl = document.getElementById("result");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");
const emojiMap = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
};
const playerMatchWinsEl = document.getElementById("playerMatchWins");
const aiMatchWinsEl = document.getElementById("aiMatchWins");
const matchScoreBoard = document.getElementById("matchScoreBoard");
const aiChoiceEl = document.getElementById("aiChoice");
const loadingEmojis = ["🤜", "🤛"]
let loadingInterval = null;

let playerScore = Number(localStorage.getItem("rpsPlayerWins")) || 0;
let aiScore = Number(localStorage.getItem("rpsAIWins")) || 0;

const matchWins = {
    "3": {
        player: Number(localStorage.getItem("rps3PlayerWins")) || 0,
        ai: Number(localStorage.getItem("rps3AIWins")) || 0
    },
    "5": {
        player: Number(localStorage.getItem("rps5PlayerWins")) || 0,
        ai: Number(localStorage.getItem("rps5AIWins")) || 0
    }
};

let gameMode = "free";  // Always start with free mode
let maxWins = Infinity;  // Since it's free
let gameOver = false;

aiChoiceEl.textContent = "AI chose: ?";

const choices = ["rock", "paper", "scissors"];

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (gameOver) return;
        const playerChoice = btn.dataset.choice;

        aiChoiceEl.classList.add("ai-thinking");
        aiChoiceEl.textContent = "🤜 🤛";

        setTimeout(() => {
            const aiChoice = choices[Math.floor(Math.random() * 3)];

            aiChoiceEl.classList.remove("ai-thinking");

            playRound(playerChoice, aiChoice);
        }, 2000);
    });
});

document.querySelectorAll("#gameModes button").forEach(btn => {
    btn.addEventListener("click", () => {
        gameMode = btn.dataset.mode;
        localStorage.setItem("rpsGameMode", gameMode);

        maxWins = 
            gameMode === "3" ? 2 :
            gameMode === "5" ? 3 :
            Infinity;


        resetMatch();
        updateMatchBoardVisibility();
    })
})

function resetMatch() {
    playerScore = 0;
    aiScore = 0;
    gameOver = false;

    localStorage.setItem("rpsPlayerWins", 0);
    localStorage.setItem("rpsAIWins", 0);

    playerScoreEl.textContent = 0;
    aiScoreEl.textContent = 0;
    aiChoiceEl.textContent = "Ai choice: ?";
    resultEl.textContent = 
        gameMode === "free"
            ? "Free Play Mode"
            : `Best of ${gameMode}`;

}

function resetRoundScore() {
    playerScore = 0;
    aiScore = 0;

    localStorage.setItem("rpsPlayerWins", 0);
    localStorage.setItem("rpsAIWins", 0);

    playerScoreEl.textContent = 0;
    aiScoreEl.textContent = 0;
}

function launchConfetti() {
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement("div");
        conf.className = "confetti";
        conf.style.left = Math.random() * 100 + "vw";
        conf.style.background = Math.random() > 0.5 ? "cyan" : "lime";

        document.getElementById("confetti").appendChild(conf);

        setTimeout(() => conf.remove(), 2000);
    }
}

function startAiLoading(playerChoice) {
    resultEl.textContent = "";
    aiChoiceEl.textContent = "Ai is choosing..."

    let index = 0

    loadingInterval = setInterval(() => {
        aiChoiceEl.textContent = `AI chose: ${loadingEmojis[index % 2]}`;
        index++;
    }, 300);

    setTimeout(() => {
        clearInterval(loadingInterval);

        const aiChoice = choices[Math.floor(Math.random() * 3)];
        playRound(playerChoice, aiChoice);
    }, 2000);
}

function playRound(player, ai) {
    aiChoiceEl.textContent = `AI chose: ${emojiMap[ai]}`;
    
    if (player === ai) {
        resultEl.textContent = `Draw: Both chose ${player}`;
        return;
    }

    const win =
        (player === "rock" && ai === "scissors") ||
        (player === "paper" && ai === "rock") ||
        (player === "scissors" && ai === "paper");

    if (win) {
        playerScore++;
        localStorage.setItem("rpsPlayerWins", playerScore);
        updateMatchUI();
        countUp(
            playerScoreEl,
            Number(playerScoreEl.textContent),
            playerScore,
            90
        );
        resultEl.textContent = `You Win: ${player} beats ${ai}`;
    } else {
        aiScore++;
        localStorage.setItem("rpsAIWins", aiScore);
        updateMatchUI();
        countUp(
            aiScoreEl,
            Number(aiScoreEl.textContent),
            aiScore,
            90
        );
        resultEl.textContent = `You lose! ${ai} beats ${player}`;
    }

    if (gameMode !== "free") {
        if (playerScore >= maxWins) {
            matchWins[gameMode].player++;
            localStorage.setItem(
                gameMode === "3" ? "rps3PlayerWins" : "rps5PlayerWins",
                matchWins[gameMode].player
            );

            updateMatchUI();

            resultEl.textContent = "🔥 YOU WON THE MATCH!";
            launchConfetti();

            resetRoundScore();
        }

        if (aiScore >= maxWins) {
            matchWins[gameMode].ai++;
            localStorage.setItem(
                gameMode === "3" ? "rps3AIWins" : "rps5AIWins",
                matchWins[gameMode].ai
            );

            updateMatchUI();

            resultEl.textContent = "💀 AI WON THE MATCH!";
            launchConfetti();

            resetRoundScore();
        }
    }

}

function updateMatchBoardVisibility() {
    if (gameMode === "free") {
        matchScoreBoard.classList.add("hidden");
    } else {
        matchScoreBoard.classList.remove("hidden");
        updateMatchUI();
    }
}

function updateMatchUI() {
    if (gameMode === "free") return;

    countUp(
        playerMatchWinsEl,
        Number(playerMatchWinsEl.textContent) || 0,
        matchWins[gameMode].player,
        120
    );

    countUp(
        aiMatchWinsEl,
        Number(aiMatchWinsEl.textContent) || 0,
        matchWins[gameMode].ai,
        120
    );
}

function countUp(el, from, to, speed = 80) {
    if (from === to) return;

    let current = from;
    const step = from < to ? 1 : -1;

    const interval = setInterval(() => {
        current += step;
        el.textContent = current;

        if (current === to) {
            clearInterval(interval);
        }
    }, speed);
}

window.addEventListener("load", () => {
    gameMode = "free";  // Force free mode on every page load
    maxWins = Infinity;
    aiChoiceEl.textContent = "AI chose: ?";
    updateMatchBoardVisibility();
    resultEl.textContent = "Free Play Mode";  // Ensure the result shows free mode
});
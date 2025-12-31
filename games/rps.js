const buttons = document.querySelectorAll("#choices button");
const resultEl = document.getElementById("result");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");
const emojiMap = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
};
const aiChoiceEl = document.getElementById("aiChoice");

let playerScore = 0;
let aiScore = 0;

const choices = ["rock", "paper", "scissors"];

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const playerChoice = btn.dataset.choice;
        const aiChoice = choices[Math.floor(Math.random() * 3)];

        playRound(playerChoice, aiChoice);
    });
});

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
        playerScoreEl.textContent = playerScore;
        resultEl.textContent = `You win! ${player} beats ${ai}`;
    } else {
        aiScore++;
        aiScoreEl.textContent = aiScore;
        resultEl.textContent = `You lose! ${ai} beats ${player}`;
    }
}

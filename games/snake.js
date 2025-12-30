const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const startbtn = document.getElementById("startbtn");
const resetbtn = document.getElementById("resetbtn");

const GRID = 20;
const TILES = canvas.width / GRID;

let snake;
let direction;
let food;
let score;
let gameInterval;
let isRunning = false;
let canChangeDirections = true;

function initGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    food = spawnFood();
    score = 0;
    isRunning = false;
    scoreEl.textContent = "Score: 0";
    draw();
}

startbtn.addEventListener("click", () => {
    if (isRunning) return;
    direction = {x: 1, y: 0};
    isRunning = true;
    gameInterval = setInterval(gameLoop, 200);
});

resetbtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    initGame();
});

document.addEventListener("keydown", e => {
    if (!isRunning || !canChangeDirections) return;

    if (e.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -1};
        canChangeDirections = false;
    }

    if (e.key === "ArrowDown" && direction.y  === 0 ) {
        direction = { x: 0, y: 1};
        canChangeDirections = false;
    }

    if (e.key === "ArrowLeft" && direction.y === 0) {
        direction = {x: -1, y: 0};
        canChangeDirections = false;
    }

    if (e.key === "ArrowRight" && direction.y === 0) {
        direction = { x: 1, y: 0};
        canChangeDirections = false;
    }
});

function gameLoop() {
    canChangeDirections = true;
    moveSnake();
    checkCollision();
    draw();
}

function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = `Score ${score}`;
        food = spawnFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= TILES ||
    head.y >= TILES
    ) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    isRunning = false;

    const death = document.getElementById("deathScreen");
    const finalScore = document.getElementById("finalScore");

    finalScore.textContent = score;
    death.classList.remove("hidden");

    setTimeout(() => {
        death.classList.add("hidden");
        initGame();
    }, 2000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(
            part.x * GRID,
            part.y * GRID,
            GRID,
            GRID
        );
    });

    ctx.fillStyle = "red";
    ctx.fillRect(
        food.x * GRID,
        food.y * GRID,
        GRID,
        GRID
    );
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * TILES),
        y: Math.floor(Math.random() * TILES)
    };
}

initGame();
const TILE_SIZE = 24;

const MAZE_TEMPLATE = [
  "###################",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o##.###.#.###.##o#",
  "#.................#",
  "#.##.#.#####.#.##.#",
  "#....#...#...#....#",
  "####.###.#.###.####",
  "   #.#.......#.#   ",
  "####.#.## ##.#.####",
  "     .#     #.     ",
  "####.#.#####.#.####",
  "   #.#.......#.#   ",
  "####.#.#####.#.####",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o.#...#.#.#...#.o#",
  "##.#.#.#####.#.#.##",
  "#....#...#...#....#",
  "#.######.#.######.#",
  "#.................#",
  "###################",
];

const DIRECTIONS = {
  left: { x: -1, y: 0, angle: Math.PI },
  right: { x: 1, y: 0, angle: 0 },
  up: { x: 0, y: -1, angle: -Math.PI / 2 },
  down: { x: 0, y: 1, angle: Math.PI / 2 },
};

const OPPOSITE = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
};

const GHOSTS = [
  { name: "Blinky", color: "#ff4d61", home: { x: 9, y: 10 }, scatter: { x: 17, y: 1 } },
  { name: "Pinky", color: "#ff85d5", home: { x: 8, y: 10 }, scatter: { x: 1, y: 1 } },
  { name: "Inky", color: "#37d7ff", home: { x: 10, y: 10 }, scatter: { x: 17, y: 20 } },
  { name: "Clyde", color: "#ff9e35", home: { x: 9, y: 9 }, scatter: { x: 1, y: 20 } },
];

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreNode = document.querySelector("#score");
const levelNode = document.querySelector("#level");
const livesNode = document.querySelector("#lives");
const pelletsNode = document.querySelector("#pellets");
const messageNode = document.querySelector("#message");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const restartBtn = document.querySelector("#restartBtn");

const rows = MAZE_TEMPLATE.length;
const cols = MAZE_TEMPLATE[0].length;
const boardWidth = cols * TILE_SIZE;
const boardHeight = rows * TILE_SIZE;

const state = {
  mode: "ready",
  level: 1,
  score: 0,
  lives: 3,
  pellets: [],
  pelletCount: 0,
  powerTimer: 0,
  pacman: null,
  ghosts: [],
  lastTime: 0,
  pacAccumulator: 0,
  ghostAccumulator: 0,
  mouthTime: 0,
  message: "Ready",
};

function configureCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(boardWidth * scale);
  canvas.height = Math.floor(boardHeight * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function createPellets() {
  state.pellets = MAZE_TEMPLATE.map((row) => row.split(""));
  state.pelletCount = 0;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (state.pellets[y][x] === "." || state.pellets[y][x] === "o") {
        state.pelletCount += 1;
      }
    }
  }
}

function resetPositions() {
  state.pacman = {
    x: 9,
    y: 20,
    dir: "left",
    nextDir: "left",
  };

  state.ghosts = GHOSTS.map((ghost, index) => ({
    ...ghost,
    x: ghost.home.x,
    y: ghost.home.y,
    dir: ["left", "right", "up", "down"][index],
    eaten: false,
  }));

  state.powerTimer = 0;
  state.pacAccumulator = 0;
  state.ghostAccumulator = 0;
}

function resetGame() {
  state.mode = "ready";
  state.level = 1;
  state.score = 0;
  state.lives = 3;
  state.message = "Ready";
  createPellets();
  resetPositions();
  clearSpawnTiles();
  updateHud();
}

function nextLevel() {
  state.level += 1;
  state.mode = "ready";
  state.message = `Level ${state.level}`;
  createPellets();
  resetPositions();
  clearSpawnTiles();
  updateHud();
}

function setMode(mode, message) {
  state.mode = mode;
  state.message = message;
  updateHud();
}

function updateHud() {
  scoreNode.textContent = state.score.toLocaleString();
  levelNode.textContent = String(state.level);
  livesNode.textContent = String(state.lives);
  pelletsNode.textContent = String(state.pelletCount);
  messageNode.textContent = state.message;
  startBtn.textContent = state.mode === "paused" ? "Resume" : "Start";
  pauseBtn.disabled = state.mode === "lost" || state.mode === "won";
}

function normalizeX(x) {
  if (x < 0) {
    return cols - 1;
  }

  if (x >= cols) {
    return 0;
  }

  return x;
}

function tileAt(x, y) {
  if (y < 0 || y >= rows) {
    return "#";
  }

  return MAZE_TEMPLATE[y][normalizeX(x)];
}

function isWall(x, y) {
  return tileAt(x, y) === "#";
}

function canMoveFrom(entity, direction) {
  const delta = DIRECTIONS[direction];
  return !isWall(entity.x + delta.x, entity.y + delta.y);
}

function moveEntity(entity, direction) {
  const delta = DIRECTIONS[direction];
  const nextX = normalizeX(entity.x + delta.x);
  const nextY = entity.y + delta.y;

  if (isWall(nextX, nextY)) {
    return false;
  }

  entity.x = nextX;
  entity.y = nextY;
  entity.dir = direction;
  return true;
}

function clearSpawnTiles() {
  const spawnTiles = [
    state.pacman,
    ...state.ghosts.map((ghost) => ({ x: ghost.home.x, y: ghost.home.y })),
  ];

  for (const tile of spawnTiles) {
    if (state.pellets[tile.y][tile.x] === "." || state.pellets[tile.y][tile.x] === "o") {
      state.pellets[tile.y][tile.x] = " ";
      state.pelletCount -= 1;
    }
  }
}

function setPacmanDirection(direction) {
  if (!DIRECTIONS[direction]) {
    return;
  }

  state.pacman.nextDir = direction;

  if (state.mode === "ready") {
    setMode("playing", "Go");
  }
}

function eatCurrentTile() {
  const { x, y } = state.pacman;
  const pellet = state.pellets[y][x];

  if (pellet === ".") {
    state.score += 10;
    state.pellets[y][x] = " ";
    state.pelletCount -= 1;
  }

  if (pellet === "o") {
    state.score += 50;
    state.pellets[y][x] = " ";
    state.pelletCount -= 1;
    state.powerTimer = 8000;
    state.message = "Power pellet";
  }

  if (state.pelletCount === 0) {
    setMode("won", "Maze cleared");
  }
}

function movePacman() {
  if (canMoveFrom(state.pacman, state.pacman.nextDir)) {
    state.pacman.dir = state.pacman.nextDir;
  }

  moveEntity(state.pacman, state.pacman.dir);
  eatCurrentTile();
  checkCollisions();
}

function getAvailableDirections(entity) {
  return Object.keys(DIRECTIONS).filter((direction) => canMoveFrom(entity, direction));
}

function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getGhostTarget(ghost) {
  const pacman = state.pacman;

  if (state.powerTimer > 0) {
    return ghost.scatter;
  }

  if (ghost.name === "Pinky") {
    const forward = DIRECTIONS[pacman.dir];
    return {
      x: normalizeX(pacman.x + forward.x * 4),
      y: Math.max(0, Math.min(rows - 1, pacman.y + forward.y * 4)),
    };
  }

  if (ghost.name === "Clyde" && getDistance(ghost, pacman) < 6) {
    return ghost.scatter;
  }

  if (ghost.name === "Inky") {
    const forward = DIRECTIONS[pacman.dir];
    return {
      x: normalizeX(pacman.x + forward.x * 2),
      y: Math.max(0, Math.min(rows - 1, pacman.y + forward.y * 2)),
    };
  }

  return pacman;
}

function chooseGhostDirection(ghost) {
  const options = getAvailableDirections(ghost);

  if (options.length === 0) {
    return ghost.dir;
  }

  let candidates = options;
  const reverse = OPPOSITE[ghost.dir];

  if (options.length > 1) {
    candidates = options.filter((direction) => direction !== reverse);
  }

  const target = getGhostTarget(ghost);
  const frightened = state.powerTimer > 0;

  return candidates
    .map((direction) => {
      const delta = DIRECTIONS[direction];
      const point = {
        x: normalizeX(ghost.x + delta.x),
        y: ghost.y + delta.y,
      };

      return {
        direction,
        distance: getDistance(point, target),
      };
    })
    .sort((a, b) => (frightened ? b.distance - a.distance : a.distance - b.distance))[0].direction;
}

function moveGhosts() {
  for (const ghost of state.ghosts) {
    const direction = chooseGhostDirection(ghost);
    moveEntity(ghost, direction);
  }

  checkCollisions();
}

function resetAfterHit() {
  state.lives -= 1;

  if (state.lives <= 0) {
    setMode("lost", "Game over");
    return;
  }

  resetPositions();
  setMode("ready", "Ready");
}

function eatGhost(ghost) {
  state.score += 200;
  ghost.x = ghost.home.x;
  ghost.y = ghost.home.y;
  ghost.dir = OPPOSITE[ghost.dir] || "left";
  state.message = `${ghost.name} captured`;
  updateHud();
}

function checkCollisions() {
  if (state.mode !== "playing" && state.mode !== "ready") {
    return;
  }

  for (const ghost of state.ghosts) {
    if (ghost.x === state.pacman.x && ghost.y === state.pacman.y) {
      if (state.powerTimer > 0) {
        eatGhost(ghost);
      } else {
        resetAfterHit();
      }
      return;
    }
  }
}

function update(delta) {
  if (state.mode !== "playing") {
    return;
  }

  state.powerTimer = Math.max(0, state.powerTimer - delta);
  state.mouthTime += delta;
  state.pacAccumulator += delta;
  state.ghostAccumulator += delta;

  const pacDelay = Math.max(88, 140 - state.level * 5);
  const ghostDelay = Math.max(105, (state.powerTimer > 0 ? 190 : 165) - state.level * 5);

  while (state.pacAccumulator >= pacDelay && state.mode === "playing") {
    movePacman();
    state.pacAccumulator -= pacDelay;
  }

  while (state.ghostAccumulator >= ghostDelay && state.mode === "playing") {
    moveGhosts();
    state.ghostAccumulator -= ghostDelay;
  }

  if (state.powerTimer <= 0 && state.message === "Power pellet") {
    state.message = "Go";
  }

  updateHud();
}

function drawRoundedRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBoard(time) {
  ctx.fillStyle = "#05060b";
  ctx.fillRect(0, 0, boardWidth, boardHeight);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const tile = MAZE_TEMPLATE[y][x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      if (tile === "#") {
        const inset = 2;
        drawRoundedRect(
          px + inset,
          py + inset,
          TILE_SIZE - inset * 2,
          TILE_SIZE - inset * 2,
          5,
        );
        ctx.fillStyle = "#1735b8";
        ctx.fill();
        ctx.strokeStyle = "#64e7ff";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      const pellet = state.pellets[y][x];

      if (pellet === ".") {
        ctx.beginPath();
        ctx.fillStyle = "#f6e6b8";
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pellet === "o") {
        const pulse = 1 + Math.sin(time / 150) * 0.16;
        ctx.beginPath();
        ctx.fillStyle = "#ffd642";
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 7 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPacman() {
  const { x, y, dir } = state.pacman;
  const centerX = x * TILE_SIZE + TILE_SIZE / 2;
  const centerY = y * TILE_SIZE + TILE_SIZE / 2;
  const angle = DIRECTIONS[dir].angle;
  const mouth = 0.18 + Math.abs(Math.sin(state.mouthTime / 95)) * 0.22;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(
    centerX,
    centerY,
    TILE_SIZE * 0.43,
    angle + mouth * Math.PI,
    angle + (2 - mouth) * Math.PI,
  );
  ctx.closePath();
  ctx.fillStyle = "#ffd642";
  ctx.fill();
}

function drawGhost(ghost) {
  const x = ghost.x * TILE_SIZE + TILE_SIZE / 2;
  const y = ghost.y * TILE_SIZE + TILE_SIZE / 2;
  const left = x - TILE_SIZE * 0.42;
  const top = y - TILE_SIZE * 0.42;
  const width = TILE_SIZE * 0.84;
  const height = TILE_SIZE * 0.86;
  const frightened = state.powerTimer > 0;

  ctx.beginPath();
  ctx.moveTo(left, top + height);
  ctx.lineTo(left, top + TILE_SIZE * 0.35);
  ctx.quadraticCurveTo(left, top, x, top);
  ctx.quadraticCurveTo(left + width, top, left + width, top + TILE_SIZE * 0.35);
  ctx.lineTo(left + width, top + height);

  for (let i = 0; i < 3; i += 1) {
    const footX = left + width - (i + 0.5) * (width / 3);
    ctx.lineTo(footX, top + height - TILE_SIZE * 0.14);
    ctx.lineTo(footX - width / 6, top + height);
  }

  ctx.closePath();
  ctx.fillStyle = frightened ? "#2351de" : ghost.color;
  ctx.fill();

  const eyeOffsetX = TILE_SIZE * 0.13;
  const eyeY = y - TILE_SIZE * 0.1;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x - eyeOffsetX, eyeY, TILE_SIZE * 0.11, 0, Math.PI * 2);
  ctx.arc(x + eyeOffsetX, eyeY, TILE_SIZE * 0.11, 0, Math.PI * 2);
  ctx.fill();

  const look = DIRECTIONS[ghost.dir] || DIRECTIONS.left;
  ctx.fillStyle = frightened ? "#f6e6b8" : "#18233a";
  ctx.beginPath();
  ctx.arc(
    x - eyeOffsetX + look.x * 2,
    eyeY + look.y * 2,
    TILE_SIZE * 0.045,
    0,
    Math.PI * 2,
  );
  ctx.arc(
    x + eyeOffsetX + look.x * 2,
    eyeY + look.y * 2,
    TILE_SIZE * 0.045,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function drawOverlay() {
  if (state.mode === "playing") {
    return;
  }

  ctx.fillStyle = "rgba(5, 6, 11, 0.58)";
  ctx.fillRect(0, 0, boardWidth, boardHeight);
  ctx.fillStyle = "#f7f5ec";
  ctx.font = "800 34px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(state.message, boardWidth / 2, boardHeight / 2 - 8);

  if (state.mode === "won") {
    ctx.font = "700 16px system-ui, sans-serif";
    ctx.fillText("Start continues", boardWidth / 2, boardHeight / 2 + 30);
  }
}

function draw(time) {
  drawBoard(time);
  drawPacman();

  for (const ghost of state.ghosts) {
    drawGhost(ghost);
  }

  drawOverlay();
}

function frame(time) {
  const delta = state.lastTime ? Math.min(40, time - state.lastTime) : 0;
  state.lastTime = time;
  update(delta);
  draw(time);
  requestAnimationFrame(frame);
}

function startOrResume() {
  if (state.mode === "lost") {
    resetGame();
  }

  if (state.mode === "won") {
    nextLevel();
  }

  setMode("playing", "Go");
}

function togglePause() {
  if (state.mode === "playing") {
    setMode("paused", "Paused");
  } else if (state.mode === "paused") {
    setMode("playing", "Go");
  }
}

function restart() {
  resetGame();
  setMode("playing", "Go");
}

function handleKeydown(event) {
  const directionByKey = {
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
  };

  if (directionByKey[event.key]) {
    event.preventDefault();
    setPacmanDirection(directionByKey[event.key]);
    return;
  }

  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    startOrResume();
  }

  if (event.key === "p" || event.key === "P") {
    event.preventDefault();
    togglePause();
  }
}

function bindControls() {
  document.addEventListener("keydown", handleKeydown);
  startBtn.addEventListener("click", startOrResume);
  pauseBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", restart);

  document.querySelectorAll("[data-dir]").forEach((button) => {
    button.addEventListener("click", () => {
      setPacmanDirection(button.dataset.dir);
    });
  });

  window.addEventListener("resize", configureCanvas);
}

configureCanvas();
resetGame();
bindControls();
requestAnimationFrame(frame);

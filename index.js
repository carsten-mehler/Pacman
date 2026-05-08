const TILE_SIZE = 28;
const SHOTS_PER_LEVEL = 5;
const PROJECTILE_DELAY = 45;
const POWER_PELLET_DURATION = 8000;
const HIGHSCORE_KEY = "pacmanHighscores";
const MAX_HIGHSCORES = 10;

const BASE_POWER_PELLETS = [
  { x: 1, y: 3 },
  { x: 17, y: 3 },
  { x: 1, y: 16 },
  { x: 17, y: 16 },
];

const BASE_MAZE_TEMPLATE = [
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

const LEVEL_DEFINITIONS = [
  {
    name: "Classic",
    openings: [],
    powerPellets: BASE_POWER_PELLETS,
    powerDuration: POWER_PELLET_DURATION,
  },
  {
    name: "Center Gate",
    openings: [
      { x: 9, y: 1 },
      { x: 9, y: 2 },
      { x: 9, y: 3 },
    ],
    powerPellets: [
      { x: 4, y: 4 },
      { x: 14, y: 4 },
      { x: 4, y: 18 },
      { x: 14, y: 18 },
    ],
    powerDuration: POWER_PELLET_DURATION - 200,
  },
  {
    name: "Lower Gate",
    openings: [
      { x: 9, y: 14 },
      { x: 9, y: 15 },
      { x: 9, y: 16 },
    ],
    powerPellets: [
      { x: 8, y: 4 },
      { x: 10, y: 4 },
      { x: 8, y: 18 },
      { x: 10, y: 18 },
    ],
    powerDuration: POWER_PELLET_DURATION - 400,
  },
  {
    name: "Side Doors",
    openings: [
      { x: 5, y: 5 },
      { x: 13, y: 5 },
      { x: 5, y: 18 },
      { x: 13, y: 18 },
    ],
    powerPellets: [
      { x: 1, y: 1 },
      { x: 17, y: 1 },
      { x: 1, y: 20 },
      { x: 17, y: 20 },
    ],
    powerDuration: POWER_PELLET_DURATION - 600,
  },
  {
    name: "Corner Loops",
    openings: [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 15, y: 2 },
      { x: 16, y: 2 },
      { x: 2, y: 19 },
      { x: 3, y: 19 },
      { x: 15, y: 19 },
      { x: 16, y: 19 },
    ],
    powerPellets: [
      { x: 4, y: 6 },
      { x: 14, y: 6 },
      { x: 4, y: 14 },
      { x: 14, y: 14 },
    ],
    powerDuration: POWER_PELLET_DURATION - 800,
  },
  {
    name: "Crossroads",
    openings: [
      { x: 7, y: 5 },
      { x: 11, y: 5 },
      { x: 7, y: 17 },
      { x: 11, y: 17 },
      { x: 9, y: 7 },
      { x: 9, y: 18 },
    ],
    powerPellets: [
      { x: 6, y: 4 },
      { x: 12, y: 4 },
      { x: 6, y: 20 },
      { x: 12, y: 20 },
    ],
    powerDuration: POWER_PELLET_DURATION - 1000,
  },
  {
    name: "Tunnel Web",
    openings: [
      { x: 3, y: 8 },
      { x: 15, y: 8 },
      { x: 3, y: 12 },
      { x: 15, y: 12 },
      { x: 5, y: 9 },
      { x: 13, y: 9 },
    ],
    powerPellets: [
      { x: 1, y: 4 },
      { x: 17, y: 4 },
      { x: 4, y: 20 },
      { x: 14, y: 20 },
    ],
    powerDuration: POWER_PELLET_DURATION - 1200,
  },
  {
    name: "Ghost House",
    openings: [
      { x: 7, y: 9 },
      { x: 11, y: 9 },
      { x: 7, y: 11 },
      { x: 8, y: 11 },
      { x: 10, y: 11 },
      { x: 11, y: 11 },
    ],
    powerPellets: [
      { x: 8, y: 8 },
      { x: 10, y: 8 },
      { x: 8, y: 12 },
      { x: 10, y: 12 },
    ],
    powerDuration: POWER_PELLET_DURATION - 1400,
  },
  {
    name: "Outer Rings",
    openings: [
      { x: 5, y: 7 },
      { x: 13, y: 7 },
      { x: 5, y: 13 },
      { x: 13, y: 13 },
      { x: 7, y: 7 },
      { x: 11, y: 7 },
      { x: 7, y: 13 },
      { x: 11, y: 13 },
    ],
    powerPellets: [
      { x: 4, y: 8 },
      { x: 14, y: 8 },
      { x: 4, y: 12 },
      { x: 14, y: 12 },
    ],
    powerDuration: POWER_PELLET_DURATION - 1600,
  },
  {
    name: "Final Maze",
    openings: [
      { x: 9, y: 1 },
      { x: 9, y: 2 },
      { x: 9, y: 3 },
      { x: 9, y: 14 },
      { x: 9, y: 15 },
      { x: 9, y: 16 },
      { x: 5, y: 5 },
      { x: 13, y: 5 },
      { x: 5, y: 18 },
      { x: 13, y: 18 },
      { x: 7, y: 9 },
      { x: 11, y: 9 },
      { x: 7, y: 11 },
      { x: 11, y: 11 },
    ],
    powerPellets: [
      { x: 9, y: 4 },
      { x: 9, y: 8 },
      { x: 9, y: 12 },
      { x: 9, y: 20 },
    ],
    powerDuration: POWER_PELLET_DURATION - 1800,
  },
];

function placeTiles(maze, tiles, tileValue) {
  for (const { x, y } of tiles) {
    if (maze[y] && x >= 0 && x < maze[y].length) {
      maze[y][x] = tileValue;
    }
  }
}

function buildLevelMaze(level) {
  const maze = BASE_MAZE_TEMPLATE.map((row) => row.split(""));

  placeTiles(maze, BASE_POWER_PELLETS, ".");
  placeTiles(maze, level.openings, ".");
  placeTiles(maze, level.powerPellets, "o");

  return maze.map((row) => row.join(""));
}

const LEVEL_MAZES = LEVEL_DEFINITIONS.map(buildLevelMaze);
const MAX_LEVEL = LEVEL_DEFINITIONS.length;

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
const shotsNode = document.querySelector("#shots");
const powerNode = document.querySelector("#power");
const trophiesNode = document.querySelector("#trophies");
const messageNode = document.querySelector("#message");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const shootBtn = document.querySelector("#shootBtn");
const touchShootBtn = document.querySelector("#touchShootBtn");
const restartBtn = document.querySelector("#restartBtn");
const completionScreen = document.querySelector("#completionScreen");
const completionEyebrow = document.querySelector("#completionEyebrow");
const completionTitle = document.querySelector("#completionTitle");
const completionMessage = document.querySelector("#completionMessage");
const finalScoreNode = document.querySelector("#finalScore");
const finalLevelNode = document.querySelector("#finalLevel");
const finalTrophiesNode = document.querySelector("#finalTrophies");
const highscoreForm = document.querySelector("#highscoreForm");
const playerNameInput = document.querySelector("#playerName");
const highscoreList = document.querySelector("#highscoreList");
const completionRestartBtn = document.querySelector("#completionRestartBtn");

const rows = BASE_MAZE_TEMPLATE.length;
const cols = BASE_MAZE_TEMPLATE[0].length;
const boardWidth = cols * TILE_SIZE;
const boardHeight = rows * TILE_SIZE;

const state = {
  mode: "ready",
  level: 1,
  score: 0,
  lives: 3,
  trophies: 0,
  shotsRemaining: SHOTS_PER_LEVEL,
  levelConfig: LEVEL_DEFINITIONS[0],
  maze: LEVEL_MAZES[0],
  pellets: [],
  pelletCount: 0,
  projectiles: [],
  inactiveGhostNames: new Set(),
  powerTimer: 0,
  pacman: null,
  ghosts: [],
  lastTime: 0,
  pacAccumulator: 0,
  ghostAccumulator: 0,
  projectileAccumulator: 0,
  mouthTime: 0,
  message: "Ready",
  highscoreSubmitted: false,
};

function configureCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(boardWidth * scale);
  canvas.height = Math.floor(boardHeight * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function getLevelIndex() {
  return Math.max(0, Math.min(MAX_LEVEL - 1, state.level - 1));
}

function loadCurrentLevel() {
  const levelIndex = getLevelIndex();
  state.levelConfig = LEVEL_DEFINITIONS[levelIndex];
  state.maze = LEVEL_MAZES[levelIndex];
  createPellets();
  resetPositions();
  clearSpawnTiles();
}

function createPellets() {
  state.pellets = state.maze.map((row) => row.split(""));
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
    inactive: state.inactiveGhostNames.has(ghost.name),
  }));

  state.projectiles = [];
  state.powerTimer = 0;
  state.pacAccumulator = 0;
  state.ghostAccumulator = 0;
  state.projectileAccumulator = 0;
}

function resetGame() {
  state.mode = "ready";
  state.level = 1;
  state.score = 0;
  state.lives = 3;
  state.trophies = 0;
  state.shotsRemaining = SHOTS_PER_LEVEL;
  state.inactiveGhostNames = new Set();
  state.message = "Ready";
  state.highscoreSubmitted = false;
  loadCurrentLevel();
  updateHud();
}

function completeLevel() {
  state.lives += 1;
  state.trophies += 1;
  state.projectiles = [];
  state.powerTimer = 0;

  if (state.level >= MAX_LEVEL) {
    setMode("won", `All ${MAX_LEVEL} levels cleared - final trophy earned, +1 life`);
    return;
  }

  setMode("level-clear", `Level ${state.level} cleared - trophy earned, +1 life`);
}

function nextLevel() {
  if (state.level >= MAX_LEVEL) {
    setMode("won", `All ${MAX_LEVEL} levels cleared`);
    return;
  }

  state.level += 1;
  state.mode = "ready";
  state.shotsRemaining = SHOTS_PER_LEVEL;
  state.inactiveGhostNames = new Set();
  loadCurrentLevel();
  state.message = `Level ${state.level}: ${state.levelConfig.name}`;
  updateHud();
}

function setMode(mode, message) {
  state.mode = mode;
  state.message = message;
  updateHud();
}

function formatPowerCountdown() {
  if (state.powerTimer <= 0) {
    return "Ready";
  }

  return `${Math.ceil(state.powerTimer / 1000)}s`;
}

function getHudMessage() {
  if (state.mode === "playing" && state.powerTimer > 0) {
    return `${state.message} - ${formatPowerCountdown()} left`;
  }

  return state.message;
}

function getStartButtonLabel() {
  if (state.mode === "paused") {
    return "Resume";
  }

  if (state.mode === "level-clear") {
    return "Next";
  }

  if (state.mode === "lost" || state.mode === "won") {
    return "Restart";
  }

  return "Start";
}

function isFinished() {
  return state.mode === "lost" || state.mode === "won";
}

function loadHighscores() {
  try {
    const savedScores = JSON.parse(localStorage.getItem(HIGHSCORE_KEY) || "[]");

    if (!Array.isArray(savedScores)) {
      return [];
    }

    return savedScores
      .filter((entry) => entry && typeof entry.name === "string")
      .map((entry) => ({
        name: entry.name.slice(0, 16) || "Player",
        score: Number(entry.score) || 0,
        level: Number(entry.level) || 1,
        trophies: Number(entry.trophies) || 0,
        completed: Boolean(entry.completed),
        date: typeof entry.date === "string" ? entry.date : "",
      }));
  } catch {
    return [];
  }
}

function saveHighscores(highscores) {
  try {
    localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(highscores));
    return true;
  } catch {
    state.message = "Highscores unavailable";
    return false;
  }
}

function sortHighscores(highscores) {
  return highscores
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (b.level !== a.level) {
        return b.level - a.level;
      }

      return b.trophies - a.trophies;
    })
    .slice(0, MAX_HIGHSCORES);
}

function renderHighscores() {
  highscoreList.replaceChildren();

  const highscores = loadHighscores();

  if (highscores.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "highscore-empty";
    emptyItem.textContent = "No scores yet";
    highscoreList.append(emptyItem);
    return;
  }

  for (const entry of highscores) {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const score = document.createElement("span");

    name.className = "highscore-name";
    score.className = "highscore-score";
    name.textContent = `${entry.name} - L${entry.level}, ${entry.trophies} trophies`;
    score.textContent = entry.score.toLocaleString();

    item.append(name, score);
    highscoreList.append(item);
  }
}

function saveCurrentHighscore(playerName) {
  if (!isFinished() || state.highscoreSubmitted) {
    return;
  }

  const name = playerName.trim().slice(0, 16) || "Player";
  const entry = {
    name,
    score: state.score,
    level: state.level,
    trophies: state.trophies,
    completed: state.mode === "won",
    date: new Date().toISOString(),
  };
  const highscores = sortHighscores([...loadHighscores(), entry]);

  if (saveHighscores(highscores)) {
    state.highscoreSubmitted = true;
    state.message = "Highscore saved";
    playerNameInput.value = "";
  }

  renderHighscores();
  updateHud();
}

function updateCompletionScreen() {
  const finished = isFinished();
  const wasHidden = completionScreen.hidden;

  completionScreen.hidden = !finished;

  if (!finished) {
    return;
  }

  const completedGame = state.mode === "won";

  completionEyebrow.textContent = completedGame ? "Victory" : "Game over";
  completionTitle.textContent = completedGame ? "All levels cleared" : "Game over";
  completionMessage.textContent = state.highscoreSubmitted
    ? "Highscore saved."
    : completedGame
      ? `You cleared all ${MAX_LEVEL} levels, earned ${state.trophies} trophies, and finished with ${state.lives} lives.`
      : `You reached level ${state.level}. Enter your name for the highscore list.`;
  finalScoreNode.textContent = state.score.toLocaleString();
  finalLevelNode.textContent = String(state.level);
  finalTrophiesNode.textContent = String(state.trophies);
  highscoreForm.hidden = state.highscoreSubmitted;
  renderHighscores();

  if (wasHidden && !state.highscoreSubmitted) {
    window.setTimeout(() => playerNameInput.focus(), 0);
  }
}

function updateHud() {
  scoreNode.textContent = state.score.toLocaleString();
  levelNode.textContent = String(state.level);
  livesNode.textContent = String(state.lives);
  pelletsNode.textContent = String(state.pelletCount);
  shotsNode.textContent = String(state.shotsRemaining);
  trophiesNode.textContent = String(state.trophies);
  powerNode.textContent = formatPowerCountdown();
  powerNode.classList.toggle("active", state.powerTimer > 0);
  messageNode.textContent = getHudMessage();
  startBtn.textContent = getStartButtonLabel();
  pauseBtn.disabled = state.mode !== "playing" && state.mode !== "paused";
  shootBtn.disabled = state.mode !== "playing" || state.shotsRemaining <= 0;
  touchShootBtn.disabled = shootBtn.disabled;
  updateCompletionScreen();
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

  return state.maze[y][normalizeX(x)];
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

function shoot() {
  if (state.mode !== "playing") {
    return;
  }

  if (state.shotsRemaining <= 0) {
    state.message = "No shots left";
    updateHud();
    return;
  }

  state.shotsRemaining -= 1;

  const delta = DIRECTIONS[state.pacman.dir];
  const projectile = {
    x: normalizeX(state.pacman.x + delta.x),
    y: state.pacman.y + delta.y,
    dir: state.pacman.dir,
  };

  if (isWall(projectile.x, projectile.y)) {
    state.message = "Shot blocked";
    updateHud();
    return;
  }

  state.projectiles.push(projectile);
  state.message = `${state.shotsRemaining} shots left`;
  checkProjectileHits();
  updateHud();
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
    state.powerTimer = state.levelConfig.powerDuration;
    state.message = "Ghosts vulnerable";
  }

  if (state.pelletCount === 0) {
    completeLevel();
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
    if (ghost.inactive) {
      continue;
    }

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

function hitGhost(ghost) {
  ghost.inactive = true;
  state.inactiveGhostNames.add(ghost.name);
  state.score += 300;
  state.message = `${ghost.name} hit`;
}

function checkCollisions() {
  if (state.mode !== "playing" && state.mode !== "ready") {
    return;
  }

  for (const ghost of state.ghosts) {
    if (ghost.inactive) {
      continue;
    }

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

function checkProjectileHits() {
  state.projectiles = state.projectiles.filter((projectile) => {
    for (const ghost of state.ghosts) {
      if (ghost.inactive) {
        continue;
      }

      if (ghost.x === projectile.x && ghost.y === projectile.y) {
        hitGhost(ghost);
        return false;
      }
    }

    return true;
  });
}

function moveProjectiles() {
  state.projectiles = state.projectiles.filter((projectile) => {
    const delta = DIRECTIONS[projectile.dir];
    const nextX = normalizeX(projectile.x + delta.x);
    const nextY = projectile.y + delta.y;

    if (isWall(nextX, nextY)) {
      return false;
    }

    projectile.x = nextX;
    projectile.y = nextY;
    return true;
  });

  checkProjectileHits();
}

function update(delta) {
  if (state.mode !== "playing") {
    return;
  }

  const hadPower = state.powerTimer > 0;
  state.powerTimer = Math.max(0, state.powerTimer - delta);
  state.mouthTime += delta;
  state.pacAccumulator += delta;
  state.ghostAccumulator += delta;
  state.projectileAccumulator += delta;

  const pacDelay = Math.max(88, 140 - state.level * 5);
  const ghostDelay = Math.max(145, (state.powerTimer > 0 ? 250 : 225) - state.level * 4);

  while (state.pacAccumulator >= pacDelay && state.mode === "playing") {
    movePacman();
    state.pacAccumulator -= pacDelay;
  }

  while (state.ghostAccumulator >= ghostDelay && state.mode === "playing") {
    moveGhosts();
    state.ghostAccumulator -= ghostDelay;
  }

  while (state.projectileAccumulator >= PROJECTILE_DELAY && state.mode === "playing") {
    moveProjectiles();
    state.projectileAccumulator -= PROJECTILE_DELAY;
  }

  if (hadPower && state.powerTimer <= 0) {
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
      const tile = state.maze[y][x];
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

function drawProjectiles() {
  for (const projectile of state.projectiles) {
    const x = projectile.x * TILE_SIZE + TILE_SIZE / 2;
    const y = projectile.y * TILE_SIZE + TILE_SIZE / 2;
    const delta = DIRECTIONS[projectile.dir];

    ctx.beginPath();
    ctx.strokeStyle = "#25d7a1";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.moveTo(x - delta.x * TILE_SIZE * 0.22, y - delta.y * TILE_SIZE * 0.22);
    ctx.lineTo(x + delta.x * TILE_SIZE * 0.22, y + delta.y * TILE_SIZE * 0.22);
    ctx.stroke();
  }
}

function drawGhost(ghost) {
  if (ghost.inactive) {
    return;
  }

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

function drawTrophy(centerX, centerY, scale = 1) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffd642";
  ctx.strokeStyle = "#ffe99a";
  ctx.lineWidth = 3;

  drawRoundedRect(-34, -38, 68, 44, 7);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-33, -27);
  ctx.bezierCurveTo(-64, -29, -63, 13, -29, 10);
  ctx.lineTo(-29, -2);
  ctx.bezierCurveTo(-45, 0, -46, -17, -33, -17);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(33, -27);
  ctx.bezierCurveTo(64, -29, 63, 13, 29, 10);
  ctx.lineTo(29, -2);
  ctx.bezierCurveTo(45, 0, 46, -17, 33, -17);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  drawRoundedRect(-8, 5, 16, 26, 4);
  ctx.fill();
  ctx.stroke();

  drawRoundedRect(-36, 28, 72, 15, 5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function getOverlayLines() {
  if (state.mode === "level-clear") {
    return [`Level ${state.level} cleared`, "Trophy earned - +1 life", "Start loads next level"];
  }

  if (state.mode === "won") {
    return [`All ${MAX_LEVEL} levels cleared`, "Final trophy earned - +1 life", "Enter your highscore"];
  }

  if (state.mode === "lost") {
    return ["Game over", "Enter your highscore"];
  }

  if (state.mode === "paused") {
    return ["Paused", "Start resumes"];
  }

  return [state.message];
}

function drawOverlay() {
  if (state.mode === "playing") {
    return;
  }

  ctx.fillStyle = "rgba(5, 6, 11, 0.58)";
  ctx.fillRect(0, 0, boardWidth, boardHeight);
  const hasTrophy = state.mode === "level-clear" || state.mode === "won";
  const lines = getOverlayLines();
  const textY = hasTrophy ? boardHeight / 2 + 8 : boardHeight / 2 - 8;

  if (hasTrophy) {
    drawTrophy(boardWidth / 2, boardHeight / 2 - 76, 0.9);
  }

  ctx.fillStyle = "#f7f5ec";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  lines.forEach((line, index) => {
    ctx.font = index === 0 ? "800 30px system-ui, sans-serif" : "700 16px system-ui, sans-serif";
    ctx.fillStyle = index === 0 ? "#f7f5ec" : "#ffe99a";
    ctx.fillText(line, boardWidth / 2, textY + index * 28);
  });

  if (state.mode === "won") {
    ctx.font = "700 14px system-ui, sans-serif";
    ctx.fillStyle = "#aaa8b8";
    ctx.fillText("Game complete", boardWidth / 2, textY + lines.length * 28 + 8);
  }
}

function draw(time) {
  drawBoard(time);
  drawProjectiles();
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
  if (state.mode === "lost" || state.mode === "won") {
    resetGame();
  }

  if (state.mode === "level-clear") {
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
    if (event.key === " ") {
      if (!event.repeat) {
        shoot();
      }
    } else {
      startOrResume();
    }
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
  shootBtn.addEventListener("click", shoot);
  touchShootBtn.addEventListener("click", shoot);
  restartBtn.addEventListener("click", restart);
  completionRestartBtn.addEventListener("click", restart);

  highscoreForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCurrentHighscore(playerNameInput.value);
  });

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

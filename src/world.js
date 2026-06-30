import { getRandomCollectible } from "./collectible.js";
import { WORLD_TEMPLATE } from "./worldTemplate.js";

const FLOOR = 0;
const OUTER_WALL = 1;
const INNER_WALL = 2;
const HOSPITAL = 3;

export default class World {
  constructor() {
    this.rows = WORLD_TEMPLATE.length;
    this.cols = WORLD_TEMPLATE[0].length;
    this.tiles = [];
    this.player = { x: 1, y: 1 };
    this.collectibles = [];
    this.maxCollectibles = 8;

    this.wallImage = new Image();
    this.wallImage.src = "./assets/wall.png";

    this.waterImage = new Image();
    this.waterImage.src = "./assets/water.jpg";

    this.groundImage = new Image();
    this.groundImage.src = "./assets/ground.png";

    this.hospitalImage = new Image();
    this.hospitalImage.src = "./assets/hospital.png";

    this.playerImage = new Image();
    this.playerImage.src = "./assets/player.png";

    this.buildWorld();
  }

  buildWorld() {
    this.createTilesFromTemplate();
    this.spawnPlayerAtStart();
    this.spawnCollectibles(this.maxCollectibles);
  }

  createTilesFromTemplate() {
    this.tiles = [];

    for (let y = 0; y < this.rows; y++) {
      const row = [];
      const templateRow = WORLD_TEMPLATE[y];

      for (let x = 0; x < this.cols; x++) {
        const symbol = templateRow[x].trim().toUpperCase();

        if (symbol === "-") {
          row.push(OUTER_WALL);
        } else if (symbol === "X") {
          row.push(INNER_WALL);
        } else if (symbol === "H") {
          row.push(HOSPITAL);
        } else {
          row.push(FLOOR);
        }
      }

      this.tiles.push(row);
    }
  }

  spawnPlayerAtStart() {
    this.player.x = 1;
    this.player.y = 1;
  }

  spawnCollectibles(count) {
    for (let i = 0; i < count; i++) {
      this.spawnOneCollectible();
    }
  }

  spawnOneCollectible() {
    const position = this.getRandomFloorPosition();
    const collectible = getRandomCollectible(position.x, position.y);
    this.collectibles.push(collectible);
  }

  getRandomFloorPosition() {
    while (true) {
      const x = this.randomInt(1, this.cols - 2);
      const y = this.randomInt(1, this.rows - 2);

      if (
        this.isFloor(x, y) &&
        !this.isPlayerAt(x, y) &&
        !this.isCollectibleAt(x, y)
      ) {
        return { x, y };
      }
    }
  }

  movePlayer(dx, dy) {
    const nextX = this.player.x + dx;
    const nextY = this.player.y + dy;

    if (!this.isWalkable(nextX, nextY)) {
      return { type: "none" };
    }

    if (this.isHospital(nextX, nextY)) {
      return { type: "hospital" };
    }

    this.player.x = nextX;
    this.player.y = nextY;

    const collected = this.collectAtPlayer();

    if (collected !== null) {
      return {
        type: "collectible",
        item: collected
      };
    }

    return { type: "none" };
  }

  collectAtPlayer() {
    const index = this.collectibles.findIndex((item) => {
      return item.x === this.player.x && item.y === this.player.y;
    });

    if (index === -1) {
      return null;
    }

    const collected = this.collectibles.splice(index, 1)[0];
    this.spawnOneCollectible();

    return collected;
  }

  isWalkable(x, y) {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.cols &&
      y < this.rows &&
      this.tiles[y][x] !== OUTER_WALL &&
      this.tiles[y][x] !== INNER_WALL
    );
  }

  isFloor(x, y) {
    return this.tiles[y][x] === FLOOR;
  }

  isHospital(x, y) {
    return this.tiles[y][x] === HOSPITAL;
  }

  isPlayerAt(x, y) {
    return this.player.x === x && this.player.y === y;
  }

  isCollectibleAt(x, y) {
    return this.collectibles.some((item) => {
      return item.x === x && item.y === y;
    });
  }

  draw(ctx, tileSize) {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, this.cols * tileSize, this.rows * tileSize);

    this.drawTiles(ctx, tileSize);
    this.drawHospital(ctx, tileSize);
    this.drawCollectibles(ctx, tileSize);
    this.drawPlayer(ctx, tileSize);
  }

  drawTiles(ctx, tileSize) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const tile = this.tiles[y][x];
        const drawX = x * tileSize;
        const drawY = y * tileSize;

        if (tile === OUTER_WALL) {
          if (this.wallImage.complete && this.wallImage.naturalWidth > 0) {
            ctx.drawImage(this.wallImage, drawX, drawY, tileSize, tileSize);
          } else {
            ctx.fillStyle = "#3f3f46";
            ctx.fillRect(drawX, drawY, tileSize, tileSize);
          }
        } else if (tile === INNER_WALL) {
          if (this.waterImage.complete && this.waterImage.naturalWidth > 0) {
            ctx.drawImage(this.waterImage, drawX, drawY, tileSize, tileSize);
          } else {
            ctx.fillStyle = "#0ea5e9";
            ctx.fillRect(drawX, drawY, tileSize, tileSize);
          }
        } else {
          if (this.groundImage.complete && this.groundImage.naturalWidth > 0) {
            ctx.drawImage(this.groundImage, drawX, drawY, tileSize, tileSize);
          } else {
            ctx.fillStyle = "#e8f0f7";
            ctx.fillRect(drawX, drawY, tileSize, tileSize);
          }
        }

        ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
        ctx.strokeRect(drawX, drawY, tileSize, tileSize);
      }
    }
  }

  drawHospital(ctx, tileSize) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.tiles[y][x] === HOSPITAL) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (minX === Infinity) {
      return;
    }

    const drawX = minX * tileSize;
    const drawY = minY * tileSize;
    const width = (maxX - minX + 1) * tileSize;
    const height = (maxY - minY + 1) * tileSize;

    if (this.hospitalImage.complete && this.hospitalImage.naturalWidth > 0) {
      ctx.drawImage(this.hospitalImage, drawX, drawY, width, height);
    } else {
      ctx.fillStyle = "#d8f3dc";
      ctx.fillRect(drawX, drawY, width, height);
    }
  }

  drawCollectibles(ctx, tileSize) {
    ctx.font = `${tileSize * 0.65}px 'Press Start 2P'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const item of this.collectibles) {
      const centerX = item.x * tileSize + tileSize / 2;
      const centerY = item.y * tileSize + tileSize / 2;

      ctx.fillText(item.icon, centerX, centerY);
    }
  }

  drawPlayer(ctx, tileSize) {
    const drawX = this.player.x * tileSize;
    const drawY = this.player.y * tileSize;

    if (this.playerImage.complete && this.playerImage.naturalWidth > 0) {
      ctx.drawImage(this.playerImage, drawX, drawY, tileSize, tileSize);
    } else {
      const centerX = drawX + tileSize / 2;
      const centerY = drawY + tileSize / 2;

      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(centerX, centerY, tileSize * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = `${tileSize * 0.45}px 'Press Start 2P'`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("@", centerX, centerY);
    }
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
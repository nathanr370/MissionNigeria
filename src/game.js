import World from "./world.js";
import GameState from "./gameState.js";

export default class Game {
  constructor(canvas, statsElement, messageElement, itemCollectSound) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.statsElement = statsElement;
    this.messageElement = messageElement;
    this.itemCollectSound = itemCollectSound;

    this.tileSize = 28;

    this.world = new World();
    this.state = new GameState();

    this.canvas.width = this.world.cols * this.tileSize;
    this.canvas.height = this.world.rows * this.tileSize;

    this.gameOver = false;
    this.currentScreen = "world";
  }

  start() {
    this.setupControls();
    this.updateHUD();
    this.render();
  }

  setupControls() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (this.gameOver && key === "r") {
        this.restart();
        return;
      }

      if (this.currentScreen === "hospital") {
        if (key === "escape" || key === "b") {
          this.currentScreen = "world";
          this.messageElement.textContent =
            "You left the hospital screen. Continue collecting public health tools.";
        }

        return;
      }

      if (this.gameOver) {
        return;
      }

      let dx = 0;
      let dy = 0;

      if (key === "w" || key === "arrowup") {
        dy = -1;
      } else if (key === "s" || key === "arrowdown") {
        dy = 1;
      } else if (key === "a" || key === "arrowleft") {
        dx = -1;
      } else if (key === "d" || key === "arrowright") {
        dx = 1;
      } else {
        return;
      }

      event.preventDefault();

      const result = this.world.movePlayer(dx, dy);

      if (result.type === "hospital") {
        this.currentScreen = "hospital";
        this.messageElement.textContent =
          "You entered the hospital. Press B or Escape to return to the world.";
      } else if (result.type === "collectible") {
        const collected = result.item;

        this.playItemCollectSound();

        this.state.applyEffects(collected.effects);
        this.messageElement.textContent = collected.message;
        this.checkGameEnd();
      }

      this.updateHUD();
    });
  }

  playItemCollectSound() {
    if (!this.itemCollectSound) {
      return;
    }

    this.itemCollectSound.currentTime = 0;
    this.itemCollectSound.play().catch((error) => {
      console.log("Collect sound could not play:", error);
    });
  }

  checkGameEnd() {
  if (this.state.hasWon()) {
    this.gameOver = true;
    this.currentScreen = "win";
    this.messageElement.textContent =
      "90% coverage reached, you win! Press R to restart.";
  } else if (this.state.hasLost()) {
    this.gameOver = true;
    this.messageElement.textContent =
      "The campaign struggled. Vaccines were available, but trust, transportation, or misinformation became too difficult to manage. Press R to restart.";
  }
}

  updateHUD() {
    this.statsElement.innerHTML = `
      <div class="stat-box">
        <div class="stat-label">Coverage</div>
        <div>${this.state.coverage}%</div>
      </div>

      <div class="stat-box">
        <div class="stat-label">Trust</div>
        <div>${this.state.trust}%</div>
      </div>

      <div class="stat-box">
        <div class="stat-label">Transportation</div>
        <div>${this.state.transportation}%</div>
      </div>

      <div class="stat-box">
        <div class="stat-label">Misinformation</div>
        <div>${this.state.misinformation}%</div>
      </div>

      <div class="stat-box">
        <div class="stat-label">Internet Access</div>
        <div>${this.state.internetAccess}%</div>
      </div>
    `;
  }

  render() {
  if (this.currentScreen === "hospital") {
    this.drawHospitalScreen();
  } else if (this.currentScreen === "win") {
    this.drawWinScreen();
  } else {
    this.world.draw(this.ctx, this.tileSize);
  }

  requestAnimationFrame(() => this.render());
}

  drawHospitalScreen() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "32px 'Press Start 2P'";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("Hospital", this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.font = "12px 'Press Start 2P'";
    this.ctx.fillText(
      "Press B or Escape to return",
      this.canvas.width / 2,
      this.canvas.height / 2 + 60
    );
  }

  restart() {
    this.world = new World();
    this.state = new GameState();

    this.gameOver = false;
    this.currentScreen = "world";

    this.canvas.width = this.world.cols * this.tileSize;
    this.canvas.height = this.world.rows * this.tileSize;

    this.messageElement.textContent =
        "Use WASD or arrow keys to move. Collect public health tools. Step on the hospital tiles to enter the hospital screen.";

    this.updateHUD();
}

  drawWinScreen() {
  this.ctx.fillStyle = "#f8f3df";
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.ctx.fillStyle = "black";
  this.ctx.font = "18px 'Press Start 2P'";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";

  this.ctx.fillText(
    "90% coverage reached,",
    this.canvas.width / 2,
    this.canvas.height / 2 - 20
  );

  this.ctx.fillText(
    "you win!",
    this.canvas.width / 2,
    this.canvas.height / 2 + 15
  );

  this.ctx.font = "12px 'Press Start 2P'";
  this.ctx.fillText(
    "Press R to restart.",
    this.canvas.width / 2,
    this.canvas.height / 2 + 65
  );
}
}
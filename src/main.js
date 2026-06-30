import Game from "./game.js";

const canvas = document.getElementById("gameCanvas");
const statsElement = document.getElementById("stats");
const messageElement = document.getElementById("message");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const itemCollectSound = document.getElementById("itemCollectSound");

const itemInfoButton = document.getElementById("itemInfoButton");
const itemInfoPanel = document.getElementById("itemInfoPanel");

music.volume = 0.35;
itemCollectSound.volume = 0.55;

let isMusicPlaying = false;

musicButton.addEventListener("click", async () => {
  if (isMusicPlaying) {
    music.pause();
    musicButton.textContent = "Music: Off";
    isMusicPlaying = false;
  } else {
    try {
      await music.play();
      musicButton.textContent = "Music: On";
      isMusicPlaying = true;
    } catch (error) {
      console.log("Music could not start:", error);
    }
  }
});

itemInfoButton.addEventListener("click", () => {
  itemInfoPanel.classList.toggle("hidden");

  if (itemInfoPanel.classList.contains("hidden")) {
    itemInfoButton.textContent = "Item Info";
  } else {
    itemInfoButton.textContent = "Hide Info";
  }
});

const game = new Game(canvas, statsElement, messageElement, itemCollectSound);
game.start();
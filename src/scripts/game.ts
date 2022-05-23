import "phaser";
import * as constant from "./constant";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";

const configVertical = {
  type: Phaser.AUTO,
  backgroundColor: "#33A5E7",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: constant.GAME_WIDTH,
    height: constant.GAME_HEIGHT,
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const configHorizontal = {
  type: Phaser.AUTO,
  backgroundColor: "#33A5E7",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: constant.GAME_HEIGHT,
    height: constant.GAME_WIDTH,
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

let GAME: Phaser.Game;
let horizMode: boolean = window.innerWidth > window.innerHeight;
updateAspectRatio();

window.addEventListener("resize", () => {
  updateAspectRatio();
});

function updateAspectRatio() {
  if (window.innerWidth / window.innerHeight > 1 && !horizMode) {
    horizMode = true;
    //restartGame();
  }
  if (window.innerWidth / window.innerHeight < 1 && horizMode) {
    horizMode = false;
    //restartGame();
  }
}

window.addEventListener("load", () => restartGame());

function restartGame() {
  if (GAME !== undefined) GAME.destroy(true, false);
  // get .on('destroy') event?
  if (horizMode) GAME = new Phaser.Game(configHorizontal);
  else GAME = new Phaser.Game(configVertical);
}

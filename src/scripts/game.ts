import "phaser";
import * as constant from "./constant";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";
import { isWindowPortrait } from "./views/utility";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#33A5E7",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: constant.GAME_SIZE_SHORT,
    height: constant.GAME_SIZE_LONG,
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

window.addEventListener("load", initGame);
function initGame() {
  if (!isWindowPortrait()) {
    config.scale.width = constant.GAME_SIZE_LONG;
    config.scale.height = constant.GAME_SIZE_SHORT;
  }
  new Phaser.Game(config);
}

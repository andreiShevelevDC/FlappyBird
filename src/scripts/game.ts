import 'phaser'
import * as constant from './constant'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

// const DEFAULT_WIDTH = 1280
// const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#33A5E7',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: constant.GAME_WIDTH,
    height: constant.GAME_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

window.addEventListener('load', () => {
  new Phaser.Game(config)
})

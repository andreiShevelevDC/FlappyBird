import { SPRITESHEET_BIRD } from "../constant";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image("image_back", "assets/back.png");
    this.load.image("image_pipe", "assets/pipe.png");
    this.load.image("image_pipe_bottom", "assets/pipe_bottom.png");

    this.load.spritesheet(SPRITESHEET_BIRD, "assets/bird.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    // doesn't work here
    //this.add.image(0, 0, "image_back").setOrigin(0, 0);

    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}

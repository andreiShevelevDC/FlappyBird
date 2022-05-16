import {IMAGE_PIPE, IMAGE_PIPE_BOTTOM, TEXTURES, SPRITESHEET_BIRD} from "../constant";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image("image_back", "assets/back.png");
    this.load.image(IMAGE_PIPE, "assets/pipe.png");
    this.load.image(IMAGE_PIPE_BOTTOM, "assets/pipe_bottom.png");
    this.load.atlas(TEXTURES, "../assets/main.png", "../assets/main.json");

    this.load.spritesheet(SPRITESHEET_BIRD, "assets/bird.png", {
      frameWidth: 34,
      frameHeight: 24,
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

// outputs Sprite messages
// in the center of the screen

import * as constant from "./../constant";
import { getCenterX, getCenterY } from "./utility";

export class ImageComponent extends Phaser.GameObjects.Image {
  constructor(
    scene: Phaser.Scene,
    x: number = getCenterX(),
    y: number = getCenterY(),
    name: string
  ) {
    super(scene, 0, 0, constant.TEXTURES, name);
    this.setDepth(constant.ENTITIES_DEPTH.HUD)
      .setOrigin(0.5, 0.5)
      .setPosition(x, y);
    scene.add.existing(this);
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.setVisible(false);
  }
}

import * as constant from "../constant";
import { getCenterX, getCenterY } from "./utility";

export class TextComponent extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number = getCenterX(),
    y: number = getCenterY(),
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, 0, 0, text, style);
    this.setDepth(constant.ENTITIES_DEPTH.HUD)
      .setOrigin(0.5, 0.5)
      .setPosition(x, y);
    scene.add.existing(this);
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    (this as Phaser.GameObjects.Text).setVisible(false);
  }

  public setPosition(
    x: number = getCenterX(),
    y: number = getCenterX(),
    z?: number,
    w?: number
  ): this {
    return super.setPosition(x, y, z, w);
  }
}

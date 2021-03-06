import * as constant from "./../constant";
import { getSizeX } from "./utility";

export class PipeComponent extends Phaser.Physics.Arcade.Sprite {
  // TODO: can I get sizes from image itself?
  static PIPE_WIDTH = 52;
  static PIPE_HEIGHT = 320;

  constructor(scene: Phaser.Scene, isTop: boolean, y: number) {
    let image_name: string;
    if (isTop) image_name = "pipe-2.png";
    else image_name = "pipe-1.png";
    super(
      scene,
      getSizeX() + PipeComponent.PIPE_WIDTH / 2,
      y,
      constant.TEXTURES,
      image_name
    );
    this.setDepth(constant.ENTITIES_DEPTH.PIPES);
    scene.add.existing(this);
  }

  // only RTL
  public move(gameSpeed: number): void {
    this.x -= gameSpeed;
    this.refreshBody();
  }

  public isInCounterWindow = (gameSpeed: number): boolean =>
    this.x < constant.BIRD_POS_X && this.x >= constant.BIRD_POS_X - gameSpeed;

  public isOutOfWindow = (): boolean => this.x < -PipeComponent.PIPE_WIDTH / 2;
}

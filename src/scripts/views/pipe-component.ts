import * as constant from "./../constant";

export class PipeComponent extends Phaser.Physics.Arcade.Sprite {

// TODO: can I get sizes from image itself?
  static PIPE_WIDTH = 52;
  static PIPE_HEIGHT = 320;

  constructor(scene: Phaser.Scene, isTop:boolean, y: number) {
    let image_name: any;
    if(isTop) image_name = constant.IMAGE_PIPE;
    else image_name = constant.IMAGE_PIPE_BOTTOM;

    super(scene, constant.GAME_WIDTH + PipeComponent.PIPE_WIDTH / 2, y, constant.TEXTURES, image_name);

    scene.add.existing(this);
    //scene.physics.add.existing(this);
  }

  // only RTL
  move(gameSpeed: number): void {
    this.x -= gameSpeed;
    this.refreshBody();
  }

  isInCounterWindow = (gameSpeed: number): boolean =>
    (this.x <= constant.BIRD_POS_X && this.x >= constant.BIRD_POS_X - gameSpeed - 1);

  isOutOfWindow = (): boolean => (this.x < -PipeComponent.PIPE_WIDTH / 2);

  destroy(): void {
    super.destroy();
  }
}

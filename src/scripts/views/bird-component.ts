import * as constant from "./../constant";

export class BirdComponent extends Phaser.Physics.Arcade.Sprite {
  private readonly BIRD_SCALE = 1; //1.35;

  public constructor(scene: Phaser.Scene) {
    super(
      scene,
      constant.BIRD_POS_X,
      constant.BIRD_POS_Y,
      constant.SPRITESHEET_BIRD
    );

    scene.add.existing(this);
    scene.physics.add
      .existing(this)
      .setScale(this.BIRD_SCALE)
      .setBounce(0.2)
      .setCollideWorldBounds(false)
      .setDepth(constant.ENTITIES_DEPTH.BIRD);

    this.createAnimation();
  }

  private createAnimation(): void {
    this.anims.create({
      key: "flap",
      frames: this.anims.generateFrameNumbers(constant.SPRITESHEET_BIRD, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: 1,
    });
  }

  public resetPosition(): void {
    this.setPosition(constant.BIRD_POS_X, constant.BIRD_POS_Y);
  }

  // death
  public isOutOfScreen = (): boolean =>
    this.y < 0 || this.y > constant.GAME_HEIGHT;

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.setVisible(false);
  }
}

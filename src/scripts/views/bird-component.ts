import * as constant from "./../constant";

export class BirdComponent extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene) {
    super(scene, constant.BIRD_POS_X, constant.BIRD_POS_Y, constant.SPRITESHEET_BIRD);

    scene.add.existing(this);
    scene.physics.add.existing(this)
      .setScale(constant.BIRD_SCALE)
      .setBounce(0.2)
      .setCollideWorldBounds(false)
      .setDepth(1);

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

  restart(): void {
    //this.setCollideWorldBounds(true);
    this.setPosition(constant.BIRD_POS_X, constant.BIRD_POS_Y);
  }

  // death
  isOutOfScreen = (): boolean =>
    (this.y < 0 || this.y > constant.GAME_HEIGHT);
}

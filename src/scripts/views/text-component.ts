import * as constant from "../constant";

export class TextComponent extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number = constant.GAME_SIZE_SHORT / 2,
    y: number = constant.GAME_SIZE_LONG / 2,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, 0, 0, text, style);
    this.setDepth(constant.ENTITIES_DEPTH.HUD)
      .setOrigin(0.5, 0.5)
      .setPosition(x as number, y as number);
    scene.add.existing(this);
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    (this as Phaser.GameObjects.Text).setVisible(false);
  }

  // public setNewText(newText: string): void {
  //   this.setText(newText);
  // }
}

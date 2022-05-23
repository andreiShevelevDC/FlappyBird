import * as constant from "./../constant";
import { TextComponent } from "./text-component";
import { ImageComponent } from "./image-component";

export const isWindowPortrait = (): boolean =>
  window.innerHeight > window.innerWidth;

export const getCenterX = (): number =>
  isWindowPortrait()
    ? constant.GAME_SIZE_SHORT / 2
    : constant.GAME_SIZE_LONG / 2;

export const getCenterY = (): number =>
  isWindowPortrait()
    ? constant.GAME_SIZE_LONG / 2
    : constant.GAME_SIZE_SHORT / 2;

export class Utility {
  private scene: Phaser.Scene;
  private index: number = 0;
  private imageList: string[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.imageList = this.scene.textures.get(constant.TEXTURES).getFrameNames();
    this.showImagesAndNames();
  }

  // shows all Images and their names in TEXTURES
  private showImagesAndNames(): void {
    let currImage = new ImageComponent(
      this.scene,
      undefined,
      undefined,
      this.imageList[this.index]
    );
    let imageName = new TextComponent(
      this.scene,
      undefined,
      100,
      this.imageList[this.index],
      constant.MESSAGE_STYLE
    );
    currImage
      .setInteractive()
      .on("pointerdown", () => this.onClick(currImage, imageName));
  }

  private onClick(img: ImageComponent, name: TextComponent): void {
    img.destroy();
    name.destroy();
    if (++this.index > this.imageList.length) this.index = 0;
    this.showImagesAndNames();
  }
}

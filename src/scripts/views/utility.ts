// utility method to show all images and their names from TEXTURES
import * as constant from "./../constant";
import { TextComponent } from "./text-component";
import { ImageComponent } from "./image-component";

export class Utility {
  private scene: Phaser.Scene;
  private index: number = 0;
  private imageList: string[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.imageList = this.scene.textures.get(constant.TEXTURES).getFrameNames();
    this.showImageAndName();
  }

  private showImageAndName(): void {
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
      constant.FINISH_MESSAGE_STYLE
    );
    currImage
      .setInteractive()
      .on("pointerdown", () => this.onClick(currImage, imageName));
  }

  private onClick(img: ImageComponent, name: TextComponent): void {
    img.destroy();
    name.destroy();
    if (++this.index > this.imageList.length) this.index = 0;
    this.showImageAndName();
  }
}

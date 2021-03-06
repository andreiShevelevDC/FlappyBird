import * as constant from "../constant";
import { getSizeX, getSizeY } from "./utility";

export class Background {
  private readonly TILE_WIDTH = 288;
  private readonly BASE_WIDTH = 336;
  private readonly BASE_HEIGHT = 112;
  private back: Phaser.GameObjects.TileSprite[] = [];
  private base: Phaser.GameObjects.TileSprite[] = [];

  public constructor() {
    //this.buildBackground(scene);
  }

  public buildBackground(scene: Phaser.Scene): void {
    this.deleteBackground();
    let tile: Phaser.GameObjects.TileSprite;
    let tilesNum: number = Math.ceil(getSizeX() / this.TILE_WIDTH);
    for (let i = 0; i < tilesNum; i++) {
      tile = new Phaser.GameObjects.TileSprite(
        scene,
        i * this.TILE_WIDTH,
        0,
        this.TILE_WIDTH,
        512,
        constant.TEXTURES,
        "bg.png"
      )
        .setScale(2)
        .setDepth(constant.ENTITIES_DEPTH.BACKGROUND);
      scene.add.existing(tile);
      this.back[i] = tile;
    }
    let base_tile: Phaser.GameObjects.TileSprite;
    let basesNum: number = Math.ceil(getSizeX() / this.BASE_WIDTH) + 1;
    for (let i = 0; i < basesNum; i++) {
      base_tile = new Phaser.GameObjects.TileSprite(
        scene,
        i * this.BASE_WIDTH,
        getSizeY() - this.BASE_HEIGHT + 100, // TODO Why need 100?
        this.BASE_WIDTH,
        this.BASE_HEIGHT,
        constant.TEXTURES,
        "base.png"
      )
        //.setScale(2)
        .setDepth(constant.ENTITIES_DEPTH.BASE);
      scene.add.existing(base_tile);
      this.base[i] = base_tile;
    }
  }

  // move background RTL
  public doParallax(gameSpeed: number): void {
    let reps =
      this.back.length > this.base.length ? this.back.length : this.base.length;
    for (let i = 0; i <= reps; i++) {
      if (this.back[i] !== undefined)
        this.back[i].tilePositionX -= gameSpeed / 10;
      if (this.base[i] !== undefined)
        this.base[i].tilePositionX -= gameSpeed / 4;
    }
  }

  public getBackground = (): Phaser.GameObjects.TileSprite[] => this.back;

  public getBase(): Phaser.GameObjects.GameObject[] {
    let baseAsGameObjects: Phaser.GameObjects.GameObject[] = [];
    this.base.forEach((baseTile) =>
      baseAsGameObjects.push(baseTile as Phaser.GameObjects.GameObject)
    );
    return baseAsGameObjects;
  }

  private deleteBackground(): void {
    for (let i = 0; i < this.back.length; i++) {
      this.back[i].destroy();
    }
    for (let i = 0; i < this.base.length; i++) {
      this.base[i].destroy();
    }
  }
}

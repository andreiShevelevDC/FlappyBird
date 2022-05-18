import Phaser from "phaser";
import * as constant from "../constant";

export class Background {

    readonly TILE_WIDTH = 288;

    private back: Phaser.GameObjects.TileSprite[] = [];

    constructor(scene: Phaser.Scene) {

        let tileX: Phaser.GameObjects.TileSprite;
        let tilesNum: number = Math.ceil(constant.GAME_WIDTH / this.TILE_WIDTH);

        for(let i = 0; i < tilesNum; i++) {
            tileX = new Phaser.GameObjects.TileSprite(scene, i * this.TILE_WIDTH,0, this.TILE_WIDTH,
                512, constant.TEXTURES, "bg.png").setScale(2);

            scene.add.existing(tileX);
            this.back[i] = tileX;
        }
    }

    // move background RTL
    parallax(gameSpeed: number): void {
        // this.back.forEach(tile => {
        //     tile.tilePositionX -= gameSpeed / 3;
        // });
        for(let i = this.back.length - 1; i >= 0; i --) {
            this.back[i].tilePositionX -= gameSpeed / 3;
        }
    }

    getBackground = (): Phaser.GameObjects.TileSprite[] => this.back;
}
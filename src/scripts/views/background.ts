import * as constant from "../constant";

export class Background {

    readonly TILE_WIDTH = 288;
    readonly BASE_WIDTH = 336;
    readonly BASE_HEIGHT = 112;

    private back: Phaser.GameObjects.TileSprite[] = [];
    private base: Phaser.GameObjects.TileSprite[] = [];

    constructor(scene: Phaser.Scene) {

        let tile: Phaser.GameObjects.TileSprite;
        let tilesNum: number = Math.ceil(constant.GAME_WIDTH / this.TILE_WIDTH);

        for(let i = 0; i < tilesNum; i++) {
            tile = new Phaser.GameObjects.TileSprite(scene, i * this.TILE_WIDTH,0, this.TILE_WIDTH,
                512, constant.TEXTURES, "bg.png")
                .setScale(2)
                .setDepth(constant.ENTITIES_DEPTH.BACKGROUND);

            scene.add.existing(tile);
            this.back[i] = tile;
        }

        let base_tile: Phaser.GameObjects.TileSprite;
        let basesNum: number = Math.ceil(constant.GAME_WIDTH / this.BASE_WIDTH);
        console.log(basesNum);

        for(let i = 0; i < basesNum; i++) {
            base_tile = new Phaser.GameObjects.TileSprite(scene,
                i * this.BASE_WIDTH, 512 - this.BASE_HEIGHT,
                this.BASE_WIDTH, this.BASE_HEIGHT,
                constant.TEXTURES, "base.png")
                //.setScale(2)
                .setDepth(constant.ENTITIES_DEPTH.BASE);

            scene.add.existing(base_tile);
            this.base[i] = base_tile;
        }
    }

    // move background RTL
    parallax(gameSpeed: number): void {
        // this.back.forEach(tile => {
        //     tile.tilePositionX -= gameSpeed / 3;
        // });
        let reps = this.back.length > this.base.length ? this.back.length : this.base.length;
        for(let i = 0; i <= reps; i++) {
            if(this.back[i] !== undefined) this.back[i].tilePositionX -= gameSpeed / 3;
            if(this.base[i] !== undefined) this.base[i].tilePositionX -= gameSpeed;
        }
    }

    getBackground = (): Phaser.GameObjects.TileSprite[] => this.back;
}
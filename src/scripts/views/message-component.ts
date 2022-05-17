// outputs Sprite messages
// in the center of the screen

import * as constant from "./../constant";
import Phaser from "phaser";

export class MessageComponent extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, name: string) {

        super(scene, 0, 0, constant.TEXTURES, name);

        this.setDepth(3)
            .setOrigin(0.5, 0.5)
            .setPosition(constant.GAME_WIDTH / 2, constant.GAME_HEIGHT / 2);
        scene.add.existing(this);
    }

    show(): void {
        this.setVisible(true);
    }

    hide(): void {
        this.setVisible(false);
    }

    // utility method to find the image I need
    static showImagesAndNames(scene: Phaser.Scene) {
        //console.log(scene.textures.get(constant.TEXTURES).getFrameNames());
        let imageList: string[] = scene.textures.get(constant.TEXTURES).getFrameNames();

        let currSprite: Phaser.Physics.Arcade.Sprite;
        let spriteName: Phaser.GameObjects.Text;
        let i = 0;

        let showImage = (index): void => {
            currSprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, constant.TEXTURES, imageList[index]);
            currSprite
                .setDepth(4)
                .setOrigin(0.5, 0.5)
                .setPosition(constant.GAME_WIDTH / 2, constant.GAME_HEIGHT / 2)
                .setInteractive()
                .on("pointerdown", () => onClick());
            scene.add.existing(currSprite);

            spriteName = new Phaser.GameObjects.Text(scene, 0, 0, imageList[index], constant.MESSAGE_STYLE);
            spriteName.setDepth(4)
                .setOrigin(0.5, 0.5)
                .setPosition(constant.GAME_WIDTH / 2, 100);
            scene.add.existing(spriteName);
        }

        let onClick = (): void => {
            currSprite.destroy();
            spriteName.destroy();
            if(++i > imageList.length) i = 0;
            showImage(i);
        }

        showImage(i);
    }

}
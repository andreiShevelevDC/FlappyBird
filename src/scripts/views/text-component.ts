import * as constant from "../constant";

export class TextComponent extends Phaser.GameObjects.Text {

    constructor(scene: Phaser.Scene, x: number | string, y: number | string,
        text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {

        if (typeof(x) === "string" && x === "center") x = constant.GAME_WIDTH / 2;
        if (typeof(y) === "string" && y === "center") y = constant.GAME_HEIGHT / 2;

        super(scene, 0, 0, text, style);

        this.setDepth(2)
            .setOrigin(0.5, 0.5)
            .setPosition(x as number, y as number);
        scene.add.existing(this);
    }

    show(): void {
        this.setVisible(true);
    }

    hide(): void {
        (this as Phaser.GameObjects.Text).setVisible(false);
    }

    setNewText(newText: string): void {
        this.setText(newText);
    }
}
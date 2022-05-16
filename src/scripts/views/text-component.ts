export class TextComponent extends Phaser.GameObjects.Text {

    constructor(scene: Phaser.Scene, x: number, y: number,
        text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {

        super(scene, x, y, text, style);

        this.setDepth(2);
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
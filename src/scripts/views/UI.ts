// Start/pause game - message.png
// Score - plain text
// Finish game - popup.png, gameover.png. score - text, play again - text

import * as constant from "./../constant";

export class UI extends Phaser.GameObjects.Container {

    private score: number = 0;

    private scoreMessage!: Phaser.GameObjects.Text;
    private startImage!: Phaser.GameObjects.Image;
    private finishBack!: Phaser.GameObjects.Image;
    private finishImage!: Phaser.GameObjects.Image;
    private finishScoreMessage!: Phaser.GameObjects.Text;
    private finishRestartMessage!: Phaser.GameObjects.Text;

    constructor(public scene: Phaser.Scene) {
        super(scene);

        this.build(scene);
        this.pauseGame();
    }

    private build(scene) {

        this.scoreMessage = new Phaser.GameObjects.Text(scene,
            0, 0,
            `${constant.SCORE_MESSAGE_TEXT} 0`, constant.SCORE_STYLE);
        this.scoreMessage.setDepth(constant.ENTITIES_DEPTH.UI)
            .setOrigin(0.5, 0.5)
            .setPosition(constant.GAME_WIDTH - constant.GAME_WIDTH / 5, 25)
        scene.add.existing(this.scoreMessage);

        this.startImage = new Phaser.GameObjects.Image(scene, 0, 0, constant.TEXTURES, "message.png");
        this.startImage.setDepth(constant.ENTITIES_DEPTH.UI)
            .setOrigin(0.5, 0.5)
            .setPosition(constant.GAME_WIDTH / 2, constant.GAME_HEIGHT / 2);
        scene.add.existing(this.startImage);

        this.finishBack = new Phaser.GameObjects.Image(scene, 0, 0, constant.TEXTURES, "popup.png");
        this.finishBack.setDepth(constant.ENTITIES_DEPTH.UI)
            .setOrigin(0.5, 0.5)
            .setPosition(constant.GAME_WIDTH / 2, constant.GAME_HEIGHT / 2);
        scene.add.existing(this.finishBack);

        this.finishImage = new Phaser.GameObjects.Image(scene, 0, 0, constant.TEXTURES, "gameover.png");
        this.finishImage.setDepth(constant.ENTITIES_DEPTH.UI)
            .setOrigin(0.5, 0.5)
            .setPosition(constant.GAME_WIDTH / 2, constant.GAME_HEIGHT / 2 - 200);
        scene.add.existing(this.finishImage);

        this.finishScoreMessage = new Phaser.GameObjects.Text(scene,
            0, 0,
            "", constant.MESSAGE_STYLE);
        this.finishScoreMessage.setDepth(constant.ENTITIES_DEPTH.UI)
            .setOrigin(0.5, 0.5)
            .setPosition(constant.GAME_WIDTH / 2, constant.GAME_HEIGHT / 2);
        scene.add.existing(this.finishScoreMessage);

        this.finishRestartMessage = new Phaser.GameObjects.Text(scene,
            0, 0,
            constant.FINISH_RESTART_TEXT, constant.MESSAGE_STYLE);
        this.finishRestartMessage.setDepth(constant.ENTITIES_DEPTH.UI)
            .setOrigin(0.5, 0.5)
            .setPosition(constant.GAME_WIDTH / 2, constant.GAME_HEIGHT / 2 + 100);
        scene.add.existing(this.finishRestartMessage);
    }

    updateScore() {
        this.score++;
        this.scoreMessage.setText(`${constant.SCORE_MESSAGE_TEXT} ${this.score}`);
    }

    pauseGame() {
        this.finishBack.setVisible(false);
        this.finishImage.setVisible(false);
        this.finishScoreMessage.setVisible(false);
        this.finishRestartMessage.setVisible(false);

        this.scoreMessage.setVisible(true);
        this.startImage.setVisible(true);
    }

    // only succeeds pauseGame
    playGame() {
        this.startImage.setVisible(false);
        this.scoreMessage.setVisible(true);
    }

    finishGame() {
        this.scoreMessage.setVisible(false);

        this.finishBack.setVisible(true);
        this.finishImage.setVisible(true);
        this.finishScoreMessage.setText(`${constant.FINISH_SCORE_TEXT} ${this.score}`);
        this.finishScoreMessage.setVisible(true);
        this.finishRestartMessage.setVisible(true);

        this.score = 0;
    }

    // update(gameState: constant.GAME_STATE) {
    //     switch(gameState) {
    //         case constant.GAME_STATE.PLAY:
    //         case constant.GAME_STATE.PAUSE:
    //             this.showScore
    //     }
    // }
}
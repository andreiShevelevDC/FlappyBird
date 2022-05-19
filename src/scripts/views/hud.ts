// Start/pause game - message.png
// Score - plain text
// Finish game - popup.png, gameover.png. score - text, play again - text

import * as constant from "./../constant";
import { TextComponent } from "./text-component";
import { ImageComponent } from "./image-component";

export class Hud extends Phaser.GameObjects.Container {
  private score: number = 0;
  private scoreMessage!: TextComponent;
  private startImage!: ImageComponent;
  private finishBack!: ImageComponent;
  private finishImage!: ImageComponent;
  private finishScoreMessage!: TextComponent;
  private finishRestartMessage!: TextComponent;

  public constructor(public scene: Phaser.Scene) {
    super(scene);
    this.build(scene);
    this.pauseGame();
  }

  private build(scene): void {
    this.scoreMessage = new TextComponent(
      scene,
      constant.GAME_WIDTH - constant.GAME_WIDTH / 5,
      20,
      "",
      constant.SCORE_STYLE
    );
    this.startImage = new ImageComponent(
      scene,
      undefined,
      undefined,
      "message.png"
    );
    this.finishBack = new ImageComponent(
      scene,
      undefined,
      undefined,
      "popup.png"
    );
    this.finishImage = new ImageComponent(
      scene,
      undefined,
      constant.GAME_HEIGHT / 2 - 40,
      "gameover.png"
    );
    this.finishScoreMessage = new TextComponent(
      scene,
      undefined,
      constant.GAME_HEIGHT / 2 + 10,
      "",
      constant.FINISH_MESSAGE_STYLE
    );
    this.finishRestartMessage = new TextComponent(
      scene,
      undefined,
      constant.GAME_HEIGHT / 2 + 50,
      constant.FINISH_RESTART_TEXT,
      constant.FINISH_MESSAGE_STYLE
    );
    scene.tweens.add({
      targets: this.finishRestartMessage,
      alpha: 0.6,
      duration: 1000,
      ease: "SineInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  public updateScore(): void {
    this.score++;
    this.scoreMessage.setText(
      `${constant.SCORE_MESSAGE_TEXT} ${this.score.toString().padStart(3, "0")}`
    );
  }

  private shouldShowFinishPopup(isShown: boolean): void {
    this.finishBack.setVisible(isShown);
    this.finishImage.setVisible(isShown);
    this.finishScoreMessage.setVisible(isShown);
    this.finishRestartMessage.setVisible(isShown);
  }

  public pauseGame(): void {
    this.shouldShowFinishPopup(false);
    this.scoreMessage.setText(
      `${constant.SCORE_MESSAGE_TEXT} ${this.score.toString().padStart(3, "0")}`
    );
    this.scoreMessage.setVisible(true);
    this.startImage.setVisible(true);
  }

  // only succeeds(is called from) pauseGame
  public playGame(): void {
    this.startImage.setVisible(false);
    this.scoreMessage.setVisible(true);
  }

  public finishGame(): void {
    this.scoreMessage.setVisible(false);
    this.finishScoreMessage.setText(
      `${constant.FINISH_SCORE_TEXT} ${this.score.toString().padStart(3, "0")}`
    );
    this.shouldShowFinishPopup(true);
    this.score = 0;
  }

  public getScore = (): number => this.score;
}

// Start/pause game - message.png
// Score - plain text
// Finish game - popup.png, gameover.png. score - text, play again - text

import * as constant from "./../constant";
import { TextComponent } from "./text-component";
import { ImageComponent } from "./image-component";
import { getCenterY, getSizeX } from "./utility";

export class Hud extends Phaser.GameObjects.Container {
  private readonly SCORE_MESSAGE_TEXT = "Score:";
  private score: number = 0;
  private scoreMessage: TextComponent;
  private startImage: ImageComponent;
  private finishBack: ImageComponent;
  private finishImage: ImageComponent;
  private finishScoreMessage: TextComponent;
  private finishRestartMessage: TextComponent;

  public constructor(public scene: Phaser.Scene) {
    super(scene);
    this.build(scene);
    this.pauseGame();
  }

  private build(scene): void {
    const SCORE_STYLE = {
      font: "16px Verdana",
      fontStyle: "strong",
      fill: "#ff0000",
      align: "right",
    };
    this.scoreMessage = new TextComponent(scene, 0, 0, "", SCORE_STYLE);
    //export const PAUSE_MESSAGE_TEXT = "Press SPACE to play\n\nESCAPE to pause";
    this.startImage = new ImageComponent(scene, 0, 0, "message.png");
    this.finishBack = new ImageComponent(scene, 0, 0, "popup.png");
    this.finishImage = new ImageComponent(scene, 0, 0, "gameover.png");
    this.finishScoreMessage = new TextComponent(
      scene,
      0,
      0,
      "",
      constant.MESSAGE_STYLE
    );
    const FINISH_RESTART_TEXT = "Click or press SPACE\nto restart";
    this.finishRestartMessage = new TextComponent(
      scene,
      0,
      0,
      FINISH_RESTART_TEXT,
      constant.MESSAGE_STYLE
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

  // updates position of all hud elements on change orientation
  public updatePosition(): void {
    this.scoreMessage.setPosition(getSizeX() - 60, 20);
    this.startImage.setPosition(undefined, undefined);
    this.finishBack.setPosition(undefined, undefined);
    this.finishImage.setPosition(undefined, getCenterY() - 40);
    this.finishScoreMessage.setPosition(undefined, getCenterY() + 10);
    this.finishRestartMessage.setPosition(undefined, getCenterY() + 50);
  }

  public updateScore(): void {
    this.score++;
    this.scoreMessage.setText(
      `${this.SCORE_MESSAGE_TEXT} ${this.score.toString().padStart(3, "0")}`
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
      `${this.SCORE_MESSAGE_TEXT} ${this.score.toString().padStart(3, "0")}`
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
    const FINISH_SCORE_TEXT = "Your score:";
    this.scoreMessage.setVisible(false);
    this.finishScoreMessage.setText(
      `${FINISH_SCORE_TEXT} ${this.score.toString().padStart(3, "0")}`
    );
    this.shouldShowFinishPopup(true);
    this.score = 0;
  }

  public getScore = (): number => this.score;
}

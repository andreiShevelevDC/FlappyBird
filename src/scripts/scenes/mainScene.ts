import Phaser from "phaser";
import * as constant from './../constant'
import {BirdComponent} from "../views/bird-component";
import {PipeComponent} from "../views/pipe-component";
import {TextComponent} from "../views/text-component";
import {MessageComponent} from "../views/message-component";
import {Background} from "../views/background";

export default class MainScene extends Phaser.Scene {
  gameState: number = constant.GAME_STATE.FINISH;
  gameSpeed: number = constant.GAME_WIDTH * constant.ACCELERATION;

  back: Background;//Phaser.GameObjects.TileSprite[] = [];

  pipesTop!: Phaser.GameObjects.Group;
  pipesBottom!: Phaser.GameObjects.Group;
  bird!: BirdComponent;

  overlapTop: Phaser.Physics.Arcade.Collider;
  overlapBottom: Phaser.Physics.Arcade.Collider;

  spacebarKey!: Phaser.Input.Keyboard.Key;
  escapeKey!: Phaser.Input.Keyboard.Key;

  pauseMessage!: MessageComponent;
  finishMessage!: TextComponent;
  scoreMessage!: TextComponent;

  counter: number = 0;
  counterSpeedUp: number = 1;

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.back = new Background(this);

    this.pipesTop = this.physics.add.staticGroup();
    this.pipesBottom = this.physics.add.staticGroup();

    this.bird = new BirdComponent(this);
    //this.makeBird(this.physics, this.anims);

    //this.physics.add.collider(this.bird, this.pipesTop, this.birdOverlap, undefined, this);
    this.overlapTop = this.physics.add.overlap(
        this.bird,// as Phaser.GameObjects.GameObject,
        this.pipesTop,
        this.finishGame,
        undefined,
        this
    );
    this.overlapBottom = this.physics.add.overlap(
        this.bird,
        this.pipesBottom,
        this.finishGame,
        undefined,
        this
    );

    //MessageComponent.showImagesAndNames(this);
    this.pauseMessage = new MessageComponent(this, "message.png");

    this.finishMessage = new TextComponent(this,
        "center",
        "center",
        constant.FINISH_MESSAGE_TEXT,
        constant.MESSAGE_STYLE
    );

    this.scoreMessage = new TextComponent(this,
        constant.GAME_WIDTH - constant.GAME_WIDTH / 5,
        25,
        `${constant.SCORE_MESSAGE_TEXT} ${this.counter}`,
        constant.SCORE_STYLE);

    this.gameRestart();
    this.setupUserEventsHandling();
  }

  birdFlap(): void {
    //console.log("flap");
    if (this.gameState === constant.GAME_STATE.PAUSE) {
      this.setPlay();
    }

    this.bird.setVelocityY(-constant.FLAP_VELOCITY);
  }

  // game finished!
  finishGame(): void {
    //setPause();
    //console.log("Overlap");

    this.gameState = constant.GAME_STATE.FINISH;

    // death 'animation'
    this.bird.setVelocityY(constant.FLAP_VELOCITY);
    //this.bird.setCollideWorldBounds(false);

    this.scoreMessage.hide();

    this.finishMessage.setNewText(
        `Your score: ${this.counter}\n${constant.FINISH_MESSAGE_TEXT}`
    );
    this.finishMessage.show();
  }

  gameRestart(): void {
    this.finishMessage.hide();

    this.clearPipes();

    this.counter = 0;
    this.scoreMessage.setNewText(`${constant.SCORE_MESSAGE_TEXT} ${this.counter}`);
    this.scoreMessage.show();

    this.counterSpeedUp = 1;

    this.bird.restart();

    this.addPipes();
    this.setPause();
  }

  // on game finish
  clearPipes(): void {
    let allPipesTop: Phaser.GameObjects.GameObject[] = this.pipesTop.getChildren();
    let allPipesBottom: Phaser.GameObjects.GameObject[] = this.pipesBottom.getChildren();

    while (allPipesTop.length > 0) {
      this.pipesTop.remove(allPipesTop[0], true, true);
      this.pipesBottom.remove(allPipesBottom[0], true, true);

    }
  }

  prevHoleCenter: number = constant.GAME_HEIGHT / 2;

  addPipes(): void {
    // clamps center of the hole to fit it whole on the screen
    // while making it's not too different in position from previous hole
    const findCenter = (holeWidth: number): number => {
      const RAND_Y = Math.random() * constant.GAME_HEIGHT / 1.3;

      let center: number = Math.min(
          RAND_Y,
          constant.GAME_HEIGHT / 1.3 - holeWidth / 2,
          this.prevHoleCenter + constant.HOLE_GAP_STEP
      );
      center = Math.max(
          center,
          holeWidth / 2,
          this.prevHoleCenter - constant.HOLE_GAP_STEP
      );

      return center;
    };

    // HOLE_SIZE.forEach(size => console.log(size));

    // let a = 20;

    // while(a > 0) {

    //     let randWidth = HOLE_SIZE[HOLE_DIFFICULTY[Math.floor(Math.random() * HOLE_DIFFICULTY.length)]];

    //     //console.log(randWidth);

    //     let holeWidth = HOLE_SIZE[HOLE_DIFFICULTY[Math.floor(Math.random() * HOLE_DIFFICULTY.length)]];

    //     console.log(holeWidth, findCenter(Math.random() * GAME_HEIGHT, holeWidth));

    //     a--;
    // }

    let holeWidth: number =
        constant.HOLE_SIZE[
            constant.HOLE_DIFFICULTY[
                Math.floor(Math.random() * constant.HOLE_DIFFICULTY.length)
                ]
            ];

    let holeCenter = findCenter(holeWidth);

    //console.log(holeCenter, " / ", holeWidth);
    this.prevHoleCenter = holeCenter;

    this.pipesTop.add(new PipeComponent(this, true, holeCenter - (holeWidth + PipeComponent.PIPE_HEIGHT) / 2));
    this.pipesBottom.add(new PipeComponent(this, false, holeCenter + (holeWidth + PipeComponent.PIPE_HEIGHT) / 2));
  }

  setPause(): void {
    //console.log(" * Pause");

    this.gameState = constant.GAME_STATE.PAUSE;
    //GAME.scene.pause('default');

    this.bird.hide();
    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(constant.GRAVITY_ZERO);
    this.bird.setVelocityY(0);

    this.pauseMessage.show();
  }

  setPlay(): void {
    //console.log(" * Play");

    this.gameState = constant.GAME_STATE.PLAY;

    this.pauseMessage.hide();

    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(constant.GRAVITY);
    this.bird.show();
  }

  setupUserEventsHandling() {
    this.spacebarKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.escapeKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
    );
    //this.input.keyboard.on('keydown-SPACE', birdFlap);
    //this.input.on('pointerdown', birdFlap);


    let backs = this.back.getBackground();
    backs.forEach(bck =>
        bck.setInteractive().on("pointerdown", () => this.onClick())
    );
  }

  pollKeyboard(): void {
    if (
        Phaser.Input.Keyboard.JustDown(this.escapeKey) &&
        this.gameState === constant.GAME_STATE.PLAY
    ) {
      this.setPause();
    }

    if (Phaser.Input.Keyboard.JustDown(this.spacebarKey)) {
      if (this.gameState !== constant.GAME_STATE.FINISH) {
        this.birdFlap();
        this.bird.anims.play("flap");
      } else this.gameRestart();
    }
  }

  onClick() {
    switch (this.gameState) {

      case constant.GAME_STATE.PLAY:
      case constant.GAME_STATE.PAUSE:
        this.birdFlap();
        this.bird.anims.play("flap");
        break;

      case constant.GAME_STATE.FINISH:
        this.gameRestart();
    }
  }

  update() {
    this.pollKeyboard();

    if (this.gameState === constant.GAME_STATE.PLAY) {

      if(this.bird.isOutOfScreen()) this.finishGame();

      //this.back.tilePositionX += this.gameSpeed;
      this.back.parallax(this.gameSpeed);

      let allPipesTop: Phaser.GameObjects.GameObject[] = this.pipesTop.getChildren();
      let allPipesBottom: Phaser.GameObjects.GameObject[] = this.pipesBottom.getChildren();

      for (let i = 0; i < allPipesTop.length; i++) {
        (allPipesTop[i] as PipeComponent).move(this.gameSpeed);
        (allPipesBottom[i] as PipeComponent).move(this.gameSpeed);


        // count the pipes pair that the bird has passed through
        if ((allPipesTop[i] as PipeComponent).isInCounterWindow(this.gameSpeed)) {
          this.counter++;
          this.scoreMessage.setNewText(`${constant.SCORE_MESSAGE_TEXT} ${this.counter}`);
        }

        // speeding up every 10 gates
        if (this.counter > this.counterSpeedUp && this.counter % 10 === 0) {
          this.gameSpeed += this.gameSpeed * constant.ACCELERATION * 50;

          //console.log(gameSpeed);
          this.counterSpeedUp = this.counter;
        }

        // create a new pair of pipes,
        // if the last (newest) pair has moved more than PIPE_GAP_STEP
        if (
            i === allPipesTop.length - 1 &&
            (allPipesTop[i] as Phaser.Physics.Arcade.Sprite).x <
            constant.GAME_WIDTH - constant.PIPE_GAP_STEP
        )
          this.addPipes();
      }

      // destroys the first pair of pipes if it moved out of screen
      if (
          allPipesTop.length !== 0 && ((allPipesTop[0] as PipeComponent).isOutOfWindow())
      ) {
        this.pipesTop.remove(allPipesTop[0], true, true);
        this.pipesBottom.remove(allPipesBottom[0], true, true);
      }
    }
  }
}

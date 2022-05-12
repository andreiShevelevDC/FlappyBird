// import PhaserLogo from '../objects/phaserLogo'
// import FpsText from '../objects/fpsText'
import * as constant from './../constant'

import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  //fpsText

  gameState: number = constant.GAME_STATE_FINISH;
  gameSpeed: number = constant.GAME_WIDTH * constant.ACCELERATION;

  pipesTop!: Phaser.GameObjects.Group;
  pipesBottom!: Phaser.GameObjects.Group;
  bird!: Phaser.Physics.Arcade.Sprite;

  spacebarKey!: Phaser.Input.Keyboard.Key;
  escapeKey!: Phaser.Input.Keyboard.Key;

  pauseMessage!: Phaser.GameObjects.Text;
  finishMessage!: Phaser.GameObjects.Text;
  scoreMessage!: Phaser.GameObjects.Text;

  counter: number = 0;
  counterSpeedUp: number = 1;

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    // this.fpsText = new FpsText(this)
    //
    // // display the Phaser.VERSION
    // this.add
    //   .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
    //     color: '#000000',
    //     fontSize: '24px'
    //   })
    //   .setOrigin(1, 0)

    this.add.image(0, 0, "image_back").setOrigin(0, 0);

    this.pipesTop = this.physics.add.staticGroup();
    this.pipesBottom = this.physics.add.staticGroup();

    this.makeBird(this.physics, this.anims);

    //this.physics.add.collider(bird, pipes, birdCollide, null, this);
    this.physics.add.overlap(
        this.bird,
        this.pipesTop,
        this.birdOverlap,
        undefined,
        this
    );
    this.physics.add.overlap(
        this.bird,
        this.pipesBottom,
        this.birdOverlap,
        undefined,
        this
    );

    this.spacebarKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.escapeKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
    );
    //this.input.keyboard.on('keydown-SPACE', birdFlap);
    //this.input.on('pointerdown', birdFlap);

    this.pauseMessage = this.add.text(
        constant.GAME_WIDTH / 5,
        constant.GAME_HEIGHT / 2 - 40,
        constant.PAUSE_MESSAGE_TEXT,
        constant.MESSAGE_STYLE
    );

    this.finishMessage = this.add.text(
        constant.GAME_WIDTH / 5,
        constant.GAME_HEIGHT / 2 - 40,
        constant.FINISH_MESSAGE_TEXT,
        constant.MESSAGE_STYLE
    );

    this.scoreMessage = this.add.text(
        constant.GAME_WIDTH - constant.GAME_WIDTH / 6,
        30,
        constant.SCORE_MESSAGE_TEXT + this.counter,
        constant.SCORE_STYLE
    );

    this.gameRestart();
  }

  makeBird(
      physics: Phaser.Physics.Arcade.ArcadePhysics,
      anims: Phaser.Animations.AnimationManager
  ): void {
    this.bird = physics.add
        .sprite(constant.BIRD_POS_X, constant.BIRD_POS_Y, "spritesheet_bird")
        .setScale(2);
    this.bird.setBounce(0.2);
    //bird.setCollideWorldBounds(true);

    anims.create({
      key: "flap",
      frames: anims.generateFrameNumbers("spritesheet_bird", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: 1,
    });
  }

  birdFlap(): void {
    //console.log("flap");
    if (this.gameState === constant.GAME_STATE_PAUSE) {
      this.setPlay();
    }

    this.bird.setVelocityY(-constant.FLAP_VELOCITY);
  }

  // game finished!
  birdOverlap(): void {
    //setPause();
    //console.log("Overlap");

    this.gameState = constant.GAME_STATE_FINISH;

    // death 'animation'
    this.bird.setVelocityY(constant.FLAP_VELOCITY);
    this.bird.setCollideWorldBounds(false);

    this.scoreMessage.setVisible(false);

    this.finishMessage.setText(
        "Your score: " + this.counter + "\n" + constant.FINISH_MESSAGE_TEXT
    );
    this.finishMessage.setVisible(true);
  }

  gameRestart(): void {
    this.finishMessage.setVisible(false);

    this.clearPipes();

    this.counter = 0;
    this.scoreMessage.setText(constant.SCORE_MESSAGE_TEXT + this.counter);
    this.scoreMessage.setVisible(true);

    this.counterSpeedUp = 1;

    this.bird.setCollideWorldBounds(true);
    this.bird.setPosition(constant.BIRD_POS_X, constant.BIRD_POS_Y);

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

      //allPipes = pipes.getChildren();
    }
  }

  prevHoleCenter: number = constant.GAME_HEIGHT / 2;

  addPipes(): void {
    // clamps center of the hole to fit it whole on the screen
    // while making it's not too different in position from previous hole
    const findCenter = (holeWidth: number): number => {
      const RAND_Y = Math.random() * constant.GAME_HEIGHT;

      let center: number = Math.min(
          RAND_Y,
          constant.GAME_HEIGHT - holeWidth / 2,
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

    this.pipesTop.create(
        constant.GAME_WIDTH + constant.PIPE_WIDTH / 2,
        holeCenter - (holeWidth + constant.PIPE_HEIGHT) / 2,
        "image_pipe"
    );

    this.pipesBottom.create(
        constant.GAME_WIDTH + constant.PIPE_WIDTH / 2,
        holeCenter + (holeWidth + constant.PIPE_HEIGHT) / 2,
        "image_pipe_bottom"
    );
  }

  setPause(): void {
    //console.log(" * Pause");

    this.gameState = constant.GAME_STATE_PAUSE;
    //GAME.scene.pause('default');

    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(constant.GRAVITY_ZERO);
    this.bird.setVelocityY(0);

    this.pauseMessage.setVisible(true);
  }

  setPlay(): void {
    //console.log(" * Play");

    this.gameState = constant.GAME_STATE_PLAY;

    this.pauseMessage.setVisible(false);

    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(constant.GRAVITY);
  }

  pollKeyboard(): void {
    if (
        Phaser.Input.Keyboard.JustDown(this.escapeKey) &&
        this.gameState === constant.GAME_STATE_PLAY
    ) {
      this.setPause();
    }

    if (Phaser.Input.Keyboard.JustDown(this.spacebarKey)) {
      if (this.gameState !== constant.GAME_STATE_FINISH) {
        this.birdFlap();
        this.bird.anims.play("flap");
      } else this.gameRestart();
    }
  }

  update() {
    //this.fpsText.update()
    this.pollKeyboard();

    if (this.gameState === constant.GAME_STATE_PLAY) {
      let allPipesTop: Phaser.GameObjects.GameObject[] = this.pipesTop.getChildren();
      let allPipesBottom: Phaser.GameObjects.GameObject[] = this.pipesBottom.getChildren();

      for (let i = 0; i < allPipesTop.length; i++) {
        // moving pipes RTL
        (allPipesTop[i] as Phaser.Physics.Arcade.Sprite).x -= this.gameSpeed;
        (allPipesBottom[i] as Phaser.Physics.Arcade.Sprite).x -= this.gameSpeed;

        (allPipesTop[i] as Phaser.Physics.Arcade.Sprite).refreshBody();
        (allPipesBottom[i] as Phaser.Physics.Arcade.Sprite).refreshBody();

        // count the pipes pair that the bird has passed through
        if (
            (allPipesTop[i] as Phaser.Physics.Arcade.Sprite).x <=
            constant.BIRD_POS_X &&
            (allPipesTop[i] as Phaser.Physics.Arcade.Sprite).x >=
            constant.BIRD_POS_X - this.gameSpeed - 1
        ) {
          this.counter++;
          this.scoreMessage.setText(constant.SCORE_MESSAGE_TEXT + this.counter);
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

      //console.log(allPipesTop.length);

      // destroys the first pair of pipes if it moved out of screen
      if (
          allPipesTop.length !== 0 &&
          (allPipesTop[0] as Phaser.Physics.Arcade.Sprite).x <
          -constant.PIPE_WIDTH / 2
      ) {
        this.pipesTop.remove(allPipesTop[0], true, true);
        this.pipesBottom.remove(allPipesBottom[0], true, true);
      }
    }
  }
}

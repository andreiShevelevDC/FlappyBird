import * as constant from "./../constant";
import { BirdComponent } from "../views/bird-component";
import { PipeComponent } from "../views/pipe-component";
import { Background } from "../views/background";
import { Hud } from "../views/hud";
import { Utility } from "../views/utility";

enum GAME_STATE {
  PLAY,
  PAUSE,
  FINISH,
}

export default class MainScene extends Phaser.Scene {
  private readonly ACCELERATION = 0.005;
  private readonly GRAVITY = 400;
  private readonly GRAVITY_ZERO = 0;
  private readonly FLAP_VELOCITY = 200;

  private verticalMode: boolean = window.innerHeight > window.innerWidth;
  private gameState: number = GAME_STATE.FINISH;
  private gameSpeed: number = constant.GAME_SIZE_SHORT * this.ACCELERATION;
  private background: Background;
  private pipesTop: Phaser.GameObjects.Group;
  private pipesBottom: Phaser.GameObjects.Group;
  private bird: BirdComponent;
  private spacebarKey: Phaser.Input.Keyboard.Key;
  private escapeKey: Phaser.Input.Keyboard.Key;
  private hud: Hud;
  private scoreSpeedUpStep: number = 1;

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    //new Utility(this);
    this.changeOrientation();
    this.background = new Background(this);
    this.rebuildWorldAndHud();
    this.pipesTop = this.physics.add.staticGroup();
    this.pipesBottom = this.physics.add.staticGroup();
    this.bird = new BirdComponent(this);
    this.createBirdPipesCollision();
    this.hud = new Hud(this);
    this.resetGame();
    this.attachListeners();
    this.setAsPaused();
  }

  private rebuildWorldAndHud() {
    this.background.buildBackground(this);
    this.attachClickListenerToBackground();
  }

  private createBirdPipesCollision(): void {
    //this.physics.add.collider(this.bird, this.pipesTop, this.birdOverlap, undefined, this);
    this.physics.add.overlap(
      this.bird,
      this.pipesTop,
      this.finishGame,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.bird,
      this.pipesBottom,
      this.finishGame,
      undefined,
      this
    );
  }

  private birdFlap(): void {
    //console.log("flap");
    if (this.gameState === GAME_STATE.PAUSE) {
      this.setPlay();
    }
    this.bird.setVelocityY(-this.FLAP_VELOCITY);
  }

  private finishGame(): void {
    if (this.gameState !== GAME_STATE.FINISH) {
      this.gameState = GAME_STATE.FINISH;
      this.bird.setVelocityY(this.FLAP_VELOCITY); // death 'animation'
      this.hud.finishGame();
    }
  }

  private resetGame(): void {
    this.clearPipesOnFinish();
    this.scoreSpeedUpStep = 1;
    this.bird.resetPosition();
    this.addPipes();
    this.setAsPaused();
  }

  private clearPipesOnFinish(): void {
    let allPipesTop: Phaser.GameObjects.GameObject[] =
      this.pipesTop.getChildren();
    let allPipesBottom: Phaser.GameObjects.GameObject[] =
      this.pipesBottom.getChildren();
    while (allPipesTop.length > 0) {
      this.pipesTop.remove(allPipesTop[0], true, true);
      this.pipesBottom.remove(allPipesBottom[0], true, true);
    }
  }

  private readonly PIPE_NUM = 1.5; //3.2;
  private readonly HOLE_GAP_STEP = constant.GAME_SIZE_LONG / this.PIPE_NUM;
  // vertical hole (distance between top and bottom pipe) sizes
  private readonly HOLE_SIZE = [
    (this.HOLE_GAP_STEP * this.PIPE_NUM) / 1.2,
    (this.HOLE_GAP_STEP * this.PIPE_NUM) / 1.6,
    (this.HOLE_GAP_STEP * this.PIPE_NUM) / 2,
    (this.HOLE_GAP_STEP * this.PIPE_NUM) / 3,
    (this.HOLE_GAP_STEP * this.PIPE_NUM) / 4,
  ];
  // clamps center of the hole to fit it whole on the screen
  // while making it's not too different in position from previous hole
  private prevHoleCenter: number = (constant.GAME_SIZE_LONG - 50) / 2;
  private findHoleCenter = (holeWidth: number): number => {
    const RAND_Y = (Math.random() * constant.GAME_SIZE_LONG) / 1.3;
    let center: number = Math.min(
      RAND_Y,
      constant.GAME_SIZE_LONG / 1.3 - holeWidth / 2,
      this.prevHoleCenter + this.HOLE_GAP_STEP
    );
    center = Math.max(
      center,
      holeWidth / 2,
      this.prevHoleCenter - this.HOLE_GAP_STEP
    );
    return center;
  };

  // hole sizes (index from HOLE_SIZE)
  // number of repetitions of each value affects probability of appearing
  private readonly HOLE_DIFFICULTY = [
    1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4,
  ];

  private addPipes(): void {
    // HOLE_SIZE.forEach(size => console.log(size));
    // let a = 20;
    // while(a > 0) {
    //     let randWidth = HOLE_SIZE[HOLE_DIFFICULTY[Math.floor(Math.random() * HOLE_DIFFICULTY.length)]];
    //     //console.log(randWidth);
    //     let holeWidth = HOLE_SIZE[HOLE_DIFFICULTY[Math.floor(Math.random() * HOLE_DIFFICULTY.length)]];
    //     console.log(holeWidth, findHoleCenter(Math.random() * GAME_HEIGHT, holeWidth));
    //     a--;
    // }
    let holeWidth: number =
      this.HOLE_SIZE[
        this.HOLE_DIFFICULTY[
          Math.floor(Math.random() * this.HOLE_DIFFICULTY.length)
        ]
      ];
    let holeCenter = this.findHoleCenter(holeWidth);
    //console.log(holeCenter, " / ", holeWidth);
    this.prevHoleCenter = holeCenter;
    this.pipesTop.add(
      new PipeComponent(
        this,
        true,
        holeCenter - (holeWidth + PipeComponent.PIPE_HEIGHT) / 2
      )
    );
    this.pipesBottom.add(
      new PipeComponent(
        this,
        false,
        holeCenter + (holeWidth + PipeComponent.PIPE_HEIGHT) / 2
      )
    );
  }

  private setAsPaused(): void {
    //console.log(" * Pause");
    this.gameState = GAME_STATE.PAUSE;
    this.bird.hide();
    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(
      this.GRAVITY_ZERO
    );
    this.bird.setVelocityY(0);
    this.hud.pauseGame();
  }

  private setPlay(): void {
    //console.log(" * Play");
    this.gameState = GAME_STATE.PLAY;
    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(this.GRAVITY);
    this.bird.show();
    this.hud.playGame();
  }

  private attachListeners(): void {
    this.spacebarKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.escapeKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    //this.input.keyboard.on('keydown-SPACE', birdFlap);
    //this.input.on('pointerdown', birdFlap);
    this.scale.on("resize", () => this.changeOrientation());
  }

  private attachClickListenerToBackground(): void {
    let backs = this.background.getBackground();
    backs.forEach((bck) =>
      bck.setInteractive().on("pointerdown", () => this.onClick())
    );
  }

  private pollKeyboard(): void {
    if (
      Phaser.Input.Keyboard.JustDown(this.escapeKey) &&
      this.gameState === GAME_STATE.PLAY
    ) {
      this.setAsPaused();
    }
    if (Phaser.Input.Keyboard.JustDown(this.spacebarKey)) {
      if (this.gameState !== GAME_STATE.FINISH) {
        this.birdFlap();
        this.bird.anims.play("flap");
      } else this.resetGame();
    }
  }

  private onClick(): void {
    switch (this.gameState) {
      case GAME_STATE.PLAY:
      case GAME_STATE.PAUSE:
        this.birdFlap();
        this.bird.anims.play("flap");
        break;
      case GAME_STATE.FINISH:
        this.resetGame();
    }
  }

  private countScore(currPipe: PipeComponent): void {
    if (currPipe.isInCounterWindow(this.gameSpeed)) {
      this.hud.updateScore();
    }
  }

  // speeding up every number of score points/gates
  private speedGameUp(): void {
    const SPEEDUP_THRESHOLD = 10;
    let currScore: number = this.hud.getScore();
    if (
      currScore > this.scoreSpeedUpStep &&
      currScore % SPEEDUP_THRESHOLD === 0
    ) {
      this.gameSpeed += this.gameSpeed * this.ACCELERATION * 50;
      //console.log(gameSpeed);
      this.scoreSpeedUpStep = currScore;
    }
  }

  private destroyInvisiblePipes(
    allPipesTop: Phaser.GameObjects.GameObject[],
    allPipesBottom: Phaser.GameObjects.GameObject[]
  ): void {
    if (
      allPipesTop.length !== 0 &&
      (allPipesTop[0] as PipeComponent).isOutOfWindow()
    ) {
      this.pipesTop.remove(allPipesTop[0], true, true);
      this.pipesBottom.remove(allPipesBottom[0], true, true);
    }
  }

  update() {
    this.pollKeyboard();
    if (this.gameState === GAME_STATE.PLAY) {
      if (this.bird.isOutOfScreen()) this.finishGame();
      this.background.doParallax(this.gameSpeed);
      let allPipesTop: Phaser.GameObjects.GameObject[] =
        this.pipesTop.getChildren();
      let allPipesBottom: Phaser.GameObjects.GameObject[] =
        this.pipesBottom.getChildren();
      for (let i = 0; i < allPipesTop.length; i++) {
        (allPipesTop[i] as PipeComponent).move(this.gameSpeed);
        (allPipesBottom[i] as PipeComponent).move(this.gameSpeed);
        this.countScore(allPipesTop[i] as PipeComponent);
        // create a new pair of pipes,
        // if the last (newest) pair has moved more than PIPE_GAP_STEP
        const PIPE_GAP_STEP = constant.GAME_SIZE_SHORT / this.PIPE_NUM;
        if (
          i === allPipesTop.length - 1 &&
          (allPipesTop[i] as Phaser.Physics.Arcade.Sprite).x <
            constant.GAME_SIZE_SHORT - PIPE_GAP_STEP
        )
          this.addPipes();
      }
      this.speedGameUp();
      this.destroyInvisiblePipes(allPipesTop, allPipesBottom);
    }
  }

  changeOrientation(
    orientation: boolean = window.innerWidth > window.innerHeight
  ) {
    if (!orientation && !this.verticalMode) {
      this.verticalMode = true;
      this.scale.setGameSize(constant.GAME_SIZE_SHORT, constant.GAME_SIZE_LONG);
      this.rebuildWorldAndHud();
    }
    if (orientation && this.verticalMode) {
      this.verticalMode = false;
      this.scale.setGameSize(constant.GAME_SIZE_LONG, constant.GAME_SIZE_SHORT);
      this.rebuildWorldAndHud();
    }
  }
}

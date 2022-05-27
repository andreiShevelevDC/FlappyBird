import * as constant from "./../constant";
import { BirdComponent } from "../views/bird-component";
import { PipeComponent } from "../views/pipe-component";
import { Background } from "../views/background";
import { Hud } from "../views/hud";
import { getSizeX, getCenterY, getSizeY, Utility } from "../views/utility";

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
  private baseTiles: Phaser.GameObjects.Group;
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
    this.background = new Background();
    this.hud = new Hud(this);
    this.bird = new BirdComponent(this);
    this.preparePipes();
    this.rebuildWorldAndHud();
    this.resetGame();
    this.attachListeners();
    this.setPause();
  }

  private rebuildWorldAndHud(): void {
    this.background.buildBackground(this);
    this.baseTiles = this.physics.add.staticGroup();
    this.background.getBase().forEach((base) => this.baseTiles.add(base));
    this.makeBirdCollision(this.baseTiles);
    this.attachClickListenerToBackground();
    this.hud.updatePosition();
    this.updateHoleSizes();
  }

  private preparePipes(): void {
    this.pipesTop = this.physics.add.staticGroup();
    this.pipesBottom = this.physics.add.staticGroup();
    this.makeBirdCollision(this.pipesTop);
    this.makeBirdCollision(this.pipesBottom);
    //this.makeBirdCollision(this.baseTiles); //this.background.getBase()); - Works even with this, but need baseTiles Group anyway!
  }

  private makeBirdCollision(
    objects: Phaser.GameObjects.Group | Array<Phaser.GameObjects.GameObject>
  ): void {
    this.physics.add.overlap(
      this.bird,
      objects,
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
    this.setPause();
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

  //private readonly PIPE_NUM = 1.5; //3.2;
  private readonly PIPE_X_DISTANCE = constant.GAME_SIZE_SHORT / 1.8;
  private readonly SMALLEST_GAP = 100;
  private readonly BASE_HEIGHT = 80;
  private biggestGap: number;
  private gapStep: number;
  private holeSizes: number[] = [];

  private updateHoleSizes(): void {
    this.biggestGap = getSizeY() - this.SMALLEST_GAP - this.BASE_HEIGHT;
    this.gapStep = (this.biggestGap - this.SMALLEST_GAP) / 3;
    this.holeSizes = [
      this.biggestGap,
      this.biggestGap - this.gapStep,
      this.biggestGap - this.gapStep * 2,
      this.SMALLEST_GAP,
    ];
  }

  private prevHoleCenter: number = getCenterY() - this.BASE_HEIGHT / 2;

  // clamps center of the hole to fit it whole on the screen
  // while making it's not too different in position from previous hole
  private findHoleCenter = (holeWidth: number): number => {
    const RAND_Y = Math.random() * (getSizeY() - this.BASE_HEIGHT);
    let center: number = Math.max(
      RAND_Y,
      holeWidth / 2,
      this.prevHoleCenter - getSizeY() / 2.5, // to exclude dramatic height change for small gaps
      getSizeY() - this.BASE_HEIGHT - holeWidth / 2 - PipeComponent.PIPE_HEIGHT // to exclude wrong side gaps
    );
    center = Math.min(
      center,
      getSizeY() - holeWidth / 2 - this.BASE_HEIGHT,
      this.prevHoleCenter + getSizeY() / 2.5,
      holeWidth / 2 + PipeComponent.PIPE_HEIGHT
    );
    return center;
  };

  // hole sizes (index from holeSizes)
  // number of repetitions of each value affects probability of appearing
  private readonly HOLE_DIFFICULTY = [
    0, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3,
  ];

  private addPipes(): void {
    // holeSizes.forEach(size => console.log(size));
    // let a = 20;
    // while(a > 0) {
    //     let randWidth = holeSizes[HOLE_DIFFICULTY[Math.floor(Math.random() * HOLE_DIFFICULTY.length)]];
    //     //console.log(randWidth);
    //     let holeWidth = holeSizes[HOLE_DIFFICULTY[Math.floor(Math.random() * HOLE_DIFFICULTY.length)]];
    //     console.log(holeWidth, findHoleCenter(Math.random() * GAME_HEIGHT, holeWidth));
    //     a--;
    // }
    let holeWidth: number =
      this.holeSizes[
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

  private setPause(): void {
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
      this.setPause();
    }
    if (Phaser.Input.Keyboard.JustDown(this.spacebarKey))
      this.userPrimaryInputReaction();
  }

  private onClick(): void {
    //console.log(this.gameState);
    this.userPrimaryInputReaction();
  }

  // Left button click or SPACE press
  private userPrimaryInputReaction(): void {
    switch (this.gameState) {
      case GAME_STATE.PLAY:
        this.birdFlap();
        this.bird.anims.play("flap");
        break;
      case GAME_STATE.PAUSE:
        this.setPlay();
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
      }
      // create a new pair of pipes,
      if (
        (allPipesTop[allPipesTop.length - 1] as Phaser.Physics.Arcade.Sprite)
          .x <
        getSizeX() - this.PIPE_X_DISTANCE
      )
        this.addPipes();
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
      this.bird.updateYPositionOnOrientationChange();
    }
    if (orientation && this.verticalMode) {
      this.verticalMode = false;
      this.scale.setGameSize(constant.GAME_SIZE_LONG, constant.GAME_SIZE_SHORT);
      this.rebuildWorldAndHud();
      this.bird.updateYPositionOnOrientationChange();
    }
  }
}

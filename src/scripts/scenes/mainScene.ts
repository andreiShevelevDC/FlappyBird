import * as constant from './../constant'
import {BirdComponent} from "../views/bird-component";
import {PipeComponent} from "../views/pipe-component";
import {Background} from "../views/background";
import {Hud} from "../views/hud";

export default class MainScene extends Phaser.Scene {
  gameState: number = constant.GAME_STATE.FINISH;
  gameSpeed: number = constant.GAME_WIDTH * constant.ACCELERATION;
  background: Background;
  pipesTop!: Phaser.GameObjects.Group;
  pipesBottom!: Phaser.GameObjects.Group;
  bird!: BirdComponent;
  spacebarKey!: Phaser.Input.Keyboard.Key;
  escapeKey!: Phaser.Input.Keyboard.Key;
  hud!: Hud;
  counter: number = 0;
  counterSpeedUpStep: number = 1;

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.background = new Background(this);
    this.pipesTop = this.physics.add.staticGroup();
    this.pipesBottom = this.physics.add.staticGroup();
    this.bird = new BirdComponent(this);
    this.createBirdPipesCollision();
    this.hud = new Hud(this);
    this.resetGame();
    this.attachListeners();
    this.setAsPaused();
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
    if (this.gameState === constant.GAME_STATE.PAUSE) {
      this.setPlay();
    }
    this.bird.setVelocityY(-constant.FLAP_VELOCITY);
  }

  private finishGame(): void {
    if (this.gameState !== constant.GAME_STATE.FINISH) {
      this.gameState = constant.GAME_STATE.FINISH;
      this.bird.setVelocityY(constant.FLAP_VELOCITY); // death 'animation'
      this.hud.finishGame();
    }
  }

  private resetGame(): void {
    this.clearPipesOnFinish();
    this.counter = 0;
    this.counterSpeedUpStep = 1;
    this.bird.resetPosition();
    this.addPipes();
  }

  clearPipesOnFinish(): void {
    let allPipesTop: Phaser.GameObjects.GameObject[] = this.pipesTop.getChildren();
    let allPipesBottom: Phaser.GameObjects.GameObject[] = this.pipesBottom.getChildren();
    while (allPipesTop.length > 0) {
      this.pipesTop.remove(allPipesTop[0], true, true);
      this.pipesBottom.remove(allPipesBottom[0], true, true);
    }
  }

  // clamps center of the hole to fit it whole on the screen
  // while making it's not too different in position from previous hole
  private prevHoleCenter: number = (constant.GAME_HEIGHT - 50) / 2;
  private findHoleCenter = (holeWidth: number): number => {
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
        constant.HOLE_SIZE[constant.HOLE_DIFFICULTY[Math.floor(Math.random() * constant.HOLE_DIFFICULTY.length)]];
    let holeCenter = this.findHoleCenter(holeWidth);
    //console.log(holeCenter, " / ", holeWidth);
    this.prevHoleCenter = holeCenter;
    this.pipesTop.add(new PipeComponent(this, true,
        holeCenter - (holeWidth + PipeComponent.PIPE_HEIGHT) / 2));
    this.pipesBottom.add(new PipeComponent(this, false,
        holeCenter + (holeWidth + PipeComponent.PIPE_HEIGHT) / 2));
  }

  private setAsPaused(): void {
    //console.log(" * Pause");
    this.gameState = constant.GAME_STATE.PAUSE;
    this.bird.hide();
    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(constant.GRAVITY_ZERO);
    this.bird.setVelocityY(0);
    this.hud.pauseGame();
  }

  private setPlay(): void {
    //console.log(" * Play");
    this.gameState = constant.GAME_STATE.PLAY;
    (this.bird.body as Phaser.Physics.Arcade.Body).setGravityY(constant.GRAVITY);
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
    let backs = this.background.getBackground();
    backs.forEach(bck =>
        bck.setInteractive().on("pointerdown", () => this.onClick())
    );
  }

  private pollKeyboard(): void {
    if (
        Phaser.Input.Keyboard.JustDown(this.escapeKey) &&
        this.gameState === constant.GAME_STATE.PLAY
    ) {
      this.setAsPaused();
    }
    if (Phaser.Input.Keyboard.JustDown(this.spacebarKey)) {
      if (this.gameState !== constant.GAME_STATE.FINISH) {
        this.birdFlap();
        this.bird.anims.play("flap");
      } else
        this.resetGame();
    }
  }

  private onClick(): void {
    switch (this.gameState) {
      case constant.GAME_STATE.PLAY:
      case constant.GAME_STATE.PAUSE:
        this.birdFlap();
        this.bird.anims.play("flap");
        break;
      case constant.GAME_STATE.FINISH:
        this.resetGame();
    }
  }

  private countScore(): void {
    if ((allPipesTop[i] as PipeComponent).isInCounterWindow(this.gameSpeed)) {
      this.counter++;
      this.hud.updateScore();
    }
  }

  // speeding up every 10 gates
  private speedGameUp(): void {
    if (this.counter > this.counterSpeedUpStep && this.counter % 10 === 0) {
      this.gameSpeed += this.gameSpeed * constant.ACCELERATION * 50;
      //console.log(gameSpeed);
      this.counterSpeedUpStep = this.counter;
    }
  }

  private destroyInvisiblePipes(
      allPipesTop: Phaser.GameObjects.GameObject[],
      allPipesBottom: Phaser.GameObjects.GameObject[]): void {
    if (allPipesTop.length !== 0 && ((allPipesTop[0] as PipeComponent).isOutOfWindow())) {
      this.pipesTop.remove(allPipesTop[0], true, true);
      this.pipesBottom.remove(allPipesBottom[0], true, true);
    }
  }

  update() {
    this.pollKeyboard();
    if (this.gameState === constant.GAME_STATE.PLAY) {
      if(this.bird.isOutOfScreen()) this.finishGame();
      this.background.doParallax(this.gameSpeed);
      let allPipesTop: Phaser.GameObjects.GameObject[] = this.pipesTop.getChildren();
      let allPipesBottom: Phaser.GameObjects.GameObject[] = this.pipesBottom.getChildren();
      for (let i = 0; i < allPipesTop.length; i++) {
        (allPipesTop[i] as PipeComponent).move(this.gameSpeed);
        (allPipesBottom[i] as PipeComponent).move(this.gameSpeed);
        this.countScore();
        // create a new pair of pipes,
        // if the last (newest) pair has moved more than PIPE_GAP_STEP
        if (i === allPipesTop.length - 1 &&
            (allPipesTop[i] as Phaser.Physics.Arcade.Sprite).x < constant.GAME_WIDTH - constant.PIPE_GAP_STEP)
          this.addPipes();
      }
      this.speedGameUp();
      this.destroyInvisiblePipes(allPipesTop, allPipesBottom);
    }
  }
}

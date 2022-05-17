//import Phaser from "phaser";

export const GAME_WIDTH = 288;
export const GAME_HEIGHT = 512;

export enum GAME_STATE {
  PLAY,
  PAUSE,
  FINISH
}

export const TEXTURES = "mainAtlas";

export const SPRITESHEET_BIRD = "spritesheet_bird";

export const BIRD_POS_X = GAME_WIDTH / 4;
export const BIRD_POS_Y = GAME_HEIGHT / 2 - 100;

export const BIRD_SCALE = 1;//1.35;

// starting pipes horizontal shift speed per update call
export const ACCELERATION = 0.003;
export const GRAVITY = 400;
export const GRAVITY_ZERO = 0;
export const FLAP_VELOCITY = 250;

export const IMAGE_PIPE = "pipe-2.png";
export const IMAGE_PIPE_BOTTOM = "pipe-1.png";

export const PIPE_NUM = 1.5;//3.2;
export const PIPE_GAP_STEP = GAME_WIDTH / PIPE_NUM;
export const HOLE_GAP_STEP = GAME_HEIGHT / PIPE_NUM;

export const MESSAGE_STYLE = {
  font: "24px Courier",
  fill: "#ff0000",
  align: "center",
};
export const PAUSE_MESSAGE_TEXT = "Press SPACE to play\n\nESCAPE to pause";
export const FINISH_MESSAGE_TEXT = "Game Finished!\n\nPress SPACE\nto restart";

export const SCORE_STYLE = {
  font: "20px Courier",
  fontStyle: "strong",
  fill: "#00ff00",
  align: "right",
};
export const SCORE_MESSAGE_TEXT = "Score:";

// vertical hole (distance between top and bottom pipe) sizes
export const HOLE_SIZE = [
  HOLE_GAP_STEP * PIPE_NUM,
  (HOLE_GAP_STEP * PIPE_NUM) / 1.5,
  (HOLE_GAP_STEP * PIPE_NUM) / 2,
  (HOLE_GAP_STEP * PIPE_NUM) / 3,
  (HOLE_GAP_STEP * PIPE_NUM) / 4,
];

// hole sizes (index from HOLE_SIZE)
// number of repetitions of each value affects probability of appearing
export const HOLE_DIFFICULTY = [
  0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4,
];

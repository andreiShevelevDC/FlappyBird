//import Phaser from "phaser";

export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 512;

export enum GAME_STATE {
  PLAY,
  PAUSE,
  FINISH
}

export enum ENTITIES_DEPTH {
  BACKGROUND = 0,
  BIRD = 1,
  BASE = 2,
  PIPES = 2,
  UI = 3
}

export const TEXTURES = "mainAtlas";

export const SPRITESHEET_BIRD = "spritesheet_bird";

export const BIRD_POS_X = GAME_WIDTH / 4;
export const BIRD_POS_Y = GAME_HEIGHT / 2 - 100;

export const BIRD_SCALE = 1;//1.35;

// starting pipes horizontal shift speed per update call
export const ACCELERATION = 0.005;
export const GRAVITY = 400;
export const GRAVITY_ZERO = 0;
export const FLAP_VELOCITY = 200;

export const IMAGE_PIPE = "pipe-2.png";
export const IMAGE_PIPE_BOTTOM = "pipe-1.png";

export const PIPE_NUM = 1.5;//3.2;
export const PIPE_GAP_STEP = GAME_WIDTH / PIPE_NUM;
export const HOLE_GAP_STEP = GAME_HEIGHT / PIPE_NUM;

export const FINISH_MESSAGE_STYLE = {
  font: "18px Verdana",
  fill: "#fff",
  align: "center",
};
export const PAUSE_MESSAGE_TEXT = "Press SPACE to play\n\nESCAPE to pause";
export const FINISH_SCORE_TEXT = "Your score:";
export const FINISH_RESTART_TEXT = "Click or Press SPACE\nto restart";

export const SCORE_STYLE = {
  font: "16px Verdana",
  fontStyle: "strong",
  fill: "#ff0000",
  align: "right",
};
export const SCORE_MESSAGE_TEXT = "Score:";

// vertical hole (distance between top and bottom pipe) sizes
export const HOLE_SIZE = [
  HOLE_GAP_STEP * PIPE_NUM / 1.2,
  HOLE_GAP_STEP * PIPE_NUM / 1.6,
  HOLE_GAP_STEP * PIPE_NUM / 2,
  HOLE_GAP_STEP * PIPE_NUM / 3,
  HOLE_GAP_STEP * PIPE_NUM / 4,
];

// hole sizes (index from HOLE_SIZE)
// number of repetitions of each value affects probability of appearing
export const HOLE_DIFFICULTY = [
  0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4
];

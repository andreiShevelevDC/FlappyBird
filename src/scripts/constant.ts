export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export enum GAME_STATE {
  PLAY,
  PAUSE,
  FINISH
}

export const BIRD_POS_X = GAME_WIDTH / 4;
export const BIRD_POS_Y = GAME_HEIGHT / 2 - 100;

// starting pipes horizontal shift speed per update call
export const ACCELERATION = 0.003;
export const GRAVITY = 400;
export const GRAVITY_ZERO = 0;
export const FLAP_VELOCITY = 250;

// TODO: can I get sizes from image itself?
export const PIPE_WIDTH = 60;
export const PIPE_HEIGHT = 530;

export const PIPE_NUM = 3.2;
export const PIPE_GAP_STEP = GAME_WIDTH / PIPE_NUM;
export const HOLE_GAP_STEP = GAME_HEIGHT / PIPE_NUM;

export const MESSAGE_STYLE = {
  font: "32px Courier",
  fill: "#ff0000",
  align: "center",
};
export const PAUSE_MESSAGE_TEXT = "Press SPACE to play\n\nESCAPE to pause";
export const FINISH_MESSAGE_TEXT = "Game Finished!\n\nPress SPACE to restart";

export const SCORE_STYLE = {
  font: "24px Courier",
  fontStyle: "strong",
  fill: "#00ff00",
  align: "right",
};
export const SCORE_MESSAGE_TEXT = "Score: ";

// vertical hole sizes
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

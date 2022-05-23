export const GAME_SIZE_SHORT = 320;
export const GAME_SIZE_LONG = 512;

export enum ENTITIES_DEPTH {
  BACKGROUND = 0,
  BIRD = 1,
  BASE = 3,
  PIPES = 2,
  HUD = 4,
}

export const TEXTURES = "mainAtlas";
export const SPRITESHEET_BIRD = "spritesheet_bird";

export const BIRD_POS_X = GAME_SIZE_SHORT / 4;
export const BIRD_POS_Y = GAME_SIZE_LONG / 2 - 100;

export const MESSAGE_STYLE = {
  font: "18px Verdana",
  fill: "#fff",
  align: "center",
};

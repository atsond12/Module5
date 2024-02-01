"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------

import { TGameBoard } from "./gameBoard.js";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const SheetData = {
  Board: {
    TopLeft: { x: 0, y: 0, width: 163, height: 133, count: 1 },
    TopMiddle: { x: 163, y: 0, width: 134, height: 133, count: 1 },
    TopRight: { x: 297, y: 0, width: 163, height: 133, count: 1 },
    LeftMiddle: { x: 0, y: 133, width: 21, height: 243, count: 1 },
    RightMiddle: { x: 439, y: 133, width: 21, height: 243, count: 1 },
    BottomLeft: { x: 0, y: 377, width: 21, height: 21, count: 1 },
    BottomMiddle: { x: 21, y: 377, width: 417, height: 21, count: 1 },
    BottomRight: { x: 439, y: 377, width: 21, height: 21, count: 1 },
  },
  ButtonTile: { x: 0, y: 482, width: 50, height: 50, count: 6 },
  ButtonSmiley: { x: 0, y: 532, width: 82, height: 82, count: 4 },
  Numbers: { x: 0, y: 398, width: 46, height: 84, count: 10 },
};

const Difficulty = {
  Level_1: { Tiles: { Row: 10, Col: 10 }, Mines: 10, caption: "Level 1" },
  Level_2: { Tiles: { Row: 15, Col: 15 }, Mines: 50, caption: "Level 2" },
  Level_3: { Tiles: { Row: 20, Col: 30 }, Mines: 100, caption: "Level 3" },
};

const gameProps = {
  gameBoard: null,
};

let gameLevel = Difficulty.Level_1;

let cvs = null;
let ctx = null;
let imgSheet = null;

//                        0        1       2       3         4           5          6        7
const TextColorTable = ["Blue", "Green", "Red", "Purple", "Maroon", "Turquoise", "Black", "Gray"];
const ETileStateType = { Up: 0, Down: 1, Open: 2, Flag: 3, ActiveMine: 4, Mine: 5 };

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.addEventListener("contextmenu", (aEvent) => aEvent.preventDefault());
  ctx = cvs.getContext("2d");
  newGame();
  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
}
//-----------------------------------------------------------------------------------------
function newGame() {
  cvs.width = gameLevel.Tiles.Col * SheetData.ButtonTile.width + SheetData.Board.LeftMiddle.width + SheetData.Board.RightMiddle.width;
  cvs.height = gameLevel.Tiles.Row * SheetData.ButtonTile.height + SheetData.Board.TopMiddle.height + SheetData.Board.BottomMiddle.height;
  gameProps.gameBoard = new TGameBoard(cvs, imgSheet, SheetData.Board);
}


function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  // Draw your game props here
  gameProps.gameBoard.draw();

  requestAnimationFrame(drawGame);
}
//-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
//----------- Events ----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export function initGame(aEvent) {
  console.log("Initializing the game");
  imgSheet = new Image();
  imgSheet.addEventListener("load", imgSheetLoad);
  imgSheet.addEventListener("error", imgSheetError);
  imgSheet.src = "./media/spriteSheet.png";
}
//-----------------------------------------------------------------------------------------

function imgSheetLoad(aEvent) {
  console.log("Sprite Sheet is loaded, game is ready to start!");
  loadGame();
}
//-----------------------------------------------------------------------------------------

function imgSheetError(aEvent) {
  console.log("Error loading Sprite Sheet!", aEvent.target.src);
}
//-----------------------------------------------------------------------------------------

export function setDifficulty(aVent) {
  gameLevel = Difficulty[aVent.target.value];
  newGame();
}

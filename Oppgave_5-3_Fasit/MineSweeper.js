"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import { TPoint } from "../lib/lib2D.js";
import { TSprite, TSpriteButton, TSpriteNumber, clearSpriteEvents } from "../lib/libSprite.js";
import { createTone, ENoteName, EOctave } from "../lib/libSound.js";
import { TGameBoard, TNeighborRange } from "./gameBoard.js";

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

//                        0        1       2       3         4           5          6        7
const TextColorTable = ["Blue", "Green", "Red", "Purple", "Maroon", "Turquoise", "Black", "Gray"];

const gameProps = {
  gameBoard: null,
  tiles: [],
  buttonSmiley: null,
};

let gameLevel = Difficulty.Level_1;

let cvs = null;
let ctx = null;
let imgSheet = null;

const ETileStateType = { Up: 0, Down: 1, Open: 2, Flag: 3, ActiveMine: 4, Mine: 5 };

const EGameStatusType = { Running: 1, GameOver: 2 };
let gameStatus = EGameStatusType.Running;

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function TTile(aRow, aCol) {
  const tile = this;
  const row = aRow;
  const col = aCol;
  const pos = new TPoint(21 + 50 * col, 133 + 50 * row);
  const sp = new TSpriteButton(cvs, imgSheet, SheetData.ButtonTile, pos, null, down, up);
  let state = ETileStateType.Up;
  const neighbors = new TNeighborRange(gameProps.tiles, row, col, gameLevel.Tiles);

  let isMine = false;
  let mineInfo = 0;

  this.draw = function () {
    sp.setIndex(state);
    sp.draw();
    if (state === ETileStateType.Open) {
      if (mineInfo > 0) {
        ctx.font = "36px Verdana";
        ctx.fillStyle = TextColorTable[mineInfo - 1];
        ctx.fillText(mineInfo.toString(), pos.x + 12, pos.y + 36);
      }
    } else if (isMine) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(pos.x + 25, pos.y + 25, 5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  };

  this.incMineInfo = function () {
    mineInfo++;
  };

  function down(aEvent) {
    if (aEvent.button === 0) {
      if (gameStatus === EGameStatusType.Running) {
        state = ETileStateType.Down;
      }
    }
  }

  function up(aEvent) {
    if (aEvent.target.cancel || state !== ETileStateType.Down) {
      state = ETileStateType.Up;
      return;
    }
    if (isMine) {
      state = ETileStateType.ActiveMine;
      setGameOver();
      sp.disabled = true;
    } else {
      tile.open();
    }
  }

  this.open = function () {
    if (state === ETileStateType.Open || state === ETileStateType.ActiveMine) {
      return;
    }
    if (!mineInfo) {
      state = ETileStateType.Open;
      if (gameStatus === EGameStatusType.Running) {
        neighbors.visitAll(openNeighbor);
      }
    } else if (mineInfo) {
      state = ETileStateType.Open;
    }
    if (isMine) {
      state = ETileStateType.Mine;
    }
    sp.disabled = true;
  };

  function openNeighbor(aNeighbor) {
    aNeighbor.open();
  }

  this.isMine = function () {
    return isMine;
  };

  this.setAsMine = function () {
    isMine = true;
    neighbors.visitAll((tile) => tile.incMineInfo());
  };

  this.getSprite = function () {
    return sp.getSprite();
  };
} // End of class TTile

export function TSmiley() {
  const spa = SheetData.ButtonSmiley;
  const pos = new TPoint(0, 0);
  const sp = new TSpriteButton(cvs, imgSheet, spa, pos, newGame);

  this.draw = function () {
    sp.draw();
  };

  this.down = function () {
    sp.setIndex(1);
  };

  this.up = function () {
    sp.setIndex(0);
  };

  this.dead = function () {
    sp.setIndex(2);
  };

  this.resetDestination = function () {
    pos.x = cvs.width / 2 - spa.width / 2;
    pos.y = 22;
    sp.updateDestination(pos.x, pos.y);
  };
} // End of class TSmiley
//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.addEventListener("contextmenu", (aEvent) => aEvent.preventDefault());
  ctx = cvs.getContext("2d");
  gameProps.buttonSmiley = new TSmiley();
  newGame();
  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
}
//-----------------------------------------------------------------------------------------

function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  gameProps.gameBoard.draw();
  //gameProps.tiles.ForEach((tile) => tile.draw());
  for (let row = 0; row < gameProps.tiles.length; row++) {
    const rows = gameProps.tiles[row];
    for (let col = 0; col < rows.length; col++) {
      rows[col].draw();
    }
  }
  gameProps.buttonSmiley.draw();
  requestAnimationFrame(drawGame);
}
//-----------------------------------------------------------------------------------------

function newGame() {
  cvs.width = gameLevel.Tiles.Col * SheetData.ButtonTile.width + SheetData.Board.LeftMiddle.width + SheetData.Board.RightMiddle.width;
  cvs.height = gameLevel.Tiles.Row * SheetData.ButtonTile.height + SheetData.Board.TopMiddle.height + SheetData.Board.BottomMiddle.height;
  gameProps.gameBoard = new TGameBoard(cvs, imgSheet, SheetData.Board);
  clearSpriteEvents(gameProps.tiles);
  gameProps.tiles.length = 0;
  for (let row = 0; row < gameLevel.Tiles.Row; row++) {
    const rows = [];
    for (let col = 0; col < gameLevel.Tiles.Col; col++) {
      const tile = new TTile(row, col);
      rows.push(tile);
    }
    gameProps.tiles.push(rows);
  }
  // Create mines
  let mines = 0;
  do {
    const row = Math.floor(Math.random() * gameLevel.Tiles.Row);
    const col = Math.floor(Math.random() * gameLevel.Tiles.Col);
    const tile = gameProps.tiles[row][col];
    if (!tile.isMine()) {
      tile.setAsMine();
      //tile.open();
      mines++;
    }
  } while (mines < gameLevel.Mines);
  gameProps.buttonSmiley.resetDestination();
  gameProps.buttonSmiley.up();
  gameStatus = EGameStatusType.Running;
}

gameProps.tiles.ForEach = function (aCallBack) {
  IterateTable(this, aCallBack);
};

function IterateTable(aTable, aCallBack) {
  aTable.forEach((row) => row.forEach(aCallBack));
}

function setGameOver() {
  gameStatus = EGameStatusType.GameOver;
  gameProps.tiles.ForEach((tile) => {
    if (tile.isMine()) {
      tile.open();
    }
  });
  gameProps.buttonSmiley.dead();
}

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

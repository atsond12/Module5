"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import { TPoint } from "../lib/lib2D.js";
import { TSpriteButton, TSpriteNumber } from "../lib/libSprite.js";
import { TGameBoard, TNeighbour } from "./gameBoard.js";

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
  buttonSmiley: null,
  tiles: [],
  numberOfMines: null,
  numberOfSeconds: null,
};

let gameLevel = Difficulty.Level_1;

let cvs = null;
let ctx = null;
let imgSheet = null;

//                        0        1       2       3         4           5          6        7
const TextColorTable = ["Blue", "Green", "Red", "Purple", "Maroon", "Turquoise", "Black", "Gray"];
const ETileStateType = { Up: 0, Down: 1, Open: 2, Flag: 3, ActiveMine: 4, Mine: 5 };

let numberOfSeconds = 0;
let numberOfMines = 0;
let intervalID = 0;

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

//--- TTile -------------------------------------------------------------------------------
function TTile(aRow, aCol) {
  const tile = this;
  const row = aRow;
  const col = aCol;
  const pos = new TPoint(20 + col * SheetData.ButtonTile.width, 132 + row * SheetData.ButtonTile.height);
  const sp = new TSpriteButton(cvs, imgSheet, SheetData.ButtonTile, pos, null, down, up);
  let state = ETileStateType.Up;
  let isMine = false;
  const neighbour = new TNeighbour(row, col, gameLevel);
  let mineInfo = 0;

  this.draw = function () {
    sp.setIndex(state);
    sp.draw();
    if (state === ETileStateType.Open) {
      if (mineInfo > 0) {
        ctx.font = "48px Courier New";
        ctx.fillStyle = TextColorTable[mineInfo - 1];
        ctx.fillText(mineInfo.toString(), pos.x + 10, pos.y + 40);
      }
    }
  };

  this.isMine = function () {
    return isMine;
  };

  this.setIsMine = function () {
    isMine = true;
    //state = ETileStateType.ActiveMine;
    neighbour.visitAll(gameProps.tiles, visitNeighbour);
  };

  function visitNeighbour(aNeighbour) {
    aNeighbour.updateMineInfo();
  }

  this.updateMineInfo = function () {
    mineInfo++;
  };

  function down(aEvent) {
    if (aEvent.buttons === 2) {
      if(state === ETileStateType.Flag){
        if(numberOfMines < gameLevel.Mines){
          numberOfMines++;
          gameProps.numberOfMines.setValue(numberOfMines);
          state = ETileStateType.Up;
        }
      }else{
        if(numberOfMines > 0){
          numberOfMines--;
          gameProps.numberOfMines.setValue(numberOfMines);
          state = ETileStateType.Flag;
        }
      }
    } else if(state !== ETileStateType.Flag){
      state = ETileStateType.Down;
      gameProps.buttonSmiley.setIndex(1);
    }
  }

  function up(aEvent) {
    if (state === ETileStateType.Down) {
      state = ETileStateType.Up;
      if (aEvent.target.cancel === false) {
        tile.open();
        if(state === ETileStateType.Open){
          gameProps.buttonSmiley.setIndex(0);
        }
      }
    }
  }

  function openNeighbour(aNeighbour) {
    aNeighbour.open();
  }

  this.open = function () {
    if ((mineInfo === 0) && (!isMine)) {
      if (state === ETileStateType.Up) {
        state = ETileStateType.Open;
        neighbour.visitAll(gameProps.tiles, openNeighbour);
      }
    }
    if (isMine) {
      state = ETileStateType.ActiveMine;
      setGameOver();
    } else {
      state = ETileStateType.Open;
    }

    sp.disabled = state !== ETileStateType.Up;
  };

  this.setDisabled = function(){
    sp.disabled = true;
  }

  this.openIfMine = function(){
    if(isMine && (state !== ETileStateType.ActiveMine)){
      state = ETileStateType.Mine;
    }
  }

} // End class Tile

//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.addEventListener("contextmenu", (aEvent) => aEvent.preventDefault());
  ctx = cvs.getContext("2d");
  const pos = new TPoint(100, 20);
  gameProps.buttonSmiley = new TSpriteButton(cvs, imgSheet, SheetData.ButtonSmiley, pos, newGame);
  newGame();
  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
}

//-----------------------------------------------------------------------------------------
function newGame() {
  cvs.width = gameLevel.Tiles.Col * SheetData.ButtonTile.width + SheetData.Board.LeftMiddle.width + SheetData.Board.RightMiddle.width;
  cvs.height = gameLevel.Tiles.Row * SheetData.ButtonTile.height + SheetData.Board.TopMiddle.height + SheetData.Board.BottomMiddle.height;
  gameProps.gameBoard = new TGameBoard(cvs, imgSheet, SheetData.Board);
  // Set new destination for Smiley Button!!!
  // gameProps.buttonSmiley.updateDestination(x, y)
  const x = cvs.width / 2 - SheetData.ButtonSmiley.width / 2;
  const y = 25;
  gameProps.buttonSmiley.updateDestination(x, y);

  gameProps.tiles.length = 0;
  for (let row = 0; row < gameLevel.Tiles.Row; row++) {
    const cols = [];
    for (let col = 0; col < gameLevel.Tiles.Col; col++) {
      const tile = new TTile(row, col);
      cols.push(tile);
    }
    gameProps.tiles.push(cols);
  }
  //Generate mines
  let mineCount = 0;
  do {
    const row = Math.floor(Math.random() * gameLevel.Tiles.Row);
    const col = Math.floor(Math.random() * gameLevel.Tiles.Col);
    const tile = gameProps.tiles[row][col];
    if (!tile) debugger;
    if (tile.isMine() == false) {
      tile.setIsMine();
      mineCount++;
    }
  } while (mineCount < gameLevel.Mines);

  /* Opprett to forekomster av TSpriteNumber, og legg dem inn i variablene som er laget i gameProps */
  let pos = new TPoint(110, 22);
  gameProps.numberOfMines = new TSpriteNumber(cvs, imgSheet, SheetData.Numbers, pos);
  gameProps.numberOfMines.setValue(gameLevel.Mines);
  pos.x = cvs.width - 85;
  gameProps.numberOfSeconds = new TSpriteNumber(cvs, imgSheet, SheetData.Numbers, pos);
  gameProps.numberOfSeconds.setValue(0);

  numberOfMines = gameLevel.Mines;
  intervalID = setInterval(updateGame, 1000);

  console.log("Starting new Game!!!!");
}

function updateGame() {
  numberOfSeconds++;
  gameProps.numberOfSeconds.setValue(numberOfSeconds);
}

function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  // Draw your game props here
  gameProps.gameBoard.draw();
  gameProps.buttonSmiley.draw();

  for (let row = 0; row < gameProps.tiles.length; row++) {
    const columns = gameProps.tiles[row];
    for (let col = 0; col < columns.length; col++) {
      const tile = columns[col];
      tile.draw();
    }
  }
  gameProps.numberOfMines.draw();
  gameProps.numberOfSeconds.draw();

  requestAnimationFrame(drawGame);
}

function setGameOver(){
  gameProps.buttonSmiley.setIndex(2);
  //Løp igjennom alle tiles med to for-løkker, og sett disabled = true;
  for(let row = 0; row < gameProps.tiles.length; row++){
    const rows = gameProps.tiles[row];
    for(let col = 0; col < rows.length; col++){
      const tile = rows[col];
      tile.setDisabled();
      tile.openIfMine();
    }
  }
  //TODO: Stop interval
  clearInterval(intervalID);
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

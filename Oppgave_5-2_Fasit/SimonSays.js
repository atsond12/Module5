"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import { TPoint } from "../lib/lib2D.js";
import { TSprite, TSpriteButton, TSpriteNumber } from "../lib/libSprite.js";
import { createTone, ENoteName, EOctave } from "../lib/libSound.js";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const SheetData = {
  Background: { x: 0, y: 0, width: 720, height: 720, count: 2 },
  ButtonYellow: { x: 0, y: 720, width: 314, height: 314, count: 2, pos: { x: 29, y: 377, r1: 100, r2: 333 } },
  ButtonBlue: { x: 0, y: 1034, width: 314, height: 314, count: 2, pos: { x: 377, y: 377, r1: 100, r2: 333 } },
  ButtonRed: { x: 0, y: 1348, width: 314, height: 314, count: 2, pos: { x: 377, y: 29, r1: 100, r2: 333 } },
  ButtonGreen: { x: 0, y: 1662, width: 314, height: 314, count: 2, pos: { x: 29, y: 29, r1: 100, r2: 333 } },
  ButtonStartEnd: { x: 0, y: 1976, width: 360, height: 360, count: 2, pos: { x: 180, y: 180, r1: 1, r2: 180 } },
  number: { x: 0, y: 2344, width: 23, height: 34, count: 10, pos: {x: 365, y: 385}},
};

let cvs = null;
let ctx = null;
let imgSheet = null;

const gameProps = {
  gameBoard: null,
  colorButtons: [],
  startButton: null,
  numberRound: null
};

const posGameCenter = new TPoint(SheetData.Background.width / 2, SheetData.Background.height / 2);

const EGameStatusType = {Idle: 0, Start: 1, Computer: 2, Player: 3, GameOver: 4};
let gameStatus = EGameStatusType.Idle;

const sequence = [];
let currentSequenceIndex = 0;
let roundCounter = 0;
let speed = 1;

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function TColorButton(aSpriteAnimation, aToneName) {
  const colorButton = this;
  const spa = aSpriteAnimation;
  const sp = new TSpriteButton(cvs, imgSheet, spa, spa.pos, null, down, up);
  sp.setPointIsOverHandler(isPointInsideCircle);

  const tone = createTone(aToneName,EOctave.Octave5); 

  this.draw = function () {
    sp.draw();
  };

  // Private method to check if a point is inside a circle.
  function isPointInsideCircle(aPointX, aPointY) {
    if(gameStatus !== EGameStatusType.Player){
      return false;
    }
    const deltaX = aPointX - posGameCenter.x;
    const deltaY = aPointY - posGameCenter.y;
    const hyp = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    return hyp > spa.pos.r1 && hyp < spa.pos.r2;
  }

  function down() {
    tone.play();
    sp.setIndex(1);
  }

  function up() {
    tone.stop();
    sp.setIndex(0);
    if(sequence[currentSequenceIndex] !== colorButton){
      gameStatus = EGameStatusType.GameOver;
      gameProps.startButton.setIndex(1);
      gameProps.startButton.disabled = false;
      return;
    }
    currentSequenceIndex++;
    if(currentSequenceIndex >= sequence.length){
      gameProps.numberRound.setValue(roundCounter);
      setTimeout(spawnSequenceItem, 1000);
    }
  }

  this.setDown = function(){
    tone.play();
    sp.setIndex(1);
    setTimeout(colorButton.setUp, 300 / speed);
  }

  this.setUp = function(){
    tone.stop();
    sp.setIndex(0);
    runComputer();
  }
}// End of class TColorButton

//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.width = SheetData.Background.width;
  cvs.height = SheetData.Background.height;
  ctx = cvs.getContext("2d");

  gameProps.gameBoard = new TSprite(cvs, imgSheet, SheetData.Background, new TPoint(0, 0));
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonYellow, ENoteName.F));
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonRed, ENoteName.D));
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonBlue, ENoteName.E));
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonGreen, ENoteName.C));

  gameProps.startButton = new TSpriteButton(cvs, imgSheet, SheetData.ButtonStartEnd, SheetData.ButtonStartEnd.pos, startGame);

  gameProps.numberRound = new TSpriteNumber(cvs, imgSheet, SheetData.number, SheetData.number.pos);

  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
}
//-----------------------------------------------------------------------------------------

function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  gameProps.gameBoard.draw();
  gameProps.colorButtons.forEach((button) => button.draw());
  switch(gameStatus){
    case EGameStatusType.Idle:
    case EGameStatusType.GameOver:
      gameProps.startButton.draw();
      break;
    case EGameStatusType.Player:
    case EGameStatusType.Computer:
      gameProps.numberRound.draw();  
      break;
    }
  requestAnimationFrame(drawGame);
}
//-----------------------------------------------------------------------------------------

function startGame(){
  gameProps.startButton.disabled = true;
  gameStatus = EGameStatusType.Start;
  sequence.length = 0;
  roundCounter = 0;
  speed = 1;
  gameProps.numberRound.setValue(roundCounter);
  spawnSequenceItem();
}

function runComputer(){
  if(currentSequenceIndex < sequence.length){
    const colorButton = sequence[currentSequenceIndex];
    currentSequenceIndex++;
    setTimeout(colorButton.setDown, 150 / speed);
  }else{
    currentSequenceIndex = 0;
    gameStatus = EGameStatusType.Player;
   }
}

function spawnSequenceItem(){
  const index = Math.floor(Math.random() * 4);
  const colorButton = gameProps.colorButtons[index];
  sequence.push(colorButton);
  currentSequenceIndex = 0;
  if((roundCounter % 3) === 0){
    speed+= 0.35;
  }
  roundCounter++;
  gameStatus = EGameStatusType.Computer;
  runComputer();
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

function buttonDown(aEvent, aButton) {
  console.log(aEvent, aButton);
}

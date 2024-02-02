"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import { TSprite, TSpriteButton, TSpriteNumber } from "../lib/libSprite.js";
import { TPoint } from "../lib/lib2D.js";
import { createTone, ENoteName, EOctave } from "../lib/libSound.js";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const SheetData = {
  Background: { x: 0, y: 0, width: 720, height: 720, count: 1 },
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
  background: null,
  colorButtons: [],
  numberRound: null,
  button: null,
  gameOverScore: null
};

const posCenterGame = new TPoint(
  SheetData.Background.width / 2, 
  SheetData.Background.height  / 2
);

const sequence = [];
const EGameStatusType = {Idle: 0, Computer: 1, Player: 2, GameOver: 3};
let gameStatus = EGameStatusType.Idle;
let sequenceIndex = 0;
let roundCounter = 0;
let speed = 1;
//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function TColorButton(aSpriteAnimation, aNoteName){
  const colorButton = this;
  const spa = aSpriteAnimation;
  const sp = new TSpriteButton(cvs, imgSheet, spa, spa.pos, null, down, up );
  sp.setPointIsOverHandler(isMouseOver);

  let tone = null;

  this.draw = function(){
    sp.draw();
  }
  
  this.setDown = function(){ // Denne kjøres kun av computer!
    sp.setIndex(1);
    if(!tone){
      tone = createTone(aNoteName, EOctave.Octave5);
    }
    tone.play();
    setTimeout(this.setUp, 1000 / speed);
  }

  this.setUp = function(){ // Denne kjøres kun av computer!
    sp.setIndex(0);
    tone.stop();
    sequenceIndex++;
    if(sequenceIndex < sequence.length){
      setTimeout(runComputer, 500 / speed);
    }else{
      sequenceIndex = 0;
      gameStatus = EGameStatusType.Player;
    }
  }

  function isMouseOver(aPointX, aPointY){
    if(gameStatus !== EGameStatusType.Player){
      cvs.style.cursor = "no-drop";
      return false;
    }
    const x = aPointX - posCenterGame.x;
    const y = aPointY - posCenterGame.y;

    const hyp = Math.sqrt(x ** 2 + y ** 2);
    /*
    const hyp = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const hyp = Math.sqrt((x*x) + (y*y));
    */
    if((hyp > spa.pos.r1) && (hyp < spa.pos.r2)){
      return true;
    }else{
      return false;
    }
  }

  function down(){ // Denne kjøres kun av spilleren
    sp.setIndex(1);
    if(!tone){
      tone = createTone(aNoteName, EOctave.Octave5);
    }
    tone.play();
  }

  function up(){ // Denne kjøres kun av spilleren
    sp.setIndex(0);
    tone.stop();
    if(colorButton !== sequence[sequenceIndex]){
      gameProps.button.setIndex(1);
      gameProps.button.disabled = false;
      gameProps.gameOverScore.setValue(roundCounter);
      gameStatus = EGameStatusType.GameOver;
      return;
    }
    sequenceIndex++;
    if(sequenceIndex >= sequence.length){
      sequenceIndex = 0;
      gameStatus = EGameStatusType.Computer;
      //Her er vi ferdig med alle sekvensene brukeren har klikket på!
      roundCounter++;
      speed += 0.7;
      gameProps.numberRound.setValue(roundCounter);
      setTimeout(spawnColorButton, 1000 / speed);
    }
  }

}// End of TColorButton

//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.width = SheetData.Background.width;
  cvs.height = SheetData.Background.height;
  ctx = cvs.getContext("2d");

  gameProps.background = new TSprite(cvs, imgSheet, SheetData.Background, {x: 0, y: 0});
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonGreen, ENoteName.C));
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonRed, ENoteName.D));
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonBlue, ENoteName.E));
  gameProps.colorButtons.push(new TColorButton(SheetData.ButtonYellow,ENoteName.F));
  gameProps.numberRound = new TSpriteNumber(cvs, imgSheet, SheetData.number, SheetData.number.pos);
  gameProps.numberRound.setValue(roundCounter);
  gameProps.button = new TSpriteButton(cvs, imgSheet, SheetData.ButtonStartEnd,SheetData.ButtonStartEnd.pos, runGame)
  gameProps.gameOverScore = new TSpriteNumber(cvs, imgSheet, SheetData.number,{x: 350, y:450 });
  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
}
//-----------------------------------------------------------------------------------------

function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  //Draw your game props here!
  gameProps.background.draw();
  gameProps.colorButtons.forEach(button => button.draw());
  gameProps.numberRound.draw();
  if((gameStatus === EGameStatusType.Idle) || (gameStatus === EGameStatusType.GameOver)){
    gameProps.button.draw();
  }
  if(gameStatus === EGameStatusType.GameOver){
    gameProps.gameOverScore.draw();
  }
  requestAnimationFrame(drawGame);
}

function runGame(){
  gameStatus = EGameStatusType.Computer;
  sequence.length = 0;
  gameProps.button.disabled = true;
  roundCounter = 0;
  gameProps.numberRound.setValue(roundCounter);
  spawnColorButton();
}

function spawnColorButton(){
  const index = Math.floor(Math.random() * 4);
  const colorButton = gameProps.colorButtons[index];
  sequence.push(colorButton);
  sequenceIndex = 0;
  runComputer();
}

function runComputer(){
  sequence[sequenceIndex].setDown();
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

function buttonDown(aEvent, aButton) {
  console.log(aEvent, aButton);
}
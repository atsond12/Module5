"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------


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

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.width = SheetData.Background.width;
  cvs.height = SheetData.Background.height;
  ctx = cvs.getContext("2d");

  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
}
//-----------------------------------------------------------------------------------------

function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  //Draw your game props here!
  
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

function buttonDown(aEvent, aButton) {
  console.log(aEvent, aButton);
}

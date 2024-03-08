"use strict";
import { TPoint } from "../lib/lib2D.js";
import { TSprite } from "../lib/libSprite.js";
import { SheetData } from "./sheetData.js";
import { calculateNormalizedVector, calculateSpeedVector } from "./calculations.js";

let imgSheet = null;
let cvs = null;
let ctx = null;

const mousePos = new TPoint(0, 0);
const board = {
  left: 26, top: 110, right:  26 + 1135, bottom: 110 + 570 
}


let hndUpdateGameInterval = null;

//------------------------------------------------------------------------------------------------------------------
//------ Classes
//------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------------
//------ Function and Events
//------------------------------------------------------------------------------------------------------------------
function loadGame() {
  cvs.width = SheetData.Background.width;
  cvs.height = SheetData.Background.height;
  newGame();
  requestAnimationFrame(drawGame);
}

function newGame() {
  console.log("New Game!");
  if(hndUpdateGameInterval == null){
    hndUpdateGameInterval = setInterval(updateGame, 1);
  }
}

function drawGame() {
  ctx.clearRect(0, 0, cvsPaint.width, cvsPaint.height);
  //Draw game props here

  requestAnimationFrame(drawGame);
}

function updateGame(){
  //Update game props here
}

function setMousePos(aEvent) {
  const bounds = cvs.getBoundingClientRect();
  mousePos.x = aEvent.clientX - bounds.left;
  mousePos.y = aEvent.clientY - bounds.top;
}

function cvsPaintMouseMove(aEvent) {
  // Mouse move over canvas
  setMousePos(aEvent);
}

function cvsPaintMouseDown(aEvent) {
  // Mouse button down in canvas
}

export function init(aEvent) {
  console.log("Initializing Brick Breaker Game!");
  cvs = document.getElementById("cvsPaint");
  ctx = cvs.getContext("2d");
  cvs.addEventListener("mousemove", cvsPaintMouseMove);
  cvs.addEventListener("mousedown", cvsPaintMouseDown);
  cvs.oncontextmenu = (aEvent) => {
    aEvent.preventDefault();
  };

  imgSheet = new Image();
  imgSheet.addEventListener("load", imgSheetLoad);
  imgSheet.addEventListener("error", imgSheetError);
  imgSheet.src = "./media/spriteSheet.png";
}

function imgSheetLoad(aEvent) {
  console.log("Sprite Sheet is loaded, game is ready to start!");
  loadGame();
}
//-----------------------------------------------------------------------------------------

function imgSheetError(aEvent) {
  console.log("Error loading Sprite Sheet!", aEvent.target.src);
}
//-----------------------------------------------------------------------------------------

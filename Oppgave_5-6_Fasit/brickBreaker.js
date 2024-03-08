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

const gameProps = {
  background: null,
  ball: null,
  hero: null,
  bricks: [],
};

let hndUpdateGameInterval = null;

//------------------------------------------------------------------------------------------------------------------
//------ Classes
//------------------------------------------------------------------------------------------------------------------

function TBrick(aPos){
  const pos = aPos;
  const spa = SheetData.BrickBlue;
  const sp = new TSprite(cvs, imgSheet, spa, pos);
  let index = 0;
  pos.x += spa.width / 2;
  pos.y += spa.height / 2;

  this.draw = function(){
    sp.draw();
  }

  this.bounce = function(aSprite){
    if(aSprite.areSpritesColliding(sp)){
      if(index < spa.count - 1){
        index++;
        sp.setIndex(index);
      }else{
        index = 0; 
      }
      return pos;
    }
    return null;
  }
}

function THero(){
  const hero = this;
  let spa = SheetData.SmallBar;
  let center = spa.width / 2;
  const pos = new TPoint(100, board.bottom - SheetData.SmallBar.height - 20);
  const sp = new TSprite(cvs, imgSheet, spa, pos);

  this.draw = function(){
    sp.draw();
  }

  this.update = function(){
    const left = mousePos.x - center; 
    if((left >= board.left) &&  ((left + spa.width) <= board.right)){
      pos.x = left;
      sp.updateDestination(pos.x, pos.y);
      pos.x += center;  
    }
  }

  this.bounce = function(aSprite){
    if(aSprite.areSpritesColliding(sp)){
      return pos;
    }
    return null;
  }
}

function TBall(){
  const ball = this;
  const spa = SheetData.Ball;
  const pos = new TPoint(100, 400);
  const sp = new TSprite(cvs, imgSheet, spa, pos);
  const center = new TPoint(pos.x + (spa.width / 2), pos.y + (spa.height / 2));
  let vector = null;
  let speed = null;
  let constantSpeed = 3;

  this.draw = function(){
    sp.draw();
  }

  this.update = function(){
    let x = pos.x + speed.x;
    let y = pos.y + speed.y;
    let left = board.left;
    let right = board.right - spa.width;
    if(y < board.top){
      speed.y *= -1;
    }else if(y > board.bottom){
      speed.y *= -1;
    }
    if((x < left) || (x > right) ){
      speed.x *= -1;
    }
    pos.x = x;
    pos.y = y;
    sp.updateDestination(pos.x, pos.y);
    let boundsPos = gameProps.hero.bounce(sp);
    if(boundsPos){
      center.x = pos.x + (spa.width / 2); 
      let dx = (center.x - boundsPos.x);
      console.log("dx = ", dx);
      if(Math.abs(dx) < 20){
        speed.y *= -1;
      }else{
        center.x = pos.x + (spa.width / 2); 
        center.y = pos.y + (spa.height / 2);
        vector = calculateNormalizedVector(center, {x: center.x + dx, y: center.y - 200});
        speed = calculateSpeedVector(vector, constantSpeed);  
      }
    }else{
      gameProps.bricks.forEach((brick) => {
        boundsPos = brick.bounce(sp);
        if(boundsPos){
          speed.y *= -1;
        }
      });
    }
  }

  vector = calculateNormalizedVector(center, { x: center.x + 10, y: center.y + 15 });
  speed = calculateSpeedVector(vector, constantSpeed);

}


//------------------------------------------------------------------------------------------------------------------
//------ Function and Events
//------------------------------------------------------------------------------------------------------------------
function loadGame() {
  cvs.width = SheetData.Background.width;
  cvs.height = SheetData.Background.height;
  gameProps.background = new TSprite(cvs, imgSheet, SheetData.Background, { x: 0, y: 0 });
  gameProps.ball = new TBall();
  gameProps.hero = new THero();
  newGame();
  requestAnimationFrame(drawGame);
}

function newGame() {
  console.log("New Game!");
  gameProps.bricks.length = 0;
  gameProps.bricks.push(new TBrick({x: 200, y: 200}));
  hndUpdateGameInterval = setInterval(updateGame, 1);
}

function drawGame() {
  ctx.clearRect(0, 0, cvsPaint.width, cvsPaint.height);
  gameProps.background.draw();
  gameProps.ball.draw();
  gameProps.bricks.forEach(brick => brick.draw());
  gameProps.hero.draw();
  requestAnimationFrame(drawGame);
}

function updateGame(){
  gameProps.ball.update();
  gameProps.hero.update();
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

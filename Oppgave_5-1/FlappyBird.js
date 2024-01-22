"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import { TSprite } from "../lib/libSprite.js";
import { TPoint, TSinesWave } from "../lib/lib2D.js";
import { TGameMenu } from "./gameMenu.js";
import { TFood } from "./food.js";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------

const SheetData = {
  hero1: { x: 0, y: 545, width: 34, height: 24, count: 4 },
  hero2: { x: 0, y: 569, width: 34, height: 24, count: 4 },
  hero3: { x: 0, y: 593, width: 34, height: 24, count: 4 },
  obstacle: { x: 0, y: 0, width: 52, height: 320, count: 4 },
  background: { x: 246, y: 0, width: 576, height: 512, count: 2 },
  flappyBird: { x: 0, y: 330, width: 178, height: 50, count: 1 },
  ground: { x: 246, y: 512, width: 1152, height: 114, count: 1 },
  numberSmall: { x: 681, y: 635, width: 14, height: 20, count: 10 },
  numberBig: { x: 422, y: 635, width: 24, height: 36, count: 10 },
  btnStartGame: { x: 1183, y: 635, width: 104, height: 58, count: 1 },
  gameOver: { x: 0, y: 384, width: 226, height: 114, count: 1 },
  infoText: { x: 0, y: 630, width: 200, height: 55, count: 2 },
  food: { x: 0, y: 696, width: 70, height: 65, count: 34 },
  medal: { x: 985, y: 635, width: 44, height: 44, count: 44 },
};

const FPS = { frames: 0, startTime: performance.now(), FPSNormal: 0 };
const UPS = { current: performance.now(), previous: performance.now(), delta: 0 };

let cvs = null;
let ctx = null;
let imgSheet = null;

export const gameProps = {
  background: null,
  ground: null,
  hero: null,
  obstacles: [],
  gameMenu: null,
  foods: [],
};

const groundLevel = SheetData.background.height - SheetData.ground.height;
let lastSpawnObstacleTime = 0;
let lastSpawnFoodTime = 0;

export const EGameStatusType = { Idle: 1, CountDown: 2, Running: 3, HeroIsDead: 4, GameOver: 5 };
export let gameStatus = EGameStatusType.Idle;

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function TGround() {
  const pos = new TPoint(0, groundLevel);
  const sp = new TSprite(cvs, imgSheet, SheetData.ground, pos);

  this.draw = function () {
    sp.draw();
  };

  this.update = function () {
    pos.x = pos.x - 1;
    if (pos.x <= -SheetData.background.width) {
      pos.x = 0;
    }
    sp.updateDestination(pos.x, pos.y);
  };
} // End of class TGround

function THero() {
  const pos = new TPoint(100, 150);
  const sp = new TSprite(cvs, imgSheet, SheetData.hero1, pos);
  const wave = new TSinesWave(pos.y, 0.8, 30);
  sp.setSpeed(25);
  const G = 9.81 / 50;
  let speed = 0;

  this.draw = function () {
    sp.draw();
  };

  this.update = function () {
    sp.animate();
    speed += G;
    pos.y += speed;
    sp.setRotation(speed * 7);
    if(pos.y >= groundLevel){
      gameStatus = EGameStatusType.GameOver;
      pos.y = groundLevel - SheetData.hero1.height;
      gameProps.gameMenu.setGameOver();
    }
    
    sp.updateDestination(pos.x, pos.y);
  };

  this.updateIdle = function(){
    pos.y = wave.getWaveValue();
    sp.updateDestination(pos.x, pos.y);
    sp.animate();
  }

  this.flap = function () {
    speed = -3;
  };

  this.getSprite = function () {
    return sp;
  };
} // End of class THero

function TObstacle() {
  let left = SheetData.background.width;
  const gap = Math.floor(Math.random() * 70) + 90;
  let heightBottom = groundLevel - 25;
  heightBottom = heightBottom - gap;
  heightBottom = Math.floor(Math.random() * (heightBottom - 25)) + 125;
  let heightTop = heightBottom - SheetData.obstacle.height - gap;
  let pos = new TPoint(left, heightBottom);
  const spBottom = new TSprite(cvs, imgSheet, SheetData.obstacle, pos);
  pos = new TPoint(left, heightTop);
  const spTop = new TSprite(cvs, imgSheet, SheetData.obstacle, pos);
  spBottom.setIndex(2);
  spTop.setIndex(3);
  let score = 20;

  this.deSpawn = false;

  this.draw = function () {
    spBottom.draw();
    spTop.draw();
  };

  this.update = function () {
    left = left - 1;
    spBottom.updateDestination(left, heightBottom);
    spTop.updateDestination(left, heightTop);
    if (left < -SheetData.obstacle.width) {
      this.deSpawn = true;
    }
    const spHero = gameProps.hero.getSprite();
    const collideBottom = spBottom.areSpritesColliding(spHero);
    const collideTop = spTop.areSpritesColliding(spHero);
    if (collideBottom || collideTop) {
      gameStatus = EGameStatusType.HeroIsDead;
    }
    if(score > 0){
      if((left + SheetData.obstacle.width) < 100){
        gameProps.gameMenu.updateScore(score);
        score = 0;
      }
    }
  };
} // End of class TObstacle

//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.width = SheetData.background.width;
  cvs.height = SheetData.background.height;
  ctx = cvs.getContext("2d");

  gameProps.background = new TSprite(cvs, imgSheet, SheetData.background, { x: 0, y: 0 });
  gameProps.ground = new TGround();
  gameProps.hero = new THero();
  gameProps.gameMenu = new TGameMenu(cvs, imgSheet, SheetData);


  document.addEventListener("keypress", keyPress);

  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");

  setInterval(updateGame, 1000 / 60);
  console.log("Game update sequence is running!");
}
//-----------------------------------------------------------------------------------------

function drawGame() {
  //calculateFPSNormal();
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  gameProps.background.draw();
  for (let i = 0; i < gameProps.obstacles.length; i++) {
    gameProps.obstacles[i].draw();
  }
  gameProps.ground.draw();
  gameProps.hero.draw();

  if(gameStatus === EGameStatusType.Idle){
    gameProps.gameMenu.drawIdle();
  }else if(gameStatus === EGameStatusType.CountDown){
    gameProps.gameMenu.drawCountDown();
  }else if(gameStatus === EGameStatusType.GameOver){
    gameProps.gameMenu.drawGameOver();
  }else if(gameStatus === EGameStatusType.Running){
    gameProps.gameMenu.drawGameRunning();
  }

  for(let i = 0; i < gameProps.foods.length; i++){
    gameProps.foods[i].draw();
  }
  //drawFPS();
  requestAnimationFrame(drawGame);
}
//-----------------------------------------------------------------------------------------

function drawFPS() {
  ctx.fillStyle = "black";
  ctx.font = "bold 12px Arial";
  ctx.fillText("FPS: " + FPS.FPSNormal.toFixed(2), 5, 15);
}
//-----------------------------------------------------------------------------------------

function updateGame() {
  UPS.current = performance.now();
  UPS.dt = (UPS.current - UPS.previous) / 1000;
  // Update game logics here!
  if((gameStatus === EGameStatusType.Idle) || (gameStatus === EGameStatusType.CountDown)){
    gameProps.hero.updateIdle();
  }

  if (gameStatus === EGameStatusType.Running) {
    gameProps.ground.update();
    gameProps.hero.update();
    for (let i = 0; i < gameProps.obstacles.length; i++) {
      gameProps.obstacles[i].update();
    }

    if (gameProps.obstacles.length) {
      if (gameProps.obstacles[0].deSpawn) {
        gameProps.obstacles.splice(0, 1);
      }
    }
    spawnObstacle();

  }

  if(gameStatus === EGameStatusType.HeroIsDead){
    gameProps.hero.update();
  }
  spawnFood();

  let eatenIndex = -1;
  gameProps.foods.forEach((food) => {
    food.update();
    if(food.eaten === true){
      eatenIndex = gameProps.foods.indexOf(food);
    }
  });

  if(eatenIndex >= 0){
    gameProps.foods.splice(eatenIndex, 1);
  }

  UPS.previousTime = UPS.currentTime;
}
//-----------------------------------------------------------------------------------------

function calculateFPSNormal() {
  FPS.frames++;
  const t = performance.now();
  const dt = t - FPS.startTime;
  if (dt > 1000) {
    FPS.FPSNormal = (FPS.frames * 1000) / dt;
    FPS.frames = 0;
    FPS.startTime = t;
  }
}
//-----------------------------------------------------------------------------------------

function spawnObstacle() {
  const delta = UPS.current - lastSpawnObstacleTime;
  const createNewObstacle = delta > 3000;
  if (createNewObstacle) {
    gameProps.obstacles.push(new TObstacle());
    lastSpawnObstacleTime = UPS.current;
  }
}
function spawnFood(){
  const delta = UPS.current - lastSpawnFoodTime;
  const createNewFood = delta > 4000;
  if(createNewFood){
    gameProps.foods.push(new TFood(cvs, imgSheet, SheetData));
    lastSpawnFoodTime = UPS.current;
  }
}

export function startCountDown(){
  console.log("Start Count Down!!");
  gameStatus = EGameStatusType.CountDown;
  setTimeout(gameProps.gameMenu.updateCountDown, 1000);
}

export function startGame(){
  gameStatus = EGameStatusType.Running;
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

function keyPress(aEvent) {
  if (aEvent.code === "Space") {
    if(gameStatus === EGameStatusType.Running){
      gameProps.hero.flap();
    }
  }
}

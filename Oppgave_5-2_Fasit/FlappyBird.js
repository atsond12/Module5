"use strict";
import { TSprite, TSpriteButton, TSpriteNumber } from "../lib/libSprite.js";
import { TPoint, TSinesWave } from "../lib/lib2D.js";
import { TSound } from "../lib/libSound.js";

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

const EGameStatus = { Idle: 1, GetReady: 2, Playing: 3, HeroIsDead: 4, GameOver: 5 };

let gameStatus = EGameStatus.Idle;

let cvs = null;
let ctx = null;

let imgSheet = null;

const groundLevel = SheetData.background.height - SheetData.ground.height;
let soundMuted = false;
let isDayMode = true;

const gameProps = {
  background: null,
  hero: null,
  countDown: null,
  flappyBirdText: null,
  obstacles: [],
  score: null,
  gameOverMenu: null,
  foods: [],
  music: null
};

let gameSpeed = 0.5;

const timeSpawnObstacle = {
  timeLast: 0,
  timeSpawn: 0,
};

const timeSpawnFood = {
  timeLast: 0,
  timeSpawn: 0,
};

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

//---------------------------------------------------------------
//----- Class TBackground ---------------------------------------
//---------------------------------------------------------------
function TBackground() {
  const spBackground = new TSprite(cvs, imgSheet, SheetData.background, { x: 0, y: 0 });
  const groundPos = new TPoint(0, groundLevel);
  const ground = new TSprite(cvs, imgSheet, SheetData.ground, groundPos);

  this.drawBackground = function () {
    spBackground.draw();
  };

  this.drawGround = function () {
    ground.draw();
  };

  this.update = function () {
    groundPos.x -= gameSpeed;
    if (groundPos.x < -SheetData.ground.width / 2) {
      groundPos.x = 0;
    }
    ground.updateDestination(groundPos.x, groundPos.y);
  };

  this.setDay = function(aDayMode){
    if(aDayMode){
      spBackground.setIndex(0);
    }else{
      spBackground.setIndex(1);
    }
  }
} // End of class TBackground

//---------------------------------------------------------------
//----- Class THero ---------------------------------------------
//---------------------------------------------------------------
function THero() {
  const heroPos = new TPoint(70, 170);
  let spa = SheetData.hero1;
  if(!isDayMode){
    spa = SheetData.hero3;
  }
  const sprite = new TSprite(cvs, imgSheet, spa, heroPos);
  sprite.setSpeed(100);
  const sinWave = new TSinesWave(heroPos.y, 0.1, 25);
  const gravity = 9.81 / gameSpeed / 1000;
  let speed = 0;

  const soundFood = new TSound("./media/food.mp3");
  const soundIsDead = new TSound("./media/heroIsDead.mp3");
  const soundGameOver = new TSound("./media/gameOver.mp3");

  this.draw = function () {
    sprite.draw();
  };

  this.update = function () {
    speed += gravity;
    heroPos.y += speed;
    const height = groundLevel - (heroPos.y + spa.height);
    if (height > 0) {
      sprite.animate();
      let rotAngle = speed * 20;
      if (rotAngle > 90) {
        rotAngle = 90;
      }
      sprite.setRotation(rotAngle);
    } else {
      heroPos.y = groundLevel - spa.height;
      gameStatus = EGameStatus.GameOver;
      playSound(soundGameOver);
      gameProps.music.stop();
    }
    sprite.updateDestination(heroPos.x, heroPos.y);
  };

  this.hover = function () {
    sinWave.getWaveValue();
    heroPos.y = sinWave.getWaveValue();
    sprite.updateDestination(heroPos.x, heroPos.y);
    sprite.animate();
  };

  this.flap = function () {
    speed = -(gravity * 60);
  };

  this.eatFood = function (aFoodSprite) {
    if (aFoodSprite.areSpritesColliding(sprite)) {
      const distance = aFoodSprite.getDistanceToSpriteCenter(sprite);
      if (distance < 20) {
        playSound(soundFood);
        return true;
      }
    }
    return false;
  };

  this.hitObstacle = function (aObstacleSprite) {
    const hit = aObstacleSprite.areSpritesColliding(sprite); 
    if(hit){
      playSound(soundIsDead);
    }
    return hit;
  };

  this.setDay = function(aDayMode){
    if(aDayMode){
      spa = SheetData.hero1;
    }else{
      spa = SheetData.hero3;
    }
    sprite.setIndex(0,spa);
  }
} // End of THero

//---------------------------------------------------------------
//----- Class TCountDown ----------------------------------------
//---------------------------------------------------------------
function TCountDown() {
  const spiInfoText = SheetData.infoText;
  const posInfoText = new TPoint(185, 100);
  const spriteInfoText = new TSprite(cvs, imgSheet, spiInfoText, posInfoText);
  spriteInfoText.setIndex(0);
  const sound = new TSound("./media/countDown.mp3");

  const posNumber = new TPoint(270, 170);
  const number = new TSpriteNumber(cvs, imgSheet, SheetData.numberBig, posNumber);
  let value = 3;
  number.setValue(value);

  function countDown() {
    value--;
    if (value > 0) {
      number.setValue(value);
      setTimeout(countDown, 1000);
    } else {
      gameStatus = EGameStatus.Playing;
      playSound(gameProps.music);
    }
  }

  this.draw = function () {
    spriteInfoText.draw();
    number.draw();
  };

  this.start = function () {
    value = 3;
    number.setValue(value);
    setTimeout(countDown, 1000);
    playSound(sound);
  };
} // End of class TCountDown

//---------------------------------------------------------------
//----- Class TObstacle -----------------------------------------
//---------------------------------------------------------------
export function TObstacle() {
  const posDown = new TPoint(576, 398 - 25);
  const spa = SheetData.obstacle;
  const spriteDown = new TSprite(cvs, imgSheet, spa, posDown);
  const posUp = new TPoint(576, -320 + 25);
  const spriteUp = new TSprite(cvs, imgSheet, spa, posUp);
  let scoreValue = 0;
  this.isOutOfBounds = false;
  this.heroHasPassed = false;

  function setGap() {
    const gap = Math.ceil(Math.random() * 170) + 70;
    const maxDown = 398 - 25;
    const maxTop = 25 + gap;
    const height = Math.ceil(Math.random() * (maxDown - maxTop)) + maxTop;
    posDown.y = height;
    posUp.y = height - gap - 320;
    scoreValue = Math.floor((500 - gap) / 10);
  }

  this.draw = function () {
    spriteDown.draw();
    spriteUp.draw();
  };

  this.update = function () {
    if(isDayMode){
      spriteDown.setIndex(2);
      spriteUp.setIndex(3);  
    }else{
      spriteDown.setIndex(0);
      spriteUp.setIndex(1);  
    }
  
    posDown.x -= gameSpeed;
    posUp.x -= gameSpeed;
    spriteDown.updateDestination(posDown.x, posDown.y);
    spriteUp.updateDestination(posUp.x, posUp.y);
    const left = posDown.x + 52;
    if (left < 50) {
      this.heroHasPassed = true;
      if (left < 0) {
        this.isOutOfBounds = true;
      }
    }
  };

  this.checkIfHeroHasHit = function () {
    const collideWithDown = gameProps.hero.hitObstacle(spriteDown);
    const collideWithUp = gameProps.hero.hitObstacle(spriteUp);
    return collideWithDown || collideWithUp;
  };

  this.updateScore = function () {
    if (scoreValue > 0) {
      gameProps.score.addScore(scoreValue);
      scoreValue = 0;
    }
  };
  setGap();
} // End of class TObstacle

//---------------------------------------------------------------
//----- Class TScore --------------------------------------------
//---------------------------------------------------------------
function TScore() {
  const posScore = new TPoint(40, 10);
  const numberScore = new TSpriteNumber(cvs, imgSheet, SheetData.numberSmall, posScore);
  let score = 0;
  numberScore.setAlpha(50);
  numberScore.setValue(score);

  this.draw = function () {
    numberScore.draw();
  };

  this.addScore = function (aValue) {
    score += aValue;
    numberScore.setValue(score);
    gameProps.gameOverMenu.setFinalScore(score);
  };

  this.resetScore = function () {
    score = 0;
    numberScore.setValue(score);
  };
} // End of class TScore

//---------------------------------------------------------------
//----- Class TGameOverMenu -------------------------------------
//---------------------------------------------------------------
function TGameOverMenu() {
  let scoreFinal = 0;
  let scoreGold = 0;
  let scoreSilver = 0;
  let scoreBronze = 0;
  const posInfoText = new TPoint(185, 50);
  const spriteInfoText = new TSprite(cvs, imgSheet, SheetData.infoText, posInfoText);
  spriteInfoText.setIndex(1);

  const posBoard = new TPoint(175, 110);
  const spriteBoard = new TSprite(cvs, imgSheet, SheetData.gameOver, posBoard);

  const posFinalScore = new TPoint(365, 142);
  const numberFinalScore = new TSpriteNumber(cvs, imgSheet, SheetData.numberSmall, posFinalScore);
  numberFinalScore.setValue(scoreFinal);

  const posHighScore = new TPoint(365, 184);
  const numberHighScore = new TSpriteNumber(cvs, imgSheet, SheetData.numberSmall, posHighScore);
  numberHighScore.setValue(scoreGold);

  const posMedal = new TPoint(201, 153);
  const spriteMedal = new TSprite(cvs, imgSheet, SheetData.medal, posMedal);

  this.draw = function () {
    spriteInfoText.draw();
    spriteBoard.draw();
    numberFinalScore.draw();
    numberHighScore.draw();
    spriteMedal.draw();
  };

  this.setFinalScore = function (aValue) {
    scoreFinal = aValue;
    if (scoreFinal > scoreGold) {
      scoreGold = scoreFinal;
      spriteMedal.setIndex(2);
      console.log("scoreGold   =", scoreGold);
    } else if (scoreFinal > scoreSilver) {
      scoreSilver = scoreFinal;
      spriteMedal.setIndex(1);
      console.log("scoreSilver =", scoreSilver);
    } else if (scoreFinal > scoreBronze) {
      spriteMedal.setIndex(3);
      scoreBronze = scoreFinal;
      console.log("scoreBronze =", scoreBronze);
    } else {
      spriteMedal.setIndex(0);
    }
    numberFinalScore.setValue(scoreFinal);
    numberHighScore.setValue(scoreGold);
  };
} // End of class TGameOverMenu

//---------------------------------------------------------------
//----------- Class TFood ---------------------------------------
//---------------------------------------------------------------
function TFood() {
  const pos = new TPoint(570, 100);
  const sprite = new TSprite(cvs, imgSheet, SheetData.food, pos);
  const amp = Math.ceil(Math.random() * 50) + 70;
  const freq = Math.ceil(Math.random() * 2) / 100;
  const sinWave = new TSinesWave(pos.y, freq, amp);
  pos.y = sinWave.getWaveValue();
  const speed = Math.ceil(Math.random() * 5) / 10;
  sprite.setSpeed(speed * 100);
  //const rect = sprite.getRectangle();
  let score = 20;
  this.eaten = false;

  this.draw = function () {
    sprite.draw();
  };

  this.update = function () {
    pos.y = sinWave.getWaveValue();
    switch (gameStatus) {
      case EGameStatus.GameOver:
      case EGameStatus.HeroIsDead:
        pos.x += speed * gameSpeed;
        break;
      default:
        pos.x -= gameSpeed / 2;
        break;
    }
    sprite.updateDestination(pos.x, pos.y);
    sprite.animate();

    if (!this.eaten) {
      if (gameProps.hero.eatFood(sprite)) {
        this.eaten = true;
        gameProps.score.addScore(score);
        score = 0;
      }
    }
  };
} // End of class TFood
//-----------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function loadGame() {
  cvs = document.getElementById("cvs");
  cvs.width = SheetData.background.width;
  cvs.height = SheetData.background.height;
  ctx = cvs.getContext("2d");

  window.addEventListener("keypress", cvsKeyPress);

  gameProps.background = new TBackground();
  gameProps.flappyBirdText = new TSprite(cvs, imgSheet, SheetData.flappyBird, { x: 195, y: 130 });
  gameProps.hero = new THero();
  //gameProps.hero.
  gameProps.startButton = new TSpriteButton(cvs, imgSheet, SheetData.btnStartGame, { x: 235, y: 250 }, runGame);
  gameProps.countDown = new TCountDown();
  gameProps.score = new TScore();
  gameProps.gameOverMenu = new TGameOverMenu();
  gameProps.music = new TSound("./media/running.mp3");

  requestAnimationFrame(drawGame);
  setInterval(updateGame, 1);
  //runGame();
}

function runGame(aEvent) {
  gameProps.startButton.disabled = true;
  //gameStatus = EGameStatus.Playing;
  gameProps.score.resetScore();
  gameProps.obstacles.length = 0;
  gameProps.foods.length = 0;
  gameProps.hero = new THero();
  gameProps.countDown.start();
  gameStatus = EGameStatus.GetReady;
}

function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  gameProps.background.drawBackground();
  switch (gameStatus) {
    case EGameStatus.Idle:
      gameProps.flappyBirdText.draw();
      gameProps.startButton.draw();
      break;
    case EGameStatus.GetReady:
      gameProps.countDown.draw();
      break;
    case EGameStatus.Playing:
      break;
  }
  gameProps.hero.draw();
  for (let i = 0; i < gameProps.obstacles.length; i++) {
    const obstacle = gameProps.obstacles[i];
    obstacle.draw();
  }
  for (let i = 0; i < gameProps.foods.length; i++) {
    const food = gameProps.foods[i];
    food.draw();
  }
  if (gameStatus === EGameStatus.GameOver) {
    gameProps.gameOverMenu.draw();
    gameProps.startButton.draw();
  }
  gameProps.score.draw();
  gameProps.background.drawGround();
  requestAnimationFrame(drawGame);
}

function updateGame() {
  switch (gameStatus) {
    case EGameStatus.Playing:
      gameProps.background.update();
      gameProps.hero.update();
      spawnObstacle();
      spawnFood();
      for (let i = 0; i < gameProps.obstacles.length; i++) {
        const obstacle = gameProps.obstacles[i];
        obstacle.update();
        const hit = obstacle.checkIfHeroHasHit();
        if (hit) {
          gameStatus = EGameStatus.HeroIsDead;
        }
        if (obstacle.heroHasPassed) {
          obstacle.updateScore();
        }
      }
      if (gameProps.obstacles.length) {
        if (gameProps.obstacles[0].isOutOfBounds) {
          gameProps.obstacles.shift();
        }
      }
      let eatenIndex = -1;
      for (let i = 0; i < gameProps.foods.length; i++) {
        const food = gameProps.foods[i];
        food.update();
        if (food.eaten) {
          eatenIndex = i;
        }
      }
      if (eatenIndex > -1) {
        gameProps.foods.splice(eatenIndex, 1);
      }
      break;
    case EGameStatus.GetReady:
    case EGameStatus.Idle:
      gameProps.hero.hover();
      break;
    case EGameStatus.HeroIsDead:
      gameProps.hero.update();
      for (let i = 0; i < gameProps.foods.length; i++) {
        const food = gameProps.foods[i];
        food.update();
      }
      break;
    case EGameStatus.GameOver:
      gameProps.startButton.disabled = false;
      for (let i = 0; i < gameProps.foods.length; i++) {
        const food = gameProps.foods[i];
        food.update();
      }
      break;
  }
}

function spawnObstacle() {
  const time = Date.now();
  if (timeSpawnObstacle.timeLast === 0) {
    timeSpawnObstacle.timeLast = time;
    timeSpawnObstacle.timeSpawn = 1500;
    return;
  }
  const timeDelta = time - timeSpawnObstacle.timeLast;
  if (timeDelta > timeSpawnObstacle.timeSpawn) {
    const obstacle = new TObstacle();
    gameProps.obstacles.push(obstacle);
    timeSpawnObstacle.timeLast = time;
    timeSpawnObstacle.timeSpawn = 1000 / gameSpeed + Math.floor(Math.random() * 3) * 1000;
  }
}

function spawnFood() {
  const time = Date.now();
  if (timeSpawnFood.timeLast === 0) {
    timeSpawnFood.timeLast = time;
    timeSpawnFood.timeSpawn = 1500;
    return;
  }
  const timeDelta = time - timeSpawnFood.timeLast;
  if (timeDelta > timeSpawnFood.timeSpawn) {
    const food = new TFood();
    gameProps.foods.push(food);
    timeSpawnFood.timeLast = time;
    timeSpawnFood.timeSpawn = 1000 / gameSpeed + Math.floor(Math.random() * 3) * 1000;
  }
}

function playSound(aSound){
  if(!soundMuted){
    aSound.play();
  }
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

export function muteSound(aEvent){
  soundMuted = aEvent.target.checked;
}

export function setDayNight(aEvent){
  isDayMode = parseInt(aEvent.target.value);
  gameProps.background.setDay(isDayMode);
  gameProps.hero.setDay(isDayMode);
}

function cvsKeyPress(aEvent) {
  switch (gameStatus) {
    case EGameStatus.Playing:
      if (aEvent.which === 32) {
        gameProps.hero.flap();
      }
      break;
  }
}

function imgSheetLoad(aEvent) {
  console.log("Sprite Sheet is loaded, game is ready to start!");
  loadGame();
}

function imgSheetError(aEvent) {
  console.log("Error loading Sprite Sheet!", aEvent.target.src);
}

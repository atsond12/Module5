"use strict";
import { TSprite, TSpriteButton } from "../lib/libSprite.js";
import { TPoint, TSinesWave } from "../lib/lib2D.js";
import { TSound } from "../lib/libSound.js";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------

const SheetData = {
  hero: { x: 0, y: 545, width: 34, height: 24, count: 4 },
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

const gameProps = {
  background: null,
  hero: null,
  countDown: null,
  flappyBirdText: null,
};

let gameSpeed = 4;

//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function TBackground() {
  const spBackground = new TSprite(cvs, imgSheet, SheetData.background, { x: 0, y: 0 });
  const groundPos = new TPoint(0, groundLevel);
  const ground = new TSprite(cvs, imgSheet, SheetData.ground, groundPos);

  this.draw = function () {
    spBackground.draw();
    ground.draw();
  };

  this.update = function () {
    groundPos.x -= gameSpeed;
    if (groundPos.x < -SheetData.ground.width / 2) {
      groundPos.x = 0;
    }
    ground.updateDestination(groundPos.x, groundPos.y);
  };
} // End of class TBackground

function THero() {
  const heroPos = new TPoint(70, 170);
  const spHero = new TSprite(cvs, imgSheet, SheetData.hero, heroPos);
  const sinWave = new TSinesWave(heroPos.y, 1, 25);
  const gravity = 9.81 / gameSpeed;
  let speed = 0;

  this.draw = function () {
    spHero.draw();
  };

  this.update = function () {
    speed += gravity;
    heroPos.y += speed;
    const height = groundLevel - (heroPos.y + SheetData.hero.height);
    if (height > 0) {
      spHero.animate();
      spHero.setRotation(speed * 2);
    } else {
      heroPos.y = groundLevel - SheetData.hero.height;
      gameStatus = EGameStatus.GameOver;
    }
    spHero.updateDestination(heroPos.x, heroPos.y);
  };

  this.hover = function () {
    sinWave.getWaveValue();
    heroPos.y = sinWave.getWaveValue();
    spHero.updateDestination(heroPos.x, heroPos.y);
    spHero.animate();
  };

  this.flap = function () {
    speed = -(gravity * 7);
  };
}

function TNumber(aCanvas, aSpi, aPos) {
  const cvs = aCanvas;
  const spi = aSpi;
  const pos = aPos;
  const spNumbers = [];
  let alpha = 100;
  this.draw = function () {
    for (let i = 0; i < spNumbers.length; i++) {
      spNumbers[i].draw();
    }
  };

  this.setAlpha = function (aAlpha) {
    alpha = aAlpha;
  };

  this.setValue = function (aValue) {
    let divider = 1;
    const digits = aValue.toString().length;
    if (digits > spNumbers.length) {
      do {
        const newPos = new TPoint(pos.x - (spi.width + 1) * spNumbers.length, pos.y);
        const newSprite = new TSprite(cvs, imgSheet, spi, newPos);
        newSprite.setAlpha(alpha);
        spNumbers.push(newSprite);
      } while (spNumbers.length < digits);
    } else if (digits < spNumbers.length) {
      do {
        spNumbers.pop();
      } while (spNumbers.length < digits);
    }
    for (let i = 0; i < spNumbers.length; i++) {
      spNumbers[i].setIndex(Math.floor(aValue / divider) % 10);
      divider *= 10;
    }
  };
} // End of class TNumber

function TCountDown() {
  const spiInfoText = SheetData.infoText;
  const posInfoText = new TPoint(185, 100);
  const spriteInfoText = new TSprite(cvs, imgSheet, spiInfoText, posInfoText);
  spriteInfoText.setIndex(0);
  const sound = new TSound("./media/countDown.mp3");

  const spiNumber = SheetData.numberBig;
  const posNumber = new TPoint(270, 170);
  const number = new TNumber(cvs, spiNumber, posNumber);
  let value = 3;
  number.setValue(value);

  function countDown() {
    value--;
    if (value > 0) {
      number.setValue(value);
      setTimeout(countDown, 1000);
    } else {
      gameStatus = EGameStatus.Playing;
    }
  }

  this.draw = function () {
    spriteInfoText.draw();
    number.draw();
  };

  this.start = function () {
    number.setValue(value);
    setTimeout(countDown, 1000);
    sound.play();
  };
} // End of class TCountDown

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
  gameProps.startButton = new TSpriteButton(cvs, imgSheet, SheetData.btnStartGame, { x: 230, y: 200 }, runGame);
  gameProps.countDown = new TCountDown();
  requestAnimationFrame(drawGame);
  setInterval(updateGame, 50);
}

function runGame(aEvent) {
  gameProps.startButton.disabled = true;
  gameStatus = EGameStatus.GetReady;
  gameProps.countDown.start();
}

function drawGame() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  gameProps.background.draw();
  switch (gameStatus) {
    case EGameStatus.Idle:
      gameProps.flappyBirdText.draw();
      gameProps.startButton.draw();
      break;
    case EGameStatus.GetReady:
      gameProps.countDown.draw();
      break;
  }
  gameProps.hero.draw();
  requestAnimationFrame(drawGame);
}

function updateGame() {
  switch (gameStatus) {
    case EGameStatus.Playing:
      gameProps.background.update();
      gameProps.hero.update();
      break;
    case EGameStatus.GetReady:
    case EGameStatus.Idle:
      gameProps.hero.hover();
      break;
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

function cvsKeyPress(aEvent) {
  if (aEvent.which === 32) {
    gameProps.hero.flap();
  }
  console.log(aEvent.which);
}

function imgSheetLoad(aEvent) {
  console.log("Sprite Sheet is loaded, game is ready to start!");
  loadGame();
}

function imgSheetError(aEvent) {
  console.log("Error loading Sprite Sheet!", aEvent.target.src);
}

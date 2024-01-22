// gameMenu.js
"use strict"
import { TPoint } from "../lib/lib2D.js";
import { TSprite, TSpriteButton, TSpriteNumber } from "../lib/libSprite.js";
import { startCountDown, gameProps, startGame} from "./FlappyBird.js"

export function TGameMenu(aCanvas, aSheetImage, aSheetData){
  const pos = new TPoint(220, 90);
  const spFlappyBird = new TSprite(aCanvas, aSheetImage, aSheetData.flappyBird, pos);
  
  pos.x += 30;
  pos.y += 100;
  const spButton = new TSpriteButton(
    aCanvas, aSheetImage, aSheetData.btnStartGame, pos, buttonClick);
  
  pos.x -= 30;
  pos.y -= 180;
  const spGetReady = new TSprite(aCanvas, aSheetImage, aSheetData.infoText, pos);  

  pos.x += 85;
  pos.y += 50;
  const spNumber = new TSpriteNumber(aCanvas, aSheetImage, aSheetData.numberBig, pos);
  let countDown = 3;
  spNumber.setValue(countDown);

  pos.x -= 90;
  //pos.y += 110;
  const spGameOver = new TSprite(aCanvas, aSheetImage, aSheetData.gameOver, pos);
  
  pos.x += 26;
  pos.y += 43;
  const spMedal = new TSprite(aCanvas, aSheetImage, aSheetData.medal, pos);
  
  pos.x += 165;
  pos.y -= 12;
  const spScore = new TSpriteNumber(aCanvas, aSheetImage, aSheetData.numberSmall, pos);

  pos.x += 0;
  pos.y += 42;
  const spHeighScore = new TSpriteNumber(aCanvas, aSheetImage, aSheetData.numberSmall, pos);
  
  pos.x = 60;
  pos.y = 10;
  const spCurrentScore = new TSpriteNumber(aCanvas, aSheetImage, aSheetData.numberBig, pos);
  spCurrentScore.setAlpha(50);

  let score = 0;
  let scoreGold = 0;
  let scoreSilver = 0;
  let scoreBronze = 0;

  spCurrentScore.setValue(score);

  this.drawIdle = function(){
    spFlappyBird.draw();
    spButton.draw();
  }

  this.drawCountDown = function(){
    spGetReady.draw();
    spNumber.draw();
  }

  this.drawGameOver = function(){
    spGetReady.draw();
    spGameOver.draw();
    spMedal.draw();
    spScore.draw();
    spHeighScore.draw();
    spButton.draw();
  }

  this.drawGameRunning = function(){
    spCurrentScore.draw();
  }

  this.setGameOver = function(){
    spGetReady.setIndex(1);
    
    spScore.setValue(score);
    if(score > scoreGold){
      scoreGold = score;
      spMedal.setIndex(2);
    }else if(score > scoreSilver){
      scoreSilver = score;
      spMedal.setIndex(1);
    }else if(score > scoreBronze){
      scoreBronze = score;
      spMedal.setIndex(3);
    }else{
      spMedal.setIndex(0);
    }
    spHeighScore.setValue(scoreGold);
    spButton.disabled = false; 
  }

  this.updateScore = function(aValue){
    score += aValue;
    spCurrentScore.setValue(score);
  }

  function doCountDown(){
    let done = false;
    countDown--;
    if(countDown <= 0){
      done = true;
    }
    spNumber.setValue(countDown);
    return done;
  }

  this.updateCountDown = function(){
    const isDone = doCountDown();
    if(isDone === false){
      setTimeout(gameProps.gameMenu.updateCountDown, 1000);
    }else{
      startGame();
    }
  }

  this.resetCountDown = function(){
    countDown = 3;
    spNumber.setValue(countDown);
    spGetReady.setIndex(0);
    score = 0;
    spCurrentScore.setValue(score);
  }
  
  function buttonClick(){
    spButton.disabled = true;
    startCountDown();
  }
}
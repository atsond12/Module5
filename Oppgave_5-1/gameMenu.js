// gameMenu.js
"use strict"
import { TPoint } from "../lib/lib2D.js";
import { TSprite, TSpriteButton, TSpriteNumber } from "../lib/libSprite.js";
import { startCountDown, gameProps, startGame} from "./FlappyBird.js"

export function TGameMenu(aCanvas, aSheetImage, aSheetData){
  const pos = new TPoint(220, 90);
  

  const spFlappyBird = new TSprite(aCanvas, aSheetImage, aSheetData.flappyBird, pos);
  pos.x += 30;
  pos.y += 110;
  const spButton = new TSpriteButton(
    aCanvas, aSheetImage, aSheetData.btnStartGame, pos, buttonClick);
  
  pos.x -= 30;
  pos.y -= 110;
  const spGetReady = new TSprite(aCanvas, aSheetImage, aSheetData.infoText, pos);  

  pos.x += 85;
  pos.y += 110;
  const spNumber = new TSpriteNumber(aCanvas, aSheetImage, aSheetData.numberBig, pos);
  let countDown = 3;
  spNumber.setValue(countDown);

  pos.x -= 90;
  //pos.y += 110;
  const spGameOver = new TSprite(aCanvas, aSheetImage, aSheetData.gameOver, pos);
  
  pos.x += 26;
  pos.y += 43;
  const spMedal = new TSprite(aCanvas, aSheetImage, aSheetData.medal, pos);
  
  pos.x += 0;
  pos.y -= 0;
  const spScore = new TSpriteNumber(aCanvas, aSheetImage, aSheetData.numberSmall, pos);

  pos.x += 0;
  pos.y += 50;
  const spHeighScore = new TSpriteNumber(aCanvas, aSheetImage, aSheetData.numberSmall, pos);


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
  }

  this.setGameOver = function(){
    spGetReady.setIndex(1);
    spMedal.setIndex(2);
    spScore.setValue(100);
    spHeighScore.setValue(200); 
  }

  function doCountDown(){
    let done = false;
    countDown--;
    spNumber.setValue(countDown);
    if(countDown <= 0){
      countDown = 3;
      done = true;
    }
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

  function buttonClick(){
    spButton.disabled = true;
    startCountDown();
  }
}
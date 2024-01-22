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
  const spMedal =
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
  }

  this.setGameOver = function(){
    spGetReady.setIndex(1);
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
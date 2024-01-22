"use strict"

import { TPoint, TSinesWave } from "../lib/lib2D.js"
import { TSprite } from "../lib/libSprite.js";
import { gameStatus, EGameStatusType, gameProps } from "./FlappyBird.js";

export function TFood(aCanvas, aSheetImage, aSheetData){
  const pos = new TPoint(aSheetData.background.width, 100);
  const sp = new TSprite(aCanvas, aSheetImage, aSheetData.food, pos);
  sp.setSpeed(50);
  const amplitude = Math.ceil(Math.random() * 100) + 50;
  const frequency = Math.ceil(Math.random() * 10) / 20;
  const wave = new TSinesWave(pos.y, frequency, amplitude);
  const speed = Math.ceil(Math.random() * 10) / 10;
  this.eaten = false;

  this.draw = function(){
    sp.draw();
  }

  this.update = function(){
    pos.y = wave.getWaveValue();
    if(gameStatus === EGameStatusType.Running){
      pos.x -= speed;
    }else{
      pos.x += (speed * 1.2);
    }
    
    sp.updateDestination(pos.x, pos.y);
    sp.animate();

    const spHero = gameProps.hero.getSprite();
    const dist = spHero.getDistanceToSpriteCenter(sp);
    if(dist < 30){
      this.eaten = true;
    }
    
  }
}
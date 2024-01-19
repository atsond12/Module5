"use strict"

import { TPoint } from "../lib/lib2D.js"
import { TSprite } from "../lib/libSprite.js";

export function TFood(aCanvas, aSheetImage, aSheetData){
  const pos = new TPoint(200, 100);
  const sp = new TSprite(aCanvas, aSheetImage, aSheetData.food, pos);

  this.draw = function(){
    sp.draw();
  }

  this.update = function(){
    sp.animate();
  }
}
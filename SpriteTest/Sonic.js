"use strict"

const SonicSprite = { x: 0, y: 125, width: 102, height: 125, count: 9};

function TSonic(aCanvas, aSpriteSheetImage){
  let left  = -SonicSprite.width;
  let top = 20;
  const sprite = new TSprite(aCanvas, aSpriteSheetImage, SonicSprite, left, top);
  
  this.draw = function(){
    sprite.draw();
  }
  
  this.animate = function(){
    sprite.animate();
    left+= 25;
    if(left> cvs.width){
      left = -SonicSprite.width;
    }
    sprite.updateDestination(left, top)
  }  
}
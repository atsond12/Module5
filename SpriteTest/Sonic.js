"use strict"

const SonicSprites = {
  SonicSprite1: { x: 0, y:   0, width: 102, height: 125, count: 5},
  SonicSprite2: { x: 0, y: 125, width: 102, height: 125, count: 9}
}

const SonicSprite = { x: 0, y: 125, width: 102, height: 125, count: 9};


function TSonic1(aCanvas, aSpriteSheetImage){
  let left  = aCanvas.width - SonicSprites.SonicSprite1.width;
  let top = 0;
  const sprite = new TSprite(aCanvas, aSpriteSheetImage, SonicSprites.SonicSprite1, left, top);
  const centerPos = sprite.getCenterPos();
  sprite.setRotation(0, centerPos.x, centerPos.y);
  sprite.setScale(100);
  sprite.setAlpha(100);
  sprite.setSpeed(10);

  sprite.addEventListener("mousemove", spriteMouseMove);
  
  this.draw = function(){
    sprite.draw();
  }
  
  this.animate = function(){
    sprite.animate();
  }  

  function spriteMouseMove(aEvent){
    cvs.style.cursor = "pointer";
  }

  
  this.collide = function(aOtherSonic){
    const otherSprite = aOtherSonic.getSprite();
    return sprite.areSpritesColliding(otherSprite);
  }
}

function TSonic2(aCanvas, aSpriteSheetImage){
  let left  = SonicSprite.width;
  let top = 0;
  const sprite = new TSprite(aCanvas, aSpriteSheetImage, SonicSprites.SonicSprite2, left, top);
  const centerPos = sprite.getCenterPos();
  sprite.setRotation(90, centerPos.x, centerPos.y);
  sprite.setScale(50);
  sprite.setAlpha(50);
  sprite.setSpeed(10);

  sprite.addEventListener("mousemove", spriteMouseMove);
  
  this.draw = function(){
    sprite.draw();
  }
  
  this.animate = function(){
    sprite.animate();
    
    left+= 1;
    if(left> cvs.width){
      left = -SonicSprite.width;
    }
    sprite.updateDestination(left, top)
    sprite.setRotation(left, centerPos.x, centerPos.y);

  }  

  function spriteMouseMove(aEvent){
    cvs.style.cursor = "pointer";
  }

  this.getSprite = function(){
    return sprite;
  }

}

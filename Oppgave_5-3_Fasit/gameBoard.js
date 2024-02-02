import { TPoint } from "../lib/lib2D.js";
import { TSprite } from "../lib/libSprite.js";

/*-----------------------------------------------------------------------------------------------------------------------
---- Class TGameBoard ---------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------*/
export function TGameBoard(aCanvas, aImageSheet, aSpriteAnimation) {
    const spa = aSpriteAnimation
    const sps = [];
  
    // Top left
    let pos = new TPoint(0, 0);
    let newSp = new TSprite(aCanvas, aImageSheet, spa.TopLeft, pos);
    sps.push(newSp);
  
    // Top Right
    pos.x = cvs.width - spa.TopRight.width;
    newSp = new TSprite(aCanvas, aImageSheet,  spa.TopRight, pos);
    sps.push(newSp);
  
    // Top Middle
    pos.x = spa.TopLeft.x + spa.TopLeft.width;
    newSp = new TSprite(aCanvas, aImageSheet,  spa.TopMiddle, pos);
    newSp.setNoneUniformScale(
        (cvs.width - (spa.TopLeft.width + spa.TopRight.width)) / spa.TopMiddle.width,
        1
    );
    sps.push(newSp);
  
    // Bottom Left
    pos.x = 0;
    pos.y = cvs.height - spa.BottomLeft.height;
    newSp = new TSprite(aCanvas, aImageSheet,  spa.BottomLeft, pos);
    sps.push(newSp);
  
    // Bottom Right
    pos.x = cvs.width - spa.BottomRight.width;
    pos.y = cvs.height - spa.BottomRight.height;
    newSp = new TSprite(aCanvas, aImageSheet,  spa.BottomRight, pos);
    sps.push(newSp);
  
    // Bottom Middle
    pos.x = spa.BottomLeft.width;
    pos.y = cvs.height - spa.BottomMiddle.height;
    newSp = new TSprite(aCanvas, aImageSheet,  spa.BottomMiddle, pos);
    newSp.setNoneUniformScale(
        (cvs.width - (spa.BottomLeft.width + spa.BottomRight.width)) / spa.BottomMiddle.width,
        1
    );
    sps.push(newSp);
  
    // Left Middle
    pos.x = 0;
    pos.y = spa.TopLeft.height;
    newSp = new TSprite(aCanvas, aImageSheet,  spa.LeftMiddle, pos);
    newSp.setNoneUniformScale(
        1,
        (cvs.height - (spa.TopLeft.height + spa.BottomLeft.height)) / spa.LeftMiddle.height
    );
    sps.push(newSp);
  
    // Right Middle
    pos.x = cvs.width - spa.RightMiddle.width;
    pos.y = spa.TopRight.height;
    newSp = new TSprite(aCanvas, aImageSheet,  spa.RightMiddle, pos);
    newSp.setNoneUniformScale(
        1,
        (cvs.height - (spa.TopRight.height + spa.BottomRight.height)) / spa.RightMiddle.height
    );
    sps.push(newSp);
  
  
    this.draw = function () {
      for (let i = 0; i < sps.length; i++) {
        sps[i].draw();
      }
    };
  }// end of class TGameBoard
  
  
  /*-----------------------------------------------------------------------------------------------------------------------
  ---- Class TRange -------------------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------*/
  function TRange(aVale, aMin, aMax){
    this.from = aVale - 1;
    this.to = aVale + 1;
    if (this.from < aMin) {
      this.from = aMin;
    }
    if (this.to >= aMax) {
      this.to = aMax - 1;
    }
  }// end of class TRange
  
  /*-----------------------------------------------------------------------------------------------------------------------
  ---- Class TNeighborRange -----------------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------*/
  export function TNeighborRange(aTable, aRow, aCol, aTableSize){
    const table = aTable;
    const row = aRow;
    const col = aCol;
    const rows = new TRange(aRow, 0, aTableSize.Row);
    const cols = new TRange(aCol, 0, aTableSize.Col);
  
    this.visitAll = function(aCallBackFunc){
      for(let i = rows.from; i <= rows.to; i++){
        for(let j = cols.from; j <= cols.to; j++){
          if(((i === row) && (j === col)) === false){
            aCallBackFunc(table[i][j]);
          }
        }
      }    
    }
  }// end of class TNeighborRange
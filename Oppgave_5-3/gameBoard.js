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


  function TNeighbour(aRow, aCol, aGameLevel){
    const tileRow = aRow;
    const tileCol = aCol;
    const from = {
      row: aRow - 1, col: aCol - 1
    }
    const to= {
      row: aRow + 1, col: aCol + 1
    }

    if(from.row < 0){
      from.row = 0;
    }
    if(from.col < 0){
      from.col = 0;
    }
    if(to.row >= aGameLevel.Tiles.Row){
      to.row = aGameLevel.Tiles.Row - 1;
    }
    if(to.col >= aGameLevel.Tile.Col){
      to.col = aGameLevel.Tiles.Col - 1;
    }

    this.visitAll = function(aTable, aVisitCallBack){
      for(let row = from.row; row < to.row; row++){
        for(let col = from.col; col < to.col; col++){
          if((tileRow !== row) && (tileCol !== col)){
            const tile = aTable[row][col];
            aVisitCallBack(tile);
          }
        }
      }
    }

  }
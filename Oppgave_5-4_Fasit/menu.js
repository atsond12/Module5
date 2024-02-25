"use strict";
import { TPoint } from "../lib/lib2D.js";
import { TSprite, TSpriteButton } from "../lib/libSprite.js";

export const EButtonSate = { Normal: 0, Active: 1, Down: 2 };
export const EContainerType = { Action: 1, StrokeColor: 2, StrokeSize: 3, ShapeType: 4, FillColor: 5 };

let imgSheet = null;
let cvs = null;
let ctx = null;

const paintObjectList = document.getElementById("paintObjectList");
const menuMousePos = new TPoint(0, 0);
let lastOverButton = null;

const PaintSheet = {
  // Draw Color Buttons
  ColorButton: {
    Black: { x: 0, y: 0, width: 40, height: 40, count: 3 },
    White: { x: 0, y: 40, width: 40, height: 40, count: 3 },
    Gray: { x: 0, y: 80, width: 40, height: 40, count: 3 },
    Burgundy: { x: 0, y: 120, width: 40, height: 40, count: 3 },
    Red: { x: 0, y: 160, width: 40, height: 40, count: 3 },
    Yellow: { x: 0, y: 200, width: 40, height: 40, count: 3 },
    Green: { x: 0, y: 240, width: 40, height: 40, count: 3 },
    Azure: { x: 0, y: 280, width: 40, height: 40, count: 3 },
    Blue: { x: 0, y: 320, width: 40, height: 40, count: 3 },
    Purple: { x: 0, y: 360, width: 40, height: 40, count: 3 },
  },
  // Stroke thickness Buttons
  StrokeSizeButton: {
    Thin: { x: 0, y: 400, width: 40, height: 40, count: 3 },
    Medium: { x: 0, y: 440, width: 40, height: 40, count: 3 },
    Thick: { x: 0, y: 480, width: 40, height: 40, count: 3 },
  },
  // Shape type buttons
  ShapeTypeButton: {
    Line: { x: 0, y: 520, width: 40, height: 40, count: 3 },
    Pen: { x: 0, y: 560, width: 40, height: 40, count: 3 },
    Circle: { x: 0, y: 600, width: 40, height: 40, count: 3 },
    Ellipse: { x: 0, y: 640, width: 40, height: 40, count: 3 },
    Rectangle: { x: 0, y: 680, width: 40, height: 40, count: 3 },
    Polygon: { x: 0, y: 720, width: 40, height: 40, count: 3 },
  },
  // Action Buttons
  ActionButton: {
    // New Button
    New: { x: 0, y: 880, width: 40, height: 40, count: 3 },
    // Eraser button
    Eraser: { x: 0, y: 760, width: 40, height: 40, count: 3 },
    // Stack move up button
    MoveUp: { x: 0, y: 800, width: 40, height: 40, count: 3 },
    // Stack move down button
    MoveDown: { x: 0, y: 840, width: 40, height: 40, count: 3 },
  },
};

const EColorType = {
  Black: "#000000",
  White: "#ffffff",
  Gray: "#7f7f7f",
  Burgundy: "#880015",
  Red: "#ed1c24",
  Yellow: "#fff200",
  Green: "#22b14c",
  Azure: "#00a2e8",
  Blue: "#3f48cc",
  Purple: "#a349a4",
};

export const EStrokeSizeType = {
  Thin: 3,
  Medium: 6,
  Thick: 12,
};

export const EShapeType = {
  Line: 1,
  Pen: 2,
  Circle: 3,
  Ellipse: 4,
  Rectangle: 5,
  Polygon: 6,
};

export const EActionType = {
  New: 1,
  Eraser: 2,
  MoveUp: 3,
  MoveDown: 4,
};

const ContainerButtons = {
  Action: {
    caption: "   New      Delete      Up     Down   ",
    buttons: PaintSheet.ActionButton,
    Type: EContainerType.Action,
    pos: { x: 0, y: 0 },
    valueList: EActionType,
  },
  StrokeColor: {
    caption: "Stroke Color",
    buttons: PaintSheet.ColorButton,
    Type: EContainerType.StrokeColor,
    pos: { x: 190, y: 0 },
    valueList: EColorType,
  },
  StrokeSize: {
    caption: "Stroke Size",
    buttons: PaintSheet.StrokeSizeButton,
    Type: EContainerType.StrokeSize,
    pos: { x: 633, y: 0 },
    valueList: EStrokeSizeType,
  },
  ShapeType: {
    caption: "Draw Shape",
    buttons: PaintSheet.ShapeTypeButton,
    Type: EContainerType.ShapeType,
    pos: { x: 0, y: 55 },
    valueList: EShapeType,
  },
  FillColor: {
    caption: "Fill Color",
    buttons: PaintSheet.ColorButton,
    Type: EContainerType.FillColor,
    pos: { x: 275, y: 55 },
    valueList: EColorType,
  },
};

const containers = [];

//------------------------------------------------------------------------------------------------------------------
//------ Classes
//------------------------------------------------------------------------------------------------------------------

function TContainerButton(aContainerInfo, aClickFunction) {
  const ci = aContainerInfo;
  let onClick = aClickFunction;
  const frame = 5,
    gap = 3;
  let width = 0,
    height = 0;
  const buttons = [];
  const caption = { text: ci.caption, x: 0, y: 0, width: ctx.measureText(ci.caption).width, height: 10 };
  let activeButton = null;
  let keys = Object.keys(ci.buttons);
  let clickObject = this;
  for (let i = 0; i < keys.length; i++) {
    const spa = ci.buttons[keys[i]];
    const ptnPos = new TPoint(ci.pos.x + frame + buttons.length * spa.width + buttons.length * gap, ci.pos.y + frame);
    const button = new TSpriteButton(cvs, imgSheet, spa, ptnPos, buttonClick, buttonDown, buttonUp);

    buttons.push(button);
    width = ptnPos.x - ci.pos.x + spa.width + frame;
    height = ptnPos.y - ci.pos.y + spa.height + frame + caption.height;
    caption.x = ci.pos.x + width / 2 - caption.width / 2;
    caption.y = ci.pos.y + height - frame;
  }

  this.draw = function () {
    //ctx.strokeRect(ci.pos.x, ci.pos.y, width, height);
    ctx.fillStyle = "black";
    ctx.fillText(caption.text, caption.x, caption.y);
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].draw();
    }
  };

  function buttonDown(aEvent, aButton) {
    aButton.setIndex(EButtonSate.Down);
    aButton.draw();
  }

  function buttonUp(aEvent, aButton) {
    aButton.setIndex(EButtonSate.Normal);
    aButton.draw();
  }

  function buttonClick(aEvent, aButton) {
    const i = buttons.indexOf(aButton);
    if (ci.Type === EContainerType.Action) {
      aButton.setIndex(EButtonSate.Normal);
      aButton.draw();
      doClick(i);
    } else {
      if (activeButton !== aButton) {
        if (activeButton) {
          activeButton.setIndex(EButtonSate.Normal);
          activeButton.draw();
        }
      }
      activeButton = aButton;
      activeButton.setIndex(EButtonSate.Active);
      activeButton.draw();
      doClick(i);
    }
  }

  function doClick(aButtonIndex) {
    if (onClick) {
      const containerIndex = containers.indexOf(clickObject);
      const containerKey = Object.keys(ContainerButtons)[containerIndex];
      const cb = ContainerButtons[containerKey];
      const buttonValue = cb.valueList[keys[aButtonIndex]];
      onClick(ci.Type, buttonValue);
    }
  }

  this.setActive = function (aButtonIndex) {
    if (aButtonIndex < buttons.length) {
      activeButton = buttons[aButtonIndex];
      activeButton.setIndex(EButtonSate.Active);
      activeButton.draw();
      doClick(aButtonIndex);
    }
  };
} // end of TContainerButton

//------------------------------------------------------------------------------------------------------------------
//------ Function and Events
//------------------------------------------------------------------------------------------------------------------

export function drawMenu() {
  paintObjectList.innerHTML = "";
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  for (let i = 0; i < containers.length; i++) {
    containers[i].draw();
  }
}

function paintObjectClick(aEvent) {
  const object = aEvent.target;
  const children = paintObjectList.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child === object) {
      if (child.classList.contains("selected")) {
        child.className = "paintObject";
      } else {
        child.className = "paintObject selected";
      }
    } else {
      child.className = "paintObject";
    }
  }
}

function menuGetCurrentPaintShape(aShapes) {
  const children = paintObjectList.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.classList.contains("selected")) {
      return child.innerText;
    }
  }
  return "";
}

export function menuAddPaintShape(aText) {
  let el = document.createElement("div");
  el.classList.add("paintObject");
  el.addEventListener("click", paintObjectClick);
  el.appendChild(document.createTextNode(aText));
  //paintObjectList.insertBefore(el, paintObjectList.firstChild);
  paintObjectList.appendChild(el);
}

export function menuRemovePaintShape(aShapes) {
  const name = menuGetCurrentPaintShape();
  const children = paintObjectList.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.innerText === name) {
      paintObjectList.removeChild(child);
      aShapes.splice(i, 1);
      break;
    }
  }
}

export function menuMovePaintShapeDown(aShapes) {
  const name = menuGetCurrentPaintShape();
  const children = paintObjectList.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.innerText === name) {
      if (i > 0) {
        paintObjectList.insertBefore(children[i], children[i - 1]);
        if (i === 0) return; // Already at the top, cannot move down
        const temp = aShapes[i];
        aShapes[i] = aShapes[i - 1];
        aShapes[i - 1] = temp;
      }
      break;
    }
  }
}

export function menuMovePaintShapeUp(aShapes) {
  const name = menuGetCurrentPaintShape();
  const children = paintObjectList.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.innerText === name) {
      if (i < children.length - 1) {
        paintObjectList.insertBefore(children[i + 1], children[i]);
        if (i === aShapes.length - 1) return; // Already at the bottom, cannot move up
        const temp = aShapes[i];
        aShapes[i] = aShapes[i + 1];
        aShapes[i + 1] = temp;
      }
      break;
    }
  }
}

export function createMenu(aClickFunction) {
  const keys = Object.keys(ContainerButtons);
  for (let i = 0; i < keys.length; i++) {
    containers.push(new TContainerButton(ContainerButtons[keys[i]], aClickFunction));
  }
  drawMenu();
  containers[1].setActive(0);
  containers[2].setActive(0);
  containers[3].setActive(0);
  containers[4].setActive(6);
}

export function initMenu(aReadyCallback) {
  imgSheet = new Image();
  imgSheet.addEventListener("load", () => {
    console.log("Sprite Sheet is loaded, Paint menu is ready!");
    cvs = document.getElementById("cvsMenu");
    ctx = cvs.getContext("2d"); //Menu context
    ctx.font = "10px Verdana";

    aReadyCallback();
  });
  imgSheet.addEventListener("error", () => {
    console.log("Error loading Sprite Sheet!", aEvent.target.src);
  });

  imgSheet.src = "./media/spriteSheet.png";
}

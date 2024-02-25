"use strict";
import { TPoint } from "../lib/lib2D.js";
import { initMenu, createMenu, drawMenu, EContainerType, EActionType, EShapeType, menuAddPaintShape, menuMovePaintShapeDown, menuMovePaintShapeUp, menuRemovePaintShape } from "./menu.js";

let cvs = null;
let ctx = null;
let divPaintObject = null;

const mousePos = new TPoint(0, 0);

const shapes = [];
let newShape = null;
let newShapeType = EShapeType.Line;
let newFillStyle = 0;
let newStrokeStyle = 0;
let newLineWidth = 0;

//------------------------------------------------------------------------------------------------------------------
//------ Classes
//------------------------------------------------------------------------------------------------------------------

function TShape() {
  const shapeType = newShapeType;
  const attr = { fillStyle: newFillStyle, strokeStyle: newStrokeStyle, lineWidth: newLineWidth };
  const points = [new TPoint(mousePos.x, mousePos.y)];
  let rubberBand = mousePos;


  function drawLineAndPen() {
    ctx.beginPath();
    let point = points[0];
    ctx.moveTo(point.x, point.y);
    for (let i = 0; i < points.length; i++) {
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }

    if (rubberBand) {
      ctx.lineTo(rubberBand.x, rubberBand.y);
    }
    ctx.stroke();
  }

  function drawCircle() {
    let startPoint = points[0];
    let endPoint;
    ctx.moveTo(startPoint.x, startPoint.y);
    for (let i = 0; i < points.length; i++) {
      endPoint = points[i];
    }

    if (rubberBand) {
      endPoint = rubberBand;
    }
    const r = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function drawEllipse() {
    let startPoint = points[0];
    let endPoint;
    ctx.moveTo(startPoint.x, startPoint.y);
    for (let i = 0; i < points.length; i++) {
      endPoint = points[i];
    }

    if (rubberBand) {
      endPoint = rubberBand;
    }
    const rx = Math.abs(startPoint.x - endPoint.x);
    const ry = Math.abs(startPoint.y - endPoint.y);

    ctx.beginPath();
    ctx.ellipse(startPoint.x, startPoint.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function drawRectangle() {
    ctx.beginPath();
    let startPoint = points[0];
    let endPoint;
    ctx.moveTo(startPoint.x, startPoint.y);
    for (let i = 0; i < points.length; i++) {
      endPoint = points[i];
    }

    if (rubberBand) {
      endPoint = rubberBand;
    }
    const w = endPoint.x - startPoint.x;
    const h = endPoint.y - startPoint.y;
    ctx.fillRect(startPoint.x, startPoint.y, w, h);
    ctx.strokeRect(startPoint.x, startPoint.y, w, h);
  }

  function drawPolygon() {
    ctx.beginPath();
    let point = points[0];
    ctx.moveTo(point.x, point.y);
    for (let i = 0; i < points.length; i++) {
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }

    if (rubberBand) {
      ctx.lineTo(rubberBand.x, rubberBand.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  this.draw = function () {
    if (points.length > 0) {
      ctx.fillStyle = attr.fillStyle;
      ctx.strokeStyle = attr.strokeStyle;
      ctx.lineWidth = attr.lineWidth;
      switch (shapeType) {
        case EShapeType.Line:
        case EShapeType.Pen:
          drawLineAndPen();
          break;
        case EShapeType.Circle:
          drawCircle();
          break;
        case EShapeType.Ellipse:
          drawEllipse();
          break;
        case EShapeType.Rectangle:
          drawRectangle();
          break;
        case EShapeType.Polygon:
          drawPolygon();
          break;
      }
    }
  };

  this.addPoint = function (isDone) {
    points.push(new TPoint(mousePos.x, mousePos.y));
    if (isDone) {
      rubberBand = null;
    }
  };

  this.close = function () {
    rubberBand = null;
  };
}

//------------------------------------------------------------------------------------------------------------------
//------ Function and Events
//------------------------------------------------------------------------------------------------------------------

function newDrawing() {
  console.log("New Drawing!");
  drawMenu();
  shapes.length = 0;
  newShape = null;
  updateDrawing();
}

function updateDrawing() {
  ctx.clearRect(0, 0, cvsPaint.width, cvsPaint.height);

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].draw();
  }
  if (newShape) {
    newShape.draw();
  }
  //requestAnimationFrame(updateDrawing);
}

function loadPaintApp() {
  createMenu(cmbClick);
  newDrawing();
  //requestAnimationFrame(updateDrawing);
}

function cmbClick(aContainerType, aValue) {
  switch (aContainerType) {
    case EContainerType.Action:
      switch (aValue) {
        case EActionType.New:
          newDrawing();
          break;
        case EActionType.Eraser:
          if (newShape) {
            newShape = null;
          } else {
            menuRemovePaintShape(shapes);
          }
          updateDrawing();
          break;
        case EActionType.MoveDown:
          menuMovePaintShapeDown(shapes);
          updateDrawing();
          break;
        case EActionType.MoveUp:   
          menuMovePaintShapeUp(shapes);
          updateDrawing();
          break;
      }
      break;
    case EContainerType.FillColor:
      newFillStyle = aValue;
      break;
    case EContainerType.ShapeType:
      newShapeType = aValue;
      break;
    case EContainerType.StrokeColor:
      newStrokeStyle = aValue;
      break;
    case EContainerType.StrokeSize:
      newLineWidth = aValue;
      break;
  }
}

function setMousePos(aEvent) {
  const bounds = cvs.getBoundingClientRect();
  mousePos.x = aEvent.clientX - bounds.left;
  mousePos.y = aEvent.clientY - bounds.top;
}

function cvsPaintMouseMove(aEvent) {
  // Mouse move over canvas
  setMousePos(aEvent);
  if (newShapeType === EShapeType.Pen) {
    if (newShape) {
      newShape.addPoint(false);
    }
  }
  if (newShape) {
    updateDrawing();
  }
}


function cvsPaintMouseDown(aEvent) {
  // Mouse button down in canvas
  if (aEvent.buttons === 1) {
    if (!newShape) {
      newShape = new TShape();
    } else {
      if (newShapeType === EShapeType.Polygon) {
        newShape.addPoint(false);
      } else {
        newShape.addPoint(true);
        shapes.push(newShape);
        menuAddPaintShape("Shape " +  shapes.length);
        newShape = null;
      }
    }
  } else if (aEvent.buttons === 2) {
    if (newShape) {
      if (newShapeType === EShapeType.Polygon) {
        newShape.close();
        shapes.push(newShape);
        menuAddPaintShape("Shape " +  shapes.length);
        newShape = null;
        updateDrawing();
      }
    }  
  }
}

function keyPress(e) {
  if (e.key === "Escape") {
    if (newShape) {
      if (newShapeType === EShapeType.Polygon) {
        newShape.close();
        shapes.push(newShape);
        menuAddPaintShape("Shape " +  shapes.length);
        newShape = null;
        updateDrawing();
      }
    }
  }
}

export function init(aEvent) {
  console.log("Initializing Paint application");
  cvs = document.getElementById("cvsPaint");
  ctx = cvs.getContext("2d");
  cvs.addEventListener("mousemove", cvsPaintMouseMove);
  cvs.addEventListener("mousedown", cvsPaintMouseDown);
  cvs.oncontextmenu = (aEvent) => {
    aEvent.preventDefault();
  };
  document.addEventListener("keyup", keyPress);

  divPaintObject = document.getElementById("divPaintObject");

  initMenu(loadPaintApp);
}

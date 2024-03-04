"use strict";
import { TPoint } from "../lib/lib2D.js";
import * as Menu from "./menu.js";

let cvs = null;
let ctx = null;

const mousePos = new TPoint(0, 0);

const shapes = [];
let newShape = null;
let currentShapeType = 0;
let currentStrokeColor = 0;
let currentStrokeSize = 0;
let currentFillColor = 0;

//------------------------------------------------------------------------------------------------------------------
//------ Classes
//------------------------------------------------------------------------------------------------------------------

function TShape() {
  const points = [new TPoint(mousePos.x, mousePos.y)];
  const type = currentShapeType;
  const strokeColor = currentStrokeColor;
  const strokeSize = currentStrokeSize;
  const fillColor = currentFillColor;

  let rubberBand = mousePos;

  this.draw = function () {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeSize;
    // her kan du sette fyll farge
    ctx.fillStyle = fillColor;
    switch (type) {
      case Menu.EShapeType.Line:
      case Menu.EShapeType.Pen:
        drawLinePen();
        break;
      case Menu.EShapeType.Circle:
        drawCircle();
        break;
      case Menu.EShapeType.Ellipse:
        drawEllipse();
        break;
      case Menu.EShapeType.Rectangle:
        drawRectangle();
        break;
      case Menu.EShapeType.Polygon:
        drawPolygon();
        break;
    }
  };

  function drawPolygon(){
    let point = points[0];

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    for(let i = 1; i < points.length; i++){
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }
    if(rubberBand){
      point = rubberBand;
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  function drawRectangle() {
    const startPoint = points[0];
    let endPoint = rubberBand;
    if (rubberBand === null) {
      endPoint = points[1];
    }
    const w = endPoint.x - startPoint.x;
    const h = endPoint.y - startPoint.y;

    ctx.beginPath();
    ctx.rect(startPoint.x, startPoint.y, w, h);
    ctx.stroke();
    ctx.fill();
  }

  function drawEllipse() {
    const center = points[0];
    let endPoint = rubberBand;
    if (rubberBand === null) {
      endPoint = points[1];
    }
    const rx = Math.abs(endPoint.x - center.x);
    const ry = Math.abs(endPoint.y - center.y);

    ctx.moveTo(center.x, center.y);
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, rx, ry, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  function drawCircle() {
    const center = points[0];
    let endPoint = rubberBand;
    if (rubberBand === null) {
      endPoint = points[1];
    }
    const dx = center.x - endPoint.x;
    const dy = center.y - endPoint.y;
    const r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    ctx.moveTo(center.x, center.y);
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  function drawLinePen() {
    ctx.beginPath();
    let point = points[0];
    ctx.moveTo(point.x, point.y);
    for (let i = 1; i < points.length; i++) {
      point = points[i];
      ctx.lineTo(point.x, point.y);
    }

    if (rubberBand !== null) {
      ctx.lineTo(rubberBand.x, rubberBand.y);
    }

    ctx.stroke();
  }

  this.addPoint = function (isDone) {
    points.push(new TPoint(mousePos.x, mousePos.y));
    switch (type) {
      case Menu.EShapeType.Line:
      case Menu.EShapeType.Circle:
      case Menu.EShapeType.Ellipse:
      case Menu.EShapeType.Rectangle:
        if (points.length === 2) {
          isDone = true;
        }
        break;
      case Menu.EShapeType.Pen:
        break;
    }

    if (isDone) {
      shapes.push(newShape);
      newShape = null;
      rubberBand = null;
    }
  };
}

//------------------------------------------------------------------------------------------------------------------
//------ Function and Events
//------------------------------------------------------------------------------------------------------------------

function newDrawing() {
  console.log("New Drawing!");
  Menu.draw();
  //Reset Paint attributes here:

  updateDrawing();
}

function updateDrawing() {
  ctx.clearRect(0, 0, cvsPaint.width, cvsPaint.height);

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    shape.draw();
  }

  if (newShape !== null) {
    newShape.draw();
  }
}

function loadPaintApp() {
  Menu.create(menuButtonClick);
  newDrawing();
}

function menuButtonClick(aContainerType, aValue) {
  // aContainerType is type of container this menu button user has clicked.
  // aValue is the value associated with the menu button user has clicked.
  const msg = `User has clicked, aContainerType = ${aContainerType}, aValue = ${aValue}`;
  console.log(msg);
  switch (aContainerType) {
    case Menu.EContainerType.ShapeType:
      currentShapeType = aValue;
      break;
    case Menu.EContainerType.StrokeColor:
      currentStrokeColor = aValue;
      break;
    case Menu.EContainerType.StrokeSize:
      currentStrokeSize = aValue;
      break;
    case Menu.EContainerType.FillColor:
      currentFillColor = aValue;
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
  if (newShape !== null) {
    if (currentShapeType === Menu.EShapeType.Pen) {
      newShape.addPoint(false);
    }
  }
  updateDrawing();
}

function cvsPaintMouseDown(aEvent) {
  // Mouse button down in canvas
  console.log(mousePos);

  if (newShape === null) {
    newShape = new TShape();
  } else {
    let isDone = currentShapeType === Menu.EShapeType.Pen;
    if(aEvent.buttons === 2){
      if(currentShapeType === Menu.EShapeType.Polygon){
        isDone = true;
      }
    }
    // Først sjekk shape type eller hvilken knapp
    // set isDone basert på om det er polygon og høyre museklikk!!!

    newShape.addPoint(isDone);
  }

  updateDrawing();
}

export function init(aEvent) {
  console.log("Initializing Paint application");
  cvs = document.getElementById("cvsPaint");
  ctx = cvs.getContext("2d");
  cvs.addEventListener("mousemove", cvsPaintMouseMove);
  cvs.addEventListener("mousedown", cvsPaintMouseDown);
  cvs.oncontextmenu = (aEvent) => aEvent.preventDefault();

  Menu.init(loadPaintApp);
}

"use strict";
import { TPoint } from "../lib/lib2D.js";
import * as Menu from "./menu.js";

let cvs = null;
let ctx = null;

const mousePos = new TPoint(0, 0);

//------------------------------------------------------------------------------------------------------------------
//------ Classes
//------------------------------------------------------------------------------------------------------------------

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
}

function setMousePos(aEvent) {
  const bounds = cvs.getBoundingClientRect();
  mousePos.x = aEvent.clientX - bounds.left;
  mousePos.y = aEvent.clientY - bounds.top;
}

function cvsPaintMouseMove(aEvent) {
  // Mouse move over canvas
  setMousePos(aEvent);
}


function cvsPaintMouseDown(aEvent) {
  // Mouse button down in canvas
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

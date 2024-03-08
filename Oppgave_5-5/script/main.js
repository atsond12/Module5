"use strict"

let containerContent = null;
const EPageStateType = {Home: 1, About: 2};
let pageState = EPageStateType.Home;

document.addEventListener("DOMContentLoaded", contentLoaded);

function contentLoaded(){
  containerContent = document.getElementById("containerContent");
  loadPageState();
  switch(pageState){
    case EPageStateType.Home:
      loadTemplate("tmWelcome", containerContent);
      break;
    case EPageStateType.About:
      loadTemplate("tmAbout", containerContent);
      break;
  }
}

function cmbShowAbout(){
  loadTemplate("tmAbout", containerContent);
  pageState = EPageStateType.About;
  writePageState();
}

function cmbShowHome(){
  loadTemplate("tmWelcome", containerContent);
  pageState = EPageStateType.Home;
  writePageState();
}

function loadTemplate(aTemplateID, aContainer){
  const tm = document.getElementById(aTemplateID);
  const cnt = tm.content.cloneNode(true);
  while(aContainer.firstChild){
    aContainer.removeChild(aContainer.firstChild);
  }
  aContainer.appendChild(cnt);
}

function loadPageState(){
  const value = localStorage.getItem("pageState");
  if(value){
    pageState = parseInt(value);
  }
}

function writePageState(){
  localStorage.setItem("pageState", pageState);
}

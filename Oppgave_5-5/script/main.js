"use strict"

let containerContent = null;
const EPageStateType = {Home: 1, About: 2, Example1: 3};
let pageState = EPageStateType.Home;

document.addEventListener("DOMContentLoaded", contentLoaded);

function contentLoaded(){
  containerContent = document.getElementById("containerContent");
  loadPageState();
  switch(pageState){
    case EPageStateType.Home:
      cmbShowHome();
      break;
    case EPageStateType.About:
      cmbShowAbout();
      break;
    case EPageStateType.Example1:
      cmbShowExample1();
      break;
  }
}

function cmbAddMovie(){
  const inpTitle = document.getElementById("inpTitle");
  const inpDirector = document.getElementById("inpDirector");
  const inpYear = document.getElementById("inpYear");
  const inpGenre = document.getElementById("inpGenre");
  const inpRating = document.getElementById("inpRating");
  const tbodyMovies = document.getElementById("tbodyMovies");
  const row = tbodyMovies.insertRow();
  let cell = row.insertCell();
  cell.appendChild(document.createTextNode(inpTitle.value));
  cell = row.insertCell();
  cell.appendChild(document.createTextNode(inpDirector.value));
  cell = row.insertCell();
  cell.appendChild(document.createTextNode(inpYear.value));
  cell = row.insertCell();
  cell.appendChild(document.createTextNode(inpGenre.value));
  cell = row.insertCell();
  cell.appendChild(document.createTextNode(inpRating.value));
}

function cmbShowExample1(){
  loadTemplate("tmExample1", containerContent);
  writePageState(EPageStateType.Example1);
}

function cmbShowAbout(){
  loadTemplate("tmAbout", containerContent);
  writePageState(EPageStateType.About);
}

function cmbShowHome(){
  loadTemplate("tmWelcome", containerContent);
  writePageState(EPageStateType.Home);
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

function writePageState(aPageState){
  pageState = aPageState;
  localStorage.setItem("pageState", pageState);
}

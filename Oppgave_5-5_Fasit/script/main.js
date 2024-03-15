"use strict"

let containerContent = null;
const EPageStateType = {Home: 1, About: 2, Example1: 3};
let pageState = EPageStateType.Home;
let movies = [];

let sortAscending = true;
let sortColumn = 0;


document.addEventListener("DOMContentLoaded", contentLoaded);

function contentLoaded(){
  containerContent = document.getElementById("containerContent");
  loadPageState();
  loadMovies();
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
  const movie = new TMovie(inpTitle, inpDirector, inpYear, inpGenre, inpRating);
  movie.addToTable(tbodyMovies);
  movies.push(movie);
  writeMovies();
}

function cmbShowExample1(){
  loadTemplate("tmExample1", containerContent);
  writePageState(EPageStateType.Example1);
  addMoviesToHtmlTable();
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

function writeMovies(){
  const jsonMovies = [];
  for(let i = 0; i < movies.length; i++){
    const movie = movies[i];
    jsonMovies.push(movie.getObject());
  }
  localStorage.setItem("movies", JSON.stringify(jsonMovies));
}

function loadMovies(){
  let jsonMovies = localStorage.getItem("movies");
  if(jsonMovies){
    jsonMovies = JSON.parse(jsonMovies);
    for(let i = 0; i < jsonMovies.length; i++){
      const jsonMovie = jsonMovies[i];
      const movie = new TMovie(
        {value: jsonMovie.title},
        {value: jsonMovie.director},
        {value: jsonMovie.year},
        {value: jsonMovie.genre},
        {value: jsonMovie.rating}
      );
        
      movies.push(movie);
    }
  }
}

function addMoviesToHtmlTable(){
  const tbodyMovies = document.getElementById("tbodyMovies");

  while(tbodyMovies.firstChild){
    tbodyMovies.removeChild(tbodyMovies.firstChild);
  }

  for(let i = 0; i < movies.length; i++){
    const movie = movies[i];
    movie.addToTable(tbodyMovies);
  }
}

function sortByColumn(aColumn){
  if(aColumn != sortColumn){
    sortColumn = aColumn;
    sortAscending = true;
  }else{
    sortAscending = !sortAscending;
  }

  movies.sort((aMovie1, aMovie2) =>{
    if(sortAscending){
      return aMovie2.sortByColumn(aColumn, aMovie1);
    }
    return aMovie1.sortByColumn(aColumn, aMovie2);
  })
  addMoviesToHtmlTable();  
}
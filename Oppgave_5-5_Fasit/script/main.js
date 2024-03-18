"use strict";

let containerContent = null;
const EPageStateType = { Home: 1, About: 2, Example1: 3, Example2: 4};
let pageState = EPageStateType.Home;
let movies = [];
let sortColumn = 0;
let sortAscending = true;

document.addEventListener("DOMContentLoaded", contentLoaded);

function contentLoaded() {
  containerContent = document.getElementById("containerContent");
  loadPageState();
  loadMovies();
  switch (pageState) {
    case EPageStateType.Home:
      cmbShowHome();
      break;
    case EPageStateType.About:
      cmbShowAbout();
      break;
    case EPageStateType.Example1:
      cmbShowExample1();
      break;
    case EPageStateType.Example2:
      cmbShowExample2();
      break;
  }
}

function cmbAddMovie() {
  const inpTitle = document.getElementById("inpTitle");
  const inpDirector = document.getElementById("inpDirector");
  const inpYear = document.getElementById("inpYear");
  const inpGenre = document.getElementById("inpGenre");
  const inpRating = document.getElementById("inpRating");
  const tbodyMovies = document.getElementById("tbodyMovies");
  const movie = new TMovie(inpTitle, inpDirector, inpYear, inpGenre, inpRating);
  movies.push(movie);
  movie.addToTable(tbodyMovies);
  writeMovies();
}

function cmbShowExample2() {
  loadTemplate("tmExample2", containerContent);
  writePageState(EPageStateType.Example2);
  loadImageCarousel();
}

function cmbShowExample1() {
  loadTemplate("tmExample1", containerContent);
  writePageState(EPageStateType.Example1);
  addMoviesToHtmlTable();
}

function cmbShowAbout() {
  loadTemplate("tmAbout", containerContent);
  writePageState(EPageStateType.About);
}

function cmbShowHome() {
  loadTemplate("tmWelcome", containerContent);
  writePageState(EPageStateType.Home);
}

function loadTemplate(aTemplateID, aContainer) {
  const tm = document.getElementById(aTemplateID);
  const cnt = tm.content.cloneNode(true);
  while (aContainer.firstChild) {
    aContainer.removeChild(aContainer.firstChild);
  }
  aContainer.appendChild(cnt);
}

function loadPageState() {
  const value = localStorage.getItem("pageState");
  if (value) {
    pageState = parseInt(value);
  }
}

function writePageState(aPageState) {
  pageState = aPageState;
  localStorage.setItem("pageState", pageState);
}

function writeMovies() {
  const jsonMovies = [];
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    jsonMovies.push(movie.getObject());
  }
  localStorage.setItem("movies", JSON.stringify(jsonMovies));
}

function loadMovies() {
  let jsonMovies = localStorage.getItem("movies");
  if (jsonMovies) {
    jsonMovies = JSON.parse(jsonMovies);
    for (let i = 0; i < jsonMovies.length; i++) {
      const jsonMovie = jsonMovies[i];
      const movie = new TMovie({ value: jsonMovie.title }, { value: jsonMovie.director }, { value: jsonMovie.year }, { value: jsonMovie.genre }, { value: jsonMovie.rating });

      movies.push(movie);
    }
  } else {
    for (let i = 0; i < myMovies.length; i++) {
      const myMovie = myMovies[i];
      const movie = new TMovie({ value: myMovie.title }, { value: myMovie.director }, { value: myMovie.year }, { value: myMovie.genre[0] }, { value: myMovie.rating });
      movies.push(movie);
    }
  }
}

function addMoviesToHtmlTable() {
  const tbodyMovies = document.getElementById("tbodyMovies");

  while (tbodyMovies.firstChild) {
    tbodyMovies.removeChild(tbodyMovies.firstChild);
  }

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    movie.addToTable(tbodyMovies);
  }
}

function sortByColumn(aColumn) {
  if (sortColumn !== aColumn) {
    sortAscending = true;
  } else {
    sortAscending = !sortAscending;
  }
  sortColumn = aColumn;
  movies.sort(sortMovies);
  addMoviesToHtmlTable();
}

function sortMovies(aMovie1, aMovie2) {
  if (sortAscending) {
    return aMovie2.sortMovie(aMovie1, sortColumn);
  }
  return aMovie1.sortMovie(aMovie2, sortColumn);
}

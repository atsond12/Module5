"use strict"

let movies = null

function cmbShowExample1(){
  loadTemplate("tmExample1", containerContent);
  writePageState(EPageStateType.Example1);

  loadMovies(showMovies);

}

function showMovies(aMovies){
  movies = aMovies;
  const tbodyMovies = document.getElementById("tbodyMovies");
  
  for(let i = 0; i < movies.length; i++){
    const movie = movies[i];
    const row = tbodyMovies.insertRow();
    let cell = row.insertCell();
    cell.appendChild(document.createTextNode(movie.title));
    cell = row.insertCell();
    cell.appendChild(document.createTextNode(movie.year));
    cell = row.insertCell();
    cell.appendChild(document.createTextNode(movie.director));
    cell = row.insertCell();
    cell.appendChild(document.createTextNode(movie.rating.toFixed(1)));
    cell = row.insertCell();
    const genres = movie.genres;
    let text = "";
    for(let g = 0; g < genres.length; g++){
      const genere = genres[g];
      if(g > 0){
        text += ", ";
      }
      text += MovieGenres[genere].text;
    }
    cell.appendChild(document.createTextNode(text));
  }
}
"use strict"

function TMovie(aTitle, aDirector, aYear, aGenre, aRating){
  const title = aTitle.value;
  const director = aDirector.value;
  const year = parseInt(aYear.value);
  const genre = aGenre.value;
  const rating = parseFloat(aRating.value);

  this.addToTable = function(aTableBody){
   const row = aTableBody.insertRow();
   let cell =  row.insertCell();
   cell.appendChild(document.createTextNode(title));
   cell =  row.insertCell();
   cell.appendChild(document.createTextNode(director));
   cell =  row.insertCell();
   cell.appendChild(document.createTextNode(year));
   cell =  row.insertCell();
   cell.appendChild(document.createTextNode(genre));
   cell =  row.insertCell();
   cell.appendChild(document.createTextNode(rating.toFixed(1)));

   const tdNumberOfMovies = document.getElementById("tdNumberOfMovies");
   tdNumberOfMovies.innerText = movies.length.toString();
  }

  this.getObject = function(){
    return {
      title: title, director: director, year: year, genre: genre, rating: rating
    }
  }
}
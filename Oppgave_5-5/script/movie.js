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
   cell.appendChild(document.createTextNode(rating));
  }
}
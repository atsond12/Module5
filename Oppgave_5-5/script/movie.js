"use strict"

function TMovie(aTitle, aDirector, aYear, aGenre, aRating){
  const title = aTitle.value;
  const director = aDirector.value;
  const year = parseInt(aYear.value);
  const genre = aGenre.value;
  const rating = parseFloat(aRating.value);

  this.addToTable = function(aTableBody){
   const row = aTableBody.insertRow();
    
  }
}
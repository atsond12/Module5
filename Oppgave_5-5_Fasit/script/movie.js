"use strict"
const EMovieColumnName = {Title: 1, Director: 2, Year: 3, Genre: 4, Rating: 5};

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

  this.sortMovie = function(aMovie, aColumn){
    switch(aColumn){
      case EMovieColumnName.Title:
        return aMovie.compareTitle(title);
      case EMovieColumnName.Director:
        return aMovie.compareDirector(director);
      case EMovieColumnName.Year:
        return aMovie.compareYear(year);
      case EMovieColumnName.Genre:
        return aMovie.compareGenre(genre);
      case EMovieColumnName.Rating:
        return aMovie.compareRating(rating);

    }
  }

  this.compareTitle = function(aTitle){
    return title.localeCompare(aTitle);
  }

  this.compareDirector = function(aDirector){
    return director.localeCompare(aDirector);
  }

  this.compareYear = function(aYear){
    return year - aYear;
  }

  this.compareGenre = function(aGenre){
    return genre.localeCompare(aGenre);
  }

  this.compareRating = function(aRating){
    return rating - aRating;
  }
}
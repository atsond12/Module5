"use strict";

const EMovieColumnName = { Title: 1, Director: 2, Year: 3, Genre: 4, Rating: 5 };

function TMovie(aTitle, aDirector, aYear, aGenre, aRating) {
  const title = aTitle.value;
  const director = aDirector.value;
  const year = parseInt(aYear.value);
  const genre = aGenre.value;
  const rating = parseFloat(aRating.value);

  function updateMoveCount() {
    const tdNumberOfMovies = document.getElementById("tdNumberOfMovies");
    tdNumberOfMovies.innerText = movies.length.toString();
  }

  this.addToTable = function (aTableBody) {
    const row = aTableBody.insertRow();
    row.style = "text-align: left";
    let cell = row.insertCell();
    cell.appendChild(document.createTextNode(title));
    cell = row.insertCell();
    cell.appendChild(document.createTextNode(director));
    cell = row.insertCell();
    cell.appendChild(document.createTextNode(year));
    cell = row.insertCell();
    cell.appendChild(document.createTextNode(genre));
    cell = row.insertCell();
    cell.appendChild(document.createTextNode(rating.toFixed(1)));
    updateMoveCount();
  };

  this.getObject = function () {
    return {
      title: title,
      director: director,
      year: year,
      genre: genre,
      rating: rating,
    };
  };

  this.sortByColumn = function (aColumn, aMovie) {
    let compareValue;
    switch (aColumn) {
      case EMovieColumnName.Title:
        return aMovie.sortByTitle(title);
      case EMovieColumnName.Director:
        return aMovie.sortByDirector(director);
      case EMovieColumnName.Year:
        compareValue = aMovie.sortByYear(year);
        if (compareValue === 0) {
          return aMovie.sortByTitle(title);
        }
        return compareValue;
      case EMovieColumnName.Genre:
        return aMovie.sortByGenre(genre);
      case EMovieColumnName.Rating:
        compareValue = aMovie.sortByRating(rating);
        if (compareValue === 0) {
          return aMovie.sortByTitle(title);
        }
        return compareValue;
    }
  };

  this.sortByTitle = function (aTitle) {
    return title.localeCompare(aTitle);
  };

  this.sortByDirector = function (aDirector) {
    return director.localeCompare(aDirector);
  };

  this.sortByYear = function (aYear) {
    return year - aYear;
  };

  this.sortByGenre = function (aGenre) {
    return genre.localeCompare(aGenre);
  };

  this.sortByRating = function (aRating) {
    return rating - aRating;
  };
}

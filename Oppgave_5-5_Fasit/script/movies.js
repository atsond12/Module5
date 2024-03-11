
const MovieGenres = {
  Comedy       : {value:  1, text: "Komedie"          },
  Fantasy      : {value:  2, text: "Fantasi"          }, 
  Crime        : {value:  3, text: "Krim"             },
  Drama        : {value:  4, text: "Drama"            },
  Music        : {value:  5, text: "Musikk"           },
  Adventure    : {value:  6, text: "Eventyr"          },
  History      : {value:  7, text: "Historie"         },
  Thriller     : {value:  8, text: "Thriller"         },
  Animation    : {value:  9, text: "Animasjon"        },
  Family       : {value: 10, text: "Familie"          },
  Mystery      : {value: 11, text: "Mysterie"         },
  Biography    : {value: 12, text: "Biografi"         },
  Action       : {value: 13, text: "Action"           },
  Romance      : {value: 14, text: "Romantikk"        },
  Sci_Fi       : {value: 15, text: "Science fiction"  },
  War          : {value: 16, text: "Krig"             },
  Western      : {value: 17, text: "Western"          },
  Horror       : {value: 18, text: "Skrekk"           },
  Musical      : {value: 19, text: "Musikal"          },
  Sport        : {value: 20, text: "Sport"            }
};

function loadMovies(aDoneLoadCallback){
  fetch('./script/movies.json')
  .then((response) => response.json())
  .then((json) => {aDoneLoadCallback(json)});
}
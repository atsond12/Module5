"use strict"

const ImageFileObjects = [
  { id:  1, fn: "./img/img_01.png", caption: "Colorado mountain  1" },
  { id:  2, fn: "./img/img_02.png", caption: "Colorado Horseshoe bend" },
  { id:  3, fn: "./img/img_03.png", caption: "Colorado mountain  2" },
  { id:  4, fn: "./img/img_04.png", caption: "European mountain  1" },
  { id:  5, fn: "./img/img_05.png", caption: "European mountain  2" },
  { id:  6, fn: "./img/img_06.png", caption: "European mountain  3" },
  { id:  7, fn: "./img/img_07.png", caption: "European mountain  4" },
  { id:  8, fn: "./img/img_08.png", caption: "European mountain  5" },
  { id:  9, fn: "./img/img_09.png", caption: "Grand Canyon  1" },
  { id: 10, fn: "./img/img_10.png", caption: "Grand Canyon  2" },
];

let divImageCarousel = null;
let currentHtmlImage = null;
let divCarouselIndicator = null;

function THtmlImage(aIndex, aPrev = null){
  const imgObj = ImageFileObjects[aIndex++];
  const prev = aPrev
  let next = null;
  if(aIndex < ImageFileObjects.length){
    next = new THtmlImage(aIndex, this);
  }
  const img = new Image();
  img.alt = imgObj.caption;
  img.src = imgObj.fn;
  img.width = 1024;
  //<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
  const htmlButton = document.createElement("button");
  htmlButton.setAttribute("data-bs-target", "#divCarouselIndicator");
  htmlButton.setAttribute("data-bs-slide-to", "0");
  htmlButton.setAttribute("aria-current", "true");
  htmlButton.setAttribute("type", "button");
  htmlButton.classList.add("active");
  divCarouselIndicator.appendChild(htmlButton);

  function hide(){
    while(divImageCarousel.firstChild){
      divImageCarousel.removeChild(divImageCarousel.firstChild);
    }
  }

  this.show = function(){
    hide();
    divImageCarousel.appendChild(img);
  }

  this.showPrev = function(){
    if(prev){
      prev.show();
      currentHtmlImage = prev;
    }
  }

  this.showNext = function(){
    if(next){
      next.show();
      currentHtmlImage = next;
    }
  }
}

function loadImageCarousel(){
  divImageCarousel = document.getElementById("divImageCarousel");
  divCarouselIndicator = document.getElementById("divCarouselIndicator");
  
  currentHtmlImage = new THtmlImage(0);
  currentHtmlImage.show();
  
}

function showPrevImage(){
  currentHtmlImage.showPrev();
}

function showNextImage(){
  currentHtmlImage.showNext();
}
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

let currentHtmlImage = null;
let carouselIndicators = null;
let divImageCarousel = null;

function THtmlImage(aImageFileIndex, aPrev = null) {
  const htmlImage = this;
  const imgObj = ImageFileObjects[aImageFileIndex++];
  let prev = aPrev;
  let next = null;
  if (aImageFileIndex < ImageFileObjects.length) {
    next = new THtmlImage(aImageFileIndex, this);
  }
  const image = new Image();
  image.width = 500;
  image.alt = imgObj.caption;
  image.src = imgObj.fn;

  const indicatorButton = document.createElement("button");
  indicatorButton.type = "button";
  indicatorButton.setAttribute("data-bs-target", "#imageCarousel");
  indicatorButton.setAttribute("data-bs-slide-to", imgObj.id - 1); // Adjust index
  indicatorButton.addEventListener("click", () =>{
    currentHtmlImage.hide();
    currentHtmlImage = htmlImage;
    currentHtmlImage.show();
  });
  carouselIndicators.insertBefore(indicatorButton, carouselIndicators.firstChild);

  this.toString = function (aStr = undefined) {
    if (aStr) {
      aStr += "\r\n";
    } else {
      aStr = "";
    }
    aStr += imgObj.caption;
    if (next) {
      aStr = next.toString(aStr);
    }
    return aStr;
  };

  this.show = function () {
    indicatorButton.classList.add("active");
    divImageCarousel.appendChild(image); // Append image to the div
    console.log(imgObj.caption);
  };

  this.showPrev = function () {
    if (prev) {
      currentHtmlImage.hide();
      currentHtmlImage = prev;
      currentHtmlImage.show();
    }
  };

  this.showNext = function () {
    if (next) {
      currentHtmlImage.hide();
      currentHtmlImage = next;
      currentHtmlImage.show();
    }
  };

  this.hide = function(){
    indicatorButton.classList.remove("active");
    divImageCarousel.innerHTML = ""; // Clear previous content
  }
}

function loadImageCarousel() {
  carouselIndicators = document.getElementById("carouselIndicators");
  divImageCarousel = document.getElementById("divImageCarousel");
  currentHtmlImage = new THtmlImage(0);
  currentHtmlImage.show(divImageCarousel);
  console.log(currentHtmlImage.toString());
}

function showPrevImage(){
  currentHtmlImage.showPrev();
}

function showNextImage(){
  currentHtmlImage.showNext();  
}

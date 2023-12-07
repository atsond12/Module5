// Point class for x and y positions
function TPoint(aX, aY) {
  this.x = aX;
  this.y = aY;
}

// TBoundRectangle class
function TBoundRectangle(aX, aY, aWidth, aHeight) {
  // Private variables
  let left = aX;
  let top = aY;
  let width = aWidth;
  let height = aHeight;
  let right = left + width;
  let bottom = top + height;

  // Private method to check for overlap along the X-axis
  function overlapsX(aOther) {
    return right > aOther.left && left < aOther.right;
  }

  // Private method to check for overlap along the Y-axis
  function overlapsY(aOther) {
    return bottom > aOther.top && top < aOther.bottom;
  }

  // Public method to check for collision with another TBoundRectangle
  this.collidesWith = function (aOther) {
    const overlapX = overlapsX(aOther);
    const overlapY = overlapsY(aOther);
    return overlapX && overlapY;
  };

  // Public method to update the size of the bounding box
  this.updateSize = function (aNewWidth, aNewHeight) {
    // Update width and height properties
    width = aNewWidth;
    height = aNewHeight
    right = left + width;
    bottom = top + height;
  };

  // Public method to update the TBoundRectangle's position
  this.updatePosition = function (newX, newY) {
    left = newX;
    top = newY;
    right = left + width;
    bottom = top + height;
  };

  // Public method to check for collision with another TBoundRectangle
  this.collidesWith = function (aOther) {
    const overlapX = overlapsX(aOther);
    const overlapY = overlapsY(aOther);
    return overlapX && overlapY;
  };
}

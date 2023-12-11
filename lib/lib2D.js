/**
 * Represents a point in 2D space with x and y coordinates.
 *
 * @class
 * @classdesc
 * The `TPoint` class is used to create objects that represent points
 * in a two-dimensional space.
 *
 * @param {number} aX - The x-coordinate of the point.
 * @param {number} aY - The y-coordinate of the point.
 */
function TPoint(aX, aY) {
  /**
   * The x-coordinate of the point.
   *
   * @member {number}
   */
  this.x = aX;

  /**
   * The y-coordinate of the point.
   *
   * @member {number}
   */
  this.y = aY;
}

/**
 * Represents a bounding rectangle in 2D space with position (x, y) and size (width, height).
 *
 * @class
 * @classdesc
 * The `TBoundRectangle` class is used to create objects that represent bounding rectangles
 * in a two-dimensional space.
 *
 * @param {number} aX - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} aY - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} aWidth - The width of the rectangle.
 * @param {number} aHeight - The height of the rectangle.
 */
function TBoundRectangle(aX, aY, aWidth, aHeight) {
  // Private variables
  const rect = this;
  this.left = aX;
  this.top = aY;
  this.width = aWidth;
  this.height = aHeight;
  this.right = rect.left + rect.width;
  this.bottom = rect.top + rect.height;

  /**
   * Private method to check for overlap along the X-axis.
   *
   * @private
   * @param {TBoundRectangle} aOther - Another bounding rectangle to check for overlap.
   * @returns {boolean} True if there is an overlap along the X-axis, otherwise false.
   */
  function overlapsX(aOther) {
    return rect.right > aOther.left && rect.left < aOther.right;
  }

  /**
   * Private method to check for overlap along the Y-axis.
   *
   * @private
   * @param {TBoundRectangle} aOther - Another bounding rectangle to check for overlap.
   * @returns {boolean} True if there is an overlap along the Y-axis, otherwise false.
   */
  function overlapsY(aOther) {
    return rect.bottom > aOther.top && rect.top < aOther.bottom;
  }

  /**
   * Public method to check for collision with another `TBoundRectangle`.
   *
   * @param {TBoundRectangle} aOther - Another bounding rectangle to check for collision.
   * @returns {boolean} True if there is a collision, otherwise false.
   */
  this.collidesWith = function (aOther) {
    const overlapX = overlapsX(aOther);
    const overlapY = overlapsY(aOther);
    return overlapX && overlapY;
  };

  /**
   * Public method to update the size of the bounding box.
   *
   * @param {number} aNewWidth - The new width of the rectangle.
   * @param {number} aNewHeight - The new height of the rectangle.
   */
  this.updateSize = function (aNewWidth, aNewHeight) {
    // Update width and height properties
    rect.width = aNewWidth;
    rect.height = aNewHeight;
    rect.right = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;
  };

  /**
   * Public method to update the `TBoundRectangle`'s position.
   *
   * @param {number} newX - The new x-coordinate of the top-left corner of the rectangle.
   * @param {number} newY - The new y-coordinate of the top-left corner of the rectangle.
   */
  this.updatePosition = function (newX, newY) {
    rect.left = newX;
    rect.top = newY;
    rect.right = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;
  };
}

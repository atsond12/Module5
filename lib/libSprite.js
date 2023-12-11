/*
  Library for sprite animation
*/

"use strict";

//TSprite instances that is listen to events from canvas
const spriteEventInstances = { };

// Constructor function for TSprite
/**
 * Represents a sprite with animation, position, and interaction capabilities.
 *
 * @class
 * @classdesc
 * The `TSprite` class is used to create animated sprites with various properties.
 *
 * @param {HTMLCanvasElement} aCanvas - The HTML canvas element to draw the sprite on.
 * @param {HTMLImageElement} aSpriteSheetImage - The image containing the sprite sheet.
 * @param {SpriteAnimation} aSpriteAnimation - The sprite animation configuration.
 * @param {number} aDestinationX - The x-coordinate of the destination point on the canvas.
 * @param {number} aDestinationY - The y-coordinate of the destination point on the canvas.
 */
function TSprite(aCanvas, aSpriteSheetImage, aSpriteAnimation, aDestinationX, aDestinationY) {
  // Get the canvas context once during initialization
  const sprite = this;
  const cvs = aCanvas;
  const ctx = cvs.getContext("2d");
  const destination = new TPoint(aDestinationX, aDestinationY);
  const img = aSpriteSheetImage;

  const spi = aSpriteAnimation;
  let currentFrameIndex = 0;
  let animationCounter = 0;
  let scale = 1.0;
  let speed = 1.0;
  let alpha = 1.0;
  let scaledWidth = spi.width * scale;
  let scaledHeight = spi.height * scale;
  let boundingBox = new TBoundRectangle(destination.x, destination.y, scaledWidth, scaledHeight);
  const canvasRect = cvs.getBoundingClientRect();

  let rotRad = 0;
  let pivotPoint = new TPoint(0, 0);

  // Event listeners
  const eventListeners = {};

  // Public method to draw the current sprite on the canvas
  /**
   * Public method to draw the current sprite on the canvas.
   *
   * @method
   * @memberof TSprite
   * @return {void}
   */
  this.draw = function () {
    // Save the current context state
    ctx.save();

    // Translate to the destination point
    ctx.translate(destination.x, destination.y);

    // Translate to the pivot point
    ctx.translate(pivotPoint.x, pivotPoint.y);

    // Rotate the sprite
    ctx.rotate(rotRad);

    // Set the alpha value before drawing
    ctx.globalAlpha = alpha;
    const x = currentFrameIndex * spi.width;
    const y = spi.y;

    ctx.drawImage(
      img,
      x,
      y,
      spi.width,
      spi.height,
      // Destination coordinates (after translation and rotation)
      -scaledWidth / 2,
      -scaledHeight / 2,
      // Destination dimensions (scaled)
      scaledWidth,
      scaledHeight
    );

    // Restore the previous context state
    ctx.restore();
  };

  /**
   * Public method to set animation speed.
   *
   * @method
   * @memberof TSprite
   * @param {number} aNewSpeed - The new speed value.
   * @return {void}
   */
  this.setSpeed = function (aNewSpeed) {
    speed = Math.max(0, Math.min(aNewSpeed / 100, 1));
  };

  /**
   * Public method to update the destination point of the sprite.
   *
   * @method
   * @memberof TSprite
   * @param {number} aNewX - The new x-coordinate of the destination point.
   * @param {number} aNewY - The new y-coordinate of the destination point.
   * @return {void}
   */
  this.updateDestination = function (aNewX, aNewY) {
    destination.x = aNewX;
    destination.y = aNewY;

    // Update TBoundRectangle instance based on the new destination
    boundingBox.updatePosition(destination.x, destination.y);
  };

  /**
   * Public method to set the sprite's uniform scale with a percentage value
   *
   * @method
   * @memberof TSprite
   * @param {number} aScalePercentage - The scale in %, 100% is no scale.
   * @return {void}
   */
  this.setScale = function (aScalePercentage) {
    // Convert percentage value to scale factor
    const scaleFactor = aScalePercentage / 100;

    // Set the uniform scale value
    scale = scaleFactor;

    scaledWidth = spi.width * scale;
    scaledHeight = spi.height * scale;

    // Update TBoundRectangle instance based on the new scale
    boundingBox.updateSize(scaledWidth, scaledHeight);
  };

  /**
   * Public method to set the alpha (transparency) of the sprite.
   *
   * @method
   * @memberof TSprite
   * @param {number} aNewAlpha - The transparency in %, 100% is full opacity.
   * @return {void}
   */
  this.setAlpha = function (aNewAlpha) {
    // Ensure the alpha value is between 0 and 100
    alpha = Math.max(0, Math.min(aNewAlpha / 100, 1));
  };

  /**
   * Public method to animate to the next frame based on speed
   *
   * @method
   * @memberof TSprite
   * @return {void}
   */
  this.animate = function () {
    if (!spi || speed === 0.0) return;

    animationCounter += speed;
    if (animationCounter >= 1.0) {
      currentFrameIndex = (currentFrameIndex + 1) % spi.count;
      animationCounter = 0; // Reset the counter after advancing to the next frame
    }
  };

  /**
   * Public method to set rotation angle and pivot point.
   *
   * @method
   * @memberof TSprite
   * @param {number} angleInDegrees - The rotation angle in degrees.
   * @param {number} pivotX - The x-coordinate of the pivot point.
   * @param {number} pivotY - The y-coordinate of the pivot point.
   */
  this.setRotation = function (angleInDegrees, pivotX, pivotY) {
    rotRad = angleInDegrees * (Math.PI / 180);
    pivotPoint.x = pivotX;
    pivotPoint.y = pivotY;
  };

  /**
   * Public method to get the center position of the sprite.
   *
   * @method
   * @memberof TSprite
   * @returns {TPoint} The center position of the sprite.
   */
  this.getCenterPos = function () {
    // Calculate the center position based on destination, width, and height
    const centerX = /*destination.x + */ scaledWidth / 2;
    const centerY = /*destination.y + */ scaledHeight / 2;

    return new TPoint(centerX, centerY);
  };

  /**
   * Public method to check for collision with another `TSprite`.
   *
   * @method
   * @memberof TSprite
   * @param {TSprite} aOtherSprite - Another sprite to check for collision.
   * @returns {boolean} True if there is a collision, otherwise false.
   */
  this.areSpritesColliding = function (aOtherSprite) {
    // Use TBoundRectangle instances to check for collision
    return aOtherSprite.checkCollisionWithBoundRectangle(boundingBox);
  };

  // Public method to check for collision with a TBoundRectangle
  /**
   * Public method to check for collision with a `TBoundRectangle`.
   *
   * @method
   * @memberof TSprite
   * @param {TBoundRectangle} aOtherBoundingBox - The bounding rectangle to check for collision.
   * @returns {boolean} True if there is a collision, otherwise false.
   */
  this.checkCollisionWithBoundRectangle = function (aOtherBoundingBox) {
    return boundingBox.collidesWith(aOtherBoundingBox);
  };

  // Internal method to trigger event listeners for a specific event
  function triggerEventListeners(aEventName, aEvent) {
    const listeners = eventListeners[aEventName];
    if (listeners) {
      listeners.forEach((listener) => {
        listener.call(sprite, aEvent);
      });
    }
  }

  // Private method to check if a point is inside an oval.
  function isPointInsideOval(aPointX, aPointY) {
    const centerX = destination.x + spi.width / 2;
    const centerY = destination.y + spi.height / 2;

    // Consider scale factor in radius calculation
    const scaledRadiusX = scaledWidth / 2;
    const scaledRadiusY = scaledHeight / 2;

    const normalizedX = (aPointX - centerX) / scaledRadiusX;
    const normalizedY = (aPointY - centerY) / scaledRadiusY;

    return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
  }

  // Event handlers

    /**
   * Public method to add an event listener.
   *
   * @method
   * @memberof TSprite
   * @param {string} aEventName - The event name.
   * @param {function} aEventFunc - The callback function for this event.
   * @return {void}
   */
    this.addEventListener = function (aEventName, aEventFunc) {
      let listeners = eventListeners[aEventName];
      if (!listeners) {
        listeners = [];
        eventListeners[aEventName] = listeners;
        attachCanvasEventListener(aEventName);
      }
      listeners.push(aEventFunc);
    };
  
    /**
     * Public method to remove an event listener.
     *
     * @method
     * @memberof TSprite
     * @param {string} aEventName - The event name.
     * @param {function} aEventFunc - The callback function for this event.
     */
    this.removeEventListener = function (aEventName, aEventFunc) {
      const listeners = eventListeners[aEventName];
      if (listeners) {
        const index = listeners.indexOf(aEventFunc);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
        if (listeners.length === 0) {
          delete eventListeners[aEventName];
          detachCanvasEventListener(aEventName);
        }
      }
    };

  // decide witch handling function to use base on event name
  function attachCanvasEventListener(aEventName) {
    if(!spriteEventInstances[aEventName]){
      spriteEventInstances[aEventName] = [];
    }
    spriteEventInstances[aEventName].push(sprite);
    switch (aEventName) {
      case "mousedown":
        cvs.addEventListener(aEventName, handleMouseDown, false);
        break;
      case "mouseup":
        cvs.addEventListener(aEventName, handleMouseUp, false);
        break;
      case "mousemove":
        cvs.addEventListener(aEventName, handleMouseMove, false);
        break;
    }
  }

  // Decide which handling function to remove based on the event name
  function detachCanvasEventListener(aEventName) {
    switch (aEventName) {
      case "mousedown":
        cvs.removeEventListener(aEventName, handleMouseDown, false);
        break;
      case "mouseup":
        cvs.removeEventListener(aEventName, handleMouseUp, false);
        break;
      case "mousemove":
        cvs.removeEventListener(aEventName, handleMouseMove, false);
        break;
      // ... add more cases as needed ...
    }
    if(spriteEventInstances[aEventName]){
      delete spriteEventInstances[aEventName];
    }
  }

  // Handle mouse down event
  this.handleMouseDown = function (aEvent) {
    if (isPointInsideOval(aEvent.clientX, aEvent.clientY)) {
      triggerEventListeners("mousedown", aEvent);
    }
  };

  // Handle mouse up event
  this.handleMouseUp = function (aEvent) {
    if (isPointInsideOval(aEvent.clientX, aEvent.clientY)) {
      triggerEventListeners("mouseup", aEvent);
    }
  };

  // Handle mouse move event
  this.handleMouseMove = function (aEvent) {
    // Adjust mouse coordinates to be relative to the canvas
    const mouseX = aEvent.clientX - canvasRect.left;
    const mouseY = aEvent.clientY - canvasRect.top;

    if (isPointInsideOval(mouseX, mouseY)) {
      triggerEventListeners("mousemove", aEvent);
    }
  };
}

// Handle mouse move event globally for all instances of TSprite
function handleMouseMove(aEvent) {
  // Iterate over instances and trigger event listeners
  cvs.style.cursor = "default";
  spriteEventInstances.mousemove.forEach((sprite) => {
    sprite.handleMouseMove(aEvent);
  });
}

// Handle mouse move event globally for all instances of TSprite
function handleMouseDown(aEvent) {
  // Iterate over instances and trigger event listeners
  spriteEventInstances.mousedown.forEach((sprite) => {
    sprite.handleMouseDown(aEvent);
  });
}

// Handle mouse move event globally for all instances of TSprite
function handleMouseUp(aEvent) {
  // Iterate over instances and trigger event listeners
  spriteEventInstances.mouseup.forEach((sprite) => {
    sprite.handleMouseUp(aEvent);
  });
}

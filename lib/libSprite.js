/*
  Library for sprite animation
*/

"use strict";

// Constructor function for TSprite
function TSprite(aCanvas, aSpriteSheetImage, aSpriteAnimation, aDestinationX, aDestinationY) {
  // Get the canvas context once during initialization
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
  let boundingBox = new TBoundRectangle(
    destination.x,
    destination.y,
    scaledWidth,
    scaledHeight
  );
  // Event listeners
  const eventListeners = {};

  // Public method to draw the current sprite on the canvas
  this.draw = function () {
    // Save the current context state
    ctx.save();

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
      // Destination coordinates
      destination.x,
      destination.y,
      // Destination dimensions (scaled)
      scaledWidth,
      scaledHeight
    );

    // Restore the previous context state
    ctx.restore();
  };

  this.updateDestination = function(aNewX, aNewY) {
    destination.x = aNewX;
    destination.y = aNewY;

    // Update TBoundRectangle instance based on the new destination
    boundingBox.updatePosition(
      destination.x,
      destination.y
    );
  }
  // Public method to set the sprite's scale
  this.setScale = function (aScale) {
    scale = aScale;
    scaledWidth = spi.width * scale;
    scaledHeight = spi.height * scale;
    // Update TBoundRectangle instance based on the new scale
    boundingBox.updateSize(scaledWidth, scaledHeight);
  };

  // Public method to set the alpha (transparency) of the sprite
  this.setAlpha = function (aNewAlpha) {
    // Ensure the alpha value is between 0 and 100
    alpha = Math.max(0, Math.min(aNewAlpha / 100, 1));
  };

  // Public method to animate to the next frame based on speed
  this.animate = function () {
    if (!spi || speed === 0.0) return;

    animationCounter += speed;
    if (animationCounter >= 1.0) {
      currentFrameIndex = (currentFrameIndex + 1) % spi.count;
      animationCounter = 0; // Reset the counter after advancing to the next frame
    }
  };

  // Public method to add an event listener
  this.addEventListener = function (aEventName, aEventFunc) {
    const listeners = eventListeners[aEventName];
    if (!listeners) {
      listeners = [];
      attachCanvasEventListener(aEventName);
    }
    listeners.push(aEventFunc);
  };

  // Public method to remove an event listener
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

    // Public method to check for collision with another TSprite
    this.areSpritesColliding = function (aOtherSprite) {
      // Use TBoundRectangle instances to check for collision
      return aOtherSprite.checkCollisionWithBoundRectangle(boundingBox);
    };
  
    // Public method to check for collision with a TBoundRectangle
    this.checkCollisionWithBoundRectangle = function (aOtherBoundingBox) {
      return boundingBox.collidesWith(aOtherBoundingBox);
    };

  // Internal method to trigger event listeners for a specific event
  function triggerEventListeners(aEventName, aEvent) {
    const listeners = eventListeners[aEventName];
    if (listeners) {
      listeners.forEach((listener) => {
        listener.call(this, aEvent);
      });
    }
  }

  // Private method to check if a point is inside an oval
  function isPointInsideOval(aPointX, aPointY) {
    const centerX = destination.x + boundingBox.width / 2;
    const centerY = destination.y + boundingBox.height / 2;
    const radiusX = boundingBox.width / 2;
    const radiusY = boundingBox.height / 2;

    const normalizedX = (aPointX - centerX) / radiusX;
    const normalizedY = (aPointY - centerY) / radiusY;

    return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
  }

  // Event handlers

  // decide witch handling function to use base on event name
  function attachCanvasEventListener(aEventName) {
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
        aCanvas.removeEventListener(aEventName, handleMouseDown, false);
        break;
      case "mouseup":
        aCanvas.removeEventListener(aEventName, handleMouseUp, false);
        break;
      case "mousemove":
        aCanvas.removeEventListener(aEventName, handleMouseMove, false);
        break;
      // ... add more cases as needed ...
    }
  }
  // Handle mouse down event
  function handleMouseDown(aEvent) {
    if (isPointInsideOval(aEvent.clientX, aEvent.clientY)) {
      triggerEventListeners("mousedown", aEvent);
    }
  }

  // Handle mouse up event
  function handleMouseUp(aEvent) {
    if (isPointInsideOval(aEvent.clientX, aEvent.clientY)) {
      triggerEventListeners("mouseup", aEvent);
    }
  }

  // Handle mouse move event
  function handleMouseMove(aEvent) {
    if (isPointInsideOval(aEvent.clientX, aEvent.clientY)) {
      triggerEventListeners("mousemove", aEvent);
    }
  }
}

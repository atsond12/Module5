"use strict"

export function calculateNormalizedVector(startingPoint, targetPoint) {
  const vector = {
    x: targetPoint.x - startingPoint.x,
    y: targetPoint.y - startingPoint.y,
  };

  let magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);

  let normalizedVector = {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
  return normalizedVector;
}

export function calculateSpeedVector(normalizedVector, speed) {
  // regner ut hastighet utifra vektoren og en gitt speed den skaleres med
  var speedVector = {
    x: normalizedVector.x * speed,
    y: normalizedVector.y * speed,
  };
  // Calculate the magnitude of the speed vector
  let speedMagnitude = Math.sqrt(speedVector.x ** 2 + speedVector.y ** 2);

  // Check if the speed magnitude exceeds the limit
  if (speedMagnitude > speed) {
    // Scale down the speed vector to meet the limit
    speedVector.x = (speedVector.x / speedMagnitude) * speed;
    speedVector.y = (speedVector.y / speedMagnitude) * speed;
  }
  return speedVector;
}
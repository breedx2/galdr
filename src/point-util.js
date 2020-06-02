'use strict';

function pointAtAngle(sx, sy, dist, angle){
  return [
    sx + (dist * Math.cos(angle)),
    sy + (dist * Math.sin(angle))
  ]
}

module.exports = {
  pointAtAngle
}

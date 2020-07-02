'use strict';

function pointAtAngle(sx, sy, dist, angle){
  return [
    sx + (dist * Math.cos(angle)),
    sy + (dist * Math.sin(angle))
  ]
}

function randFloat(min, max){
  const fac = 1000000000.0;
  return _.random(min * fac, max * fac) / fac;
}

module.exports = {
  pointAtAngle,
  randFloat
}

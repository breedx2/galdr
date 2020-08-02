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

function invertColor(color) {
  const numColor = parseInt(color.slice(1), 16);
  const invColor = 0xFFFFFF ^ numColor;
  return "#" + ("000000" + invColor.toString(16)).slice(-6);
}

module.exports = {
  pointAtAngle,
  randFloat,
  invertColor
}

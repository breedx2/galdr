'use strict';

function pack(a) {
  return [
    a.length,
    a.angle,
    a.finishAtPercentageAlongLine,
    a.strokeWidth,
    a.color,
    a.opacity,
    a.lineCap,
  ];
}

export {
  pack
}

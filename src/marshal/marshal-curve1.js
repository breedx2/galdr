'use strict';

function pack(a) {
  return [
    a.length,
    a.angle,
    a.controlAngle,
    a.controlPercent,
    a.strokeWidth,
    a.color,
    a.opacity,
    a.lineCap,
  ];
}

export {
  pack
}

'use strict';

function pack(a) {
  return [
    a.length,
    a.angle,
    a.midPercent,
    a.c1Percent,
    a.c1Angle,
    a.c2Percent,
    a.c2Angle,
    a.c3Percent,
    a.c3Angle,
    a.strokeWidth,
    a.color,
    a.opacity,
    a.lineCap,
  ];
}

export {
  pack
}

'use strict';

function pack(a) {
  // const fill = a.group.children()[0].attr('fill');
  const blocks = a.group.children().map(child => {
    return [child.attr('x'), child.attr('y'), child.attr('width'), child.attr('height')];
  });
  return [
    // fill,
    a.opacity,
    blocks,
    a.opacity,
    a.width,
    a.height,
    a.mx,
    a.my,
    a.rotDeg,
    a.rotW,
    a.rotH,
  ];
}

export {
  pack
}

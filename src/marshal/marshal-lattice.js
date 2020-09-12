'use strict';

function pack(a) {
  const fill = a.group.children()[0].attr('fill');
  const opacity = a.group.children()[0].attr('opacity');
  const blocks = a.group.children().map(child => {
    return [child.attr('x'), child.attr('y'), child.attr('width'), child.attr('height')];
  });
  return [
    fill,
    opacity,
    blocks,
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

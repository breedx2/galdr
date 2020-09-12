'use strict';

import { CircleAction } from '../action-circle';

function pack(a){
  return [
    a.radius,
    a.startAngle,
    a.finishAngle,
    a.strokeWidth,
    a.color,
    a.opacity,
    a.fill,
  ];
}

function fromJson(json){
  const opts = {};
  [
    opts.ignored_type,
    opts.radius,
    opts.startAngle,
    opts.finishAngle,
    opts.strokeWidth,
    opts.color,
    opts.opacity,
    opts.fill
  ] = JSON.parse(json);
}

export {
  pack,
  fromJson
};

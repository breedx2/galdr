'use strict';

import { BlerbAction } from '../action-blerb';

function pack(a) {
  return [
    a.baseRadius,
    a.circleVectors,
    a.controlVectors,
    a.stroke,
    a.color,
    a.strokeWidth,
    a.fill,
    a.opacity,
  ];
}

function fromJson(json) {
  const opts = {};
  [
    opts.ignored_type,
    opts.baseRadius,
    opts.circleVectors,
    opts.controlVectors,
    opts.stroke,
    opts.color,
    opts.strokeWidth,
    opts.fill,
    opts.opacity,
  ] = JSON.parse(json);
}

export {
  pack,
  fromJson
};

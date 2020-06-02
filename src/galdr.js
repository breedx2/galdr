'use strict';

import { SVG } from '@svgdotjs/svg.js';
import { ActionsFactory } from './actions-factory';
const _ = require('lodash');

// Entrypoint for app

const markov = require('./markov');
import { plot as markov_diagram } from './markov-diagram';

const chain = markov.create({
  maxNodes: 20,
  actionsFactory: ActionsFactory
});
// markov_diagram(chain);


const svg = SVG().size(window.innerWidth, window.innerHeight)

let ctx = {
  x: window.innerWidth/2,
  y: window.innerHeight/2,
  maxX: window.innerWidth,
  maxY: window.innerHeight,
  svg: svg
};

console.log(chain);

const len = _.random(0, 2500) + 2500;
_.range(0, len).forEach(_ => {
  ctx = chain.next(ctx);
});

svg.addTo('body');

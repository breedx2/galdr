'use strict';

import { SVG } from '@svgdotjs/svg.js';
import { ActionsFactory } from './actions-factory';
const _ = require('lodash');
import { setup as setupKeys } from './keys';

// Entrypoint for app

const markov = require('./markov');

const chain = markov.create({
  maxNodes: 50,
  actionsFactory: ActionsFactory
});

setupKeys({
  chain: () => chain,
  again: () => {
    document.getElementById('out').innerHTML = '';
    drawAndAdd(chain);
  }
});

drawAndAdd(chain);

function drawAndAdd(chain){
  const svg = draw(chain);
  svg.addTo('#out');
}

function draw(chain){
  const svg = SVG().size(window.innerWidth, window.innerHeight)
  svg.attr({id: 'drawing'});

  let ctx = {
    x: window.innerWidth/2,
    y: window.innerHeight/2,
    maxX: window.innerWidth,
    maxY: window.innerHeight,
    svg: svg
  };

  console.log(chain);

  // TBD: Should these be part of the chain or chain metadata?
  const len = _.random(0, 2500) + 2500;
  _.range(0, len).forEach(_ => {
    ctx = chain.next(ctx);
  });

  return svg;
}

// This continuously draws while keeping the svg the same length.
// interesting but not entirely useful here.
// setInterval(() => {
//   const svg = document.querySelector('svg#drawing')
//   svg.removeChild(svg.children[0]);
//   ctx = chain.next(ctx);
// }, 50);

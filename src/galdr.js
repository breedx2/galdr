'use strict';

import { SVG } from '@svgdotjs/svg.js';
import { ActionsFactory } from './actions-factory';
const _ = require('lodash');
import { setup as setupKeys } from './keys';
const du = require('./draw-util');
const saveSvg = require('./savesvg');

// Entrypoint for app

const markov = require('./markov');

let dark = false;
let chain = createNewAndDraw();

setupKeys({
  chain: () => chain,
  again: again,
  new: newChain,
  toggleTimer: toggleTimer,
  toggleDark: toggleDark,
  saveSvg: saveSvg
});

let timerCt = 0;
let timer;

if(!window.location.href.startsWith('file://')){
  toggleTimer();
}

function toggleTimer() {
  if(timer){
    clearInterval(timer);
    timer = null;
  }
  else {
    timer = setInterval(() => {
      if(++timerCt % 5 == 0){
        return newChain();
      }
      again();
    }, 1500);
  }
}

function newChain(){
  removeCurrent();
  chain = createNewAndDraw();
}

function again(){
  removeCurrent();
  drawAndAdd(chain);
}

function createNewAndDraw(){
  const chain = markov.create({
    maxNodes: 50,
    actionsFactory: ActionsFactory
  });

  drawAndAdd(chain);
  return chain;
}

function drawAndAdd(chain){
  const svg = draw(chain);
  svg.addTo('#out');
}

function removeCurrent(){
  document.getElementById('out').innerHTML = '';
  console.log(document.getElementById('chain'));
  document.getElementById('chain').innerHTML = '';

}

function draw(chain){
  const svg = SVG().size(window.innerWidth, window.innerHeight)
  svg.attr({id: 'drawing'});

  let ctx = {
    x: window.innerWidth/2,
    y: window.innerHeight/2,
    maxX: window.innerWidth,
    maxY: window.innerHeight,
    dark: dark,
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

function toggleDark(){
  dark = !dark;
  document.body.style.backgroundColor =
    document.body.style.backgroundColor === 'black' ? 'white' : 'black';
  const svg = document.querySelector('svg#drawing');
  svg.childNodes.forEach(child => {
    child.setAttribute('stroke', du.invertColor(child.getAttribute('stroke')));
  });
}

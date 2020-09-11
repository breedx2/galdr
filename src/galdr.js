'use strict';

import { SVG } from '@svgdotjs/svg.js';
import { ActionsFactory } from './actions-factory';
import { ChainHist } from './chain-hist';
const _ = require('lodash');
import { setup as setupKeys } from './keys';
const du = require('./draw-util');
const saveSvg = require('./savesvg');

// Entrypoint for app

const markov = require('./markov');

const chains = new ChainHist();
let dark = false;
chains.push(createNewAndDraw());

setupKeys({
  chain: () => chains.current(),
  again: again,
  new: newChain,
  toggleTimer: toggleTimer,
  toggleDark: toggleDark,
  saveSvg: saveSvg,
  previous: previousChain,
  next: nextChain,
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
        newChain();
        return (_.random(0, 100) < 20) && toggleDark();
      }
      again();
    }, 1500);
  }
}

function newChain(){
  removeCurrent();
  chains.push(createNewAndDraw());
}

function previousChain(){
  chains.prev();
  again();
}

function nextChain(){
  chains.next();
  again();
}

function again(){
  removeCurrent();
  drawAndAddToScreen(chains.current());
}

function createNewAndDraw(){
  const chain = markov.create({
    maxNodes: 50,
    actionsFactory: ActionsFactory
  });

  drawAndAddToScreen(chain);
  return chain;
}

function drawAndAddToScreen(chain){
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
  invertRecursive(svg);
}

function invertRecursive(domNode){
  domNode.childNodes.forEach(child => {
    if(child.tagName.toLowerCase() === 'g'){
      return invertRecursive(child);
    }
    try {
      const stroke = child.getAttribute('stroke');
      const fill = child.getAttribute('fill');
      stroke && child.setAttribute('stroke', du.invertColor(stroke));
      fill && child.setAttribute('fill', du.invertColor(fill));
    }
    catch(e) {
      console.log("MUCK: " + child);
    }

  });
}

'use strict';

import { plot as markov_diagram } from './markov-diagram';

function setup(config){
  document.addEventListener('keydown', event => handleKey(config, event));
}

function handleKey(config, event) {
    // console.log('saw key: ' + event);
    if(event.key === 'd'){  //show diagram
      document.querySelector('div#chain').innerHtml = '';
      markov_diagram(config.chain());
      toggle('div#chain');
      toggle('div#out');
    }
}

function toggle(sel){
  const element = document.querySelector(sel);
  if(element.offsetParent === null){
    return element.style.display = 'inline-block';
  }
  element.style.display = 'none';
}

export { setup };

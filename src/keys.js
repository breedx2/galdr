'use strict';

import { plot as markov_diagram } from './markov-diagram';

function setup(config){
  document.addEventListener('keydown', event => handleKey(config, event));
}

function handleKey(config, event) {
    // console.log('saw key: ' + event);
    if(event.key === 'd'){  //show diagram
      document.getElementById('chain').innerHTML = '';
      markov_diagram(config.chain());
      toggle('div#chain');
      toggle('div#out');
    }
    else if(event.key == 'a'){ // another from same chain in current state
      config.again();
    }
    else if(event.key == 'n'){
      config.new(); //make a new chain
    }
    else if(event.key == 'i'){
      config.toggleDark();
    }
    else if(event.key == 't'){
      console.log("toggle timer");
      config.toggleTimer();
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

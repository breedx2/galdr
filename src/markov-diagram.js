'use strict';

import { SVG } from '@svgdotjs/svg.js';

let RADIUS = 30;
// const SPACING = 140;

// Renders just the metadata about the chain, doesn't execute the chain iteself
function plot(chain){
  console.log(chain);

  //TODO: Globals suck
  RADIUS = (window.innerWidth / chain.nodes.length)/3;

  const svg = SVG().addTo('div#chain').size(window.innerWidth, window.innerHeight);
  chain.nodes.forEach(node => {
    const circle = svg.circle(2*RADIUS)
              .attr({ fill: '#eeeeee'})
              .stroke({width: 2, color: '#ff000044'});
    const x = _xpos(chain, node);
    console.log(`x is ${x}`)
    circle.attr({ cx: x, cy: window.innerHeight/2 });
    node.links.forEach(link => {
      _drawLink(chain, svg, node, link);
    });
  });
}

function _xpos(chain, node){
  const spacing = _spacing(chain);
  console.log(`spacing = ${spacing}`)
  return RADIUS + RADIUS/2 + (spacing * _index(chain, node));
}

function _spacing(chain){
  return window.innerWidth / (chain.nodes.length);// * chain.nodes.length);
}

function _drawLink(chain, svg, node, link){
  const thisIndex = _index(chain, node);
  const targetIndex = _index(chain, link.targetNode);
  const dxIndex = (thisIndex - targetIndex);
  const ysign = dxIndex > 0 ? 1 : -1;

  const tx = _xpos(chain, link.targetNode);
  const x = _xpos(chain, node);
  const y = window.innerHeight/2 + (ysign*RADIUS);
  const cy = window.innerHeight/2 + (ysign*(50+(20*dxIndex)));
  const s = { x: x, y: y };
  const e = { x: tx, y: y };
  const dxc = (thisIndex === targetIndex) ? 40 : 10;
  const c1 = { x: x+dxc, y: y+(ysign*(50+Math.abs(45*dxIndex)))};
  const c2 = { x: tx-dxc, y: y+(ysign*(50+Math.abs(45*dxIndex)))}

  const opacity = (link.max - link.min)/100.0;

  svg.path(`M ${s.x} ${s.y} C ${c1.x}, ${c1.y} ${c2.x} ${c2.y} ${e.x} ${e.y}`)
    .attr({fill: 'none'})
    .attr({'stroke-opacity': opacity})
    .stroke({width: 2, color: '#666666'});
}

// inefficient way to find index of each node.  Could be precomputed/cached by the chain in the future.
function _index(chain, node){
  for(var i = 0; i < chain.nodes.length; i++){
    if(chain.nodes[i] === node){
      return i;
    }
  }
  throw new Error('cannot find node');
}

export { plot };

'use strict';
const _ = require('lodash');
import { SVG } from '@svgdotjs/svg.js';

// Draws a little grid framework that enters on the lower left
// and exists on the upper right.
class LatticeAction {

  constructor(options){
    this.group = options.group;
    this.width = options.width;
    this.height = options.height;
    //TODO: Consider a rotation angle
    this.mx = options.mx;
    this.my = options.my;
    // this.color = options.color || '#aaaaaa';
    // this.opacity = options.opacity || 0.75;
    this.showStructure = options.showStructure || false;
  }

  action(context){
      const group = this.group.clone();
      const dx = context.x - (this.mx === -1 ? this.width : 0);
      const dy = context.y - (this.my === -1 ? this.height : 0);
      group.transform({ translate: [dx, dy] });
      context.svg.add(group);

      if(this.showStructure){
        this._showStructure(context);
      }

      //TODO: Consider a rotation angle and don't always exit the same way
      [context.x, context.y] = [dx, dy];
      return context;
  }

  _showStructure(context){
    const svg = context.svg;
    const x = context.x - (this.mx === -1 ? this.width : 0);
    const y = context.y - (this.my === -1 ? this.height : 0);
    svg.rect(this.width, this.height)
        .attr({x: x, y: y, fill: 'none', stroke: '#000000', 'stroke-opacity': 0.2})
    svg.circle(5)
        .attr({cx: context.x, cy: context.y, fill: 'none', stroke: 'green', 'stroke-opacity': 0.5});
    svg.circle(5)
        .attr({cx: x + (this.mx === 1 ? this.width : 0),
               cy: y + (this.my === 1 ? this.height : 0),
               fill: 'none', stroke: 'red', 'stroke-opacity': 0.5});
  }

  static random(){
    const width = _.random(25, 200);
    const height = _.random(25, 200);

    let cx = _.random(0,1) === 0 ? 0 : width;
    let cy = _.random(0,1) === 0 ? 0 : height;
    const mx = cx == 0 ? 1 : -1;
    const my = cy == 0 ? 1 : -1;
    console.log(`mx = ${mx} my = ${my}`)

    // could consider having each rect piece have its own opacity
    const opacity = _.random(50000, 1000000)/1000000;

    const svg = SVG();
    const group = svg.group();

    while(true){
      const dx = _.random(1, 10);
      const dy = _.random(1, 10);

      cx = cx - (mx === -1 ? dx : 0);
      cy = cy - (my === -1 ? dy : 0);

      const rect = group.rect(dx, dy);
      rect.attr({ x: cx, y: cy });
      rect.attr({ fill: 'rgb(0,0,0)', opacity: opacity});

      cx += (mx === 1 ? dx : 0);
      cy += (my === 1 ? dy : 0);

      if(cx <= 0 || cx >= width || cy <= 0 || cy >= height){
        break;
      }
    }

    group.children().forEach(child => {
      const x = mx === -1 ? -1 * cx : 0;
      const y = my === -1 ? -1 * cy : 0;
      child.attr('x', child.attr('x') + x);
      child.attr('y', child.attr('y') + y);
    });

    const inst = new LatticeAction({
      group: group,
      width: mx === 1 ? cx : width - cx,
      height: my === 1 ? cy : height - cy,
      mx: mx,
      my: my,
      // showStructure: true
    });
    return ctx => inst.action(ctx);
  }
}

export { LatticeAction };

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
    this.mx = options.mx;
    this.my = options.my;
    this.rotDeg = options.rotDeg;
    this.rotW = options.rotW;
    this.rotH = options.rotH;
    this.showStructure = options.showStructure || false;
  }

  action(context){
      const dx = context.x - (this.mx === -1 ? this.width : 0);
      const dy = context.y - (this.my === -1 ? this.height : 0);

      const { x: sx1, y: sy1} = this._startPt(context, this.rotW, this.rotH);
      const { x: ex1, y: ey1} = this._endPt(context, this.rotW, this.rotH);
      const { x: rx, y: ry } = this._rotatePoint();

      const group = this.group.clone();
      const dx4 = context.x - (this.mx === -1 ? this.rotW : 0);
      const dy4 = context.y - (this.my === -1 ? this.rotH : 0);
      group.rotate(this.rotDeg, rx, ry);
      group.translate(dx, dy);
      context.svg.add(group);

      if(this.showStructure) {
        this._showStructure(context);
      }

      [context.x, context.y] = [ex1, ey1];
      return context;
  }

  _showStructure(context){
    const svg = context.svg;
    const {x, y} = this._startPt(context, this.width, this.height);
    svg.rect(this.width, this.height)
        .attr({x: x, y: y, fill: 'none', stroke: '#000000', 'stroke-opacity': 0.2});

    const a = Math.atan(this.width/this.height);
    const h = Math.sqrt( Math.pow(this.width, 2) + Math.pow(this.height, 2));
    const rot = d2r(this.rotDeg);
    const b =  a + rot;
    // console.log('---------');
    // console.log(`${this.mx} ${this.my}`)
    // console.log(`initial: ${this.width} x ${this.height} :: a = ${a} h => ${h}`)
    // console.log(`a = ${r2d(a)} rot = ${this.rotDeg} b = ${r2d(b)} (${b})`)
    // console.log(`${this.rotDeg} -> ${this.rotW} x ${this.rotH}`)
    const { x: rx, y: ry } = this._startPt(context, this.rotW, this.rotH);
    svg.rect(this.rotW, this.rotH)
        .attr({x: rx, y: ry, fill: 'none', stroke: '#FF0000', 'stroke-opacity': 0.2});

    const {x: rex, y: rey} = this._endPt(context, this.rotW, this.rotH);
    svg.circle(6)
        .attr({cx: rex , cy: rey, fill: 'none', stroke: 'red', 'stroke-opacity': 0.5});

    svg.circle(5)
        .attr({cx: context.x, cy: context.y, fill: 'none', stroke: 'green', 'stroke-opacity': 0.5});

    const {x: ex, y: ey} = this._endPt(context, this.width, this.height);
    svg.circle(5)
        .attr({cx: ex, cy: ey,
               fill: 'none', stroke: 'red', 'stroke-opacity': 0.5});
  }

  _startPt(context, w, h){
    return {
      x: context.x - (this.mx === -1 ? w : 0),
      y: context.y - (this.my === -1 ? h : 0)
    };
  }

  _endPt(context, w, h){
    return {
      x: context.x + (this.mx * w),
      y: context.y + (this.my * h)
    };
  }

  _rotatePoint(){
    if(this.mx == 1 && this.my == 1){
      return { x: 0, y: 0 };
    }
    if(this.mx == 1 && this.my == -1){
      return { x: 0, y: this.height };
    }
    if(this.mx == -1 && this.my == -1){
      return { x: this.width, y: this.height };
    }
    return { x: this.width, y: 0};
  }

  static random(){
    const width = _.random(25, 200);
    const height = _.random(25, 200);

    let cx = _.random(0,1) === 0 ? 0 : width;
    let cy = _.random(0,1) === 0 ? 0 : height;
    const mx = cx == 0 ? 1 : -1;
    const my = cy == 0 ? 1 : -1;

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
      rect.attr({ fill: '#000000', opacity: opacity});

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

    const initialW = mx === 1 ? cx : width - cx;
    const initialH = my === 1 ? cy : height - cy;

    const rotDeg = _.random(-45, 45);
    const rot = d2r(rotDeg);

    const a = Math.atan(initialW/initialH);
    const h = Math.sqrt( Math.pow(initialW, 2) + Math.pow(initialH, 2));
    const b =  a + (mx * my * -1 * rot);
    const rotW = h * Math.sin(b);
    const rotH = h * Math.cos(b);

    const inst = new LatticeAction({
      group: group,
      width: initialW,
      height: initialH,
      rotW: rotW,
      rotH: rotH,
      mx: mx,
      my: my,
      rotDeg: rotDeg,
      // showStructure: true
    });
    return ctx => inst.action(ctx);
  }
}

function d2r(d){
  return d * (Math.PI/180);
}
function r2d(r){
  return r / (Math.PI/180);
}

export { LatticeAction };

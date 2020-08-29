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
      const group = this.group.clone();
      const dx = context.x - (this.mx === -1 ? this.width : 0);
      const dy = context.y - (this.my === -1 ? this.height : 0);
      group.transform({ translate: [dx, dy] });
      context.svg.add(group);


      const { x: ex1, y: ey1} = this._endPt(context, this.rotW, this.rotH);
      const { x: sx1, y: sy1} = this._startPt(context, this.rotW, this.rotH);
      const { x: rx, y: ry } = this._rotatePoint();

      // const group2 = this.group.clone();
      // const dx2 = context.x - (this.mx === -1 ? this.rotW : 0);
      // const dy2 = context.y - (this.my === -1 ? this.rotH : 0);
      // group2.transform({ translate: [dx, dy], rotate: `${this.rotDeg}`});//`, ${rx}, ${ry}` });
      // context.svg.add(group2);
      // group2.rotate(this.rotDeg, rx, ry);//context.x, context.y);
      // context.svg.circle(9)
      //     .attr({cx: rx + dx, cy: ry + dy, fill: 'blue', stroke: 'blue', opacity: 0.33, 'stroke-opacity': 0.5});

      // const group3 = this.group.clone();
      // const dx3 = context.x - (this.mx === -1 ? this.rotW : 0);
      // const dy3 = context.y - (this.my === -1 ? this.rotH : 0);
      // group3.transform({ translate: [dx, dy] });
      // group3.rotate(this.rotDeg, rx, ry);
      // context.svg.add(group3);

      const group4 = this.group.clone();
      const dx4 = context.x - (this.mx === -1 ? this.rotW : 0);
      const dy4 = context.y - (this.my === -1 ? this.rotH : 0);
      console.log(`Rotatin' ${this.rotDeg}`)
      group4.rotate(this.rotDeg, rx, ry);
      group4.translate(dx, dy);
      context.svg.add(group4);



      if(this.showStructure) {
        this._showStructure(context);
      }

      //TODO: Consider a rotation angle and don't always exit the same way
      const ex = dx + (this.mx === 1 ? this.width : 0);
      const ey = dy + (this.my === 1 ? this.height : 0);
      [context.x, context.y] = [ex, ey];
      return context;
  }

  _showStructure(context){
    const svg = context.svg;
    const {x, y} = this._startPt(context, this.width, this.height);
    svg.rect(this.width, this.height)
        .attr({x: x, y: y, fill: 'none', stroke: '#000000', 'stroke-opacity': 0.2});

        console.log('---------');
    console.log(`${this.mx} ${this.my}`)
    const a = Math.atan(this.width/this.height);
    const h = Math.sqrt( Math.pow(this.width, 2) + Math.pow(this.height, 2));
    console.log(`initial: ${this.width} x ${this.height} :: a = ${a} h => ${h}`)
    const rot = d2r(this.rotDeg);
    const b =  a + rot;
    console.log(`a = ${r2d(a)} rot = ${this.rotDeg} b = ${r2d(b)} (${b})`)
    console.log(`${this.rotDeg} -> ${this.rotW} x ${this.rotH}`)
    const { x: rx, y: ry } = this._startPt(context, this.rotW, this.rotH);
    svg.rect(this.rotW, this.rotH)
        .attr({x: rx, y: ry, fill: 'none', stroke: '#FF0000', 'stroke-opacity': 0.2});

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
    const width = 250;//_.random(25, 200);
    const height = 250;//_.random(25, 200);

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

    // const a = mx * my < 0 ? Math.atan(initialW/initialH) : Math.atan(initialW/initialH);
    const a = Math.atan(initialW/initialH);
    const h = Math.sqrt( Math.pow(initialW, 2) + Math.pow(initialH, 2));
    console.log(`initial: ${initialW} x ${initialH} :: a = ${a} h => ${h}`)
    const b =  a + (mx * my * -1 * rot);
    console.log(`a = ${r2d(a)} rot = ${rotDeg} b = ${r2d(b)} (${b})`)

    // const rotW = h * (mx*my < 0 ? Math.sin(b) : Math.cos(b));
    // const rotH = h * (mx*my < 0 ? Math.cos(b) : Math.sin(b));
    const rotW = h * Math.sin(b);
    const rotH = h * Math.cos(b);

    console.log(`rotW: ${rotW}, rotH: ${rotH}`)

    const inst = new LatticeAction({
      group: group,
      width: initialW,
      height: initialH,
      // rotW: (mx*my > 0) ? rotH : rotW,
      // rotH: (mx*my > 0) ? rotW : rotH,
      rotW: rotW,
      rotH: rotH,
      mx: mx,
      my: my,
      rotDeg: rotDeg,
      showStructure: true
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

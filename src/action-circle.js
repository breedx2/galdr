'use strict';

const _ = require('lodash');
const du = require('./draw-util');

class CircleAction {

  constructor(options){
    this.radius = options.radius;
    this.startAngle = options.startAngle;
    this.finishAngle = options.finishAngle;

    this.strokeWidth = options.strokeWidth || 1;
    this.color = options.color || '#aaaaaa';
    this.opacity = options.opacity || 0.75;
    this.fill = options.fill || 'none';
    this.showStructure = options.showStructure || false;
    //TODO: Optionally show path from start to center
    //TODO: Optionally show path from center to finish to center
    //TODO: those paths could be colored differently
    // TODO: MAYBE just save options?
  }

  action(context){
    const [x,y] = [context.x, context.y];
    const [cx,cy] = du.pointAtAngle(x, y, this.radius, this.startAngle);
    const [ex, ey] = du.pointAtAngle(cx, cy, this.radius, this.finishAngle)
    context.svg.circle(this.radius * 2)
      .attr({ cx: cx, cy: cy})
      .attr({fill: this.fill})
      .attr({'stroke-opacity': this.opacity})
      .stroke({width: this.strokeWidth, color: context.dark ? du.invertColor(this.color) : this.color});
    [context.x, context.y] = [ex, ey];

    this._showStructure(context.svg, [x,y], [cx,cy], [ex,ey]);
    return context;
  }

  _showStructure(svg, enter, center, exit){
    if(!this.showStructure){
      return;
    }
    svg.circle(5).attr({ cx: enter[0], cy: enter[1]}).attr({fill: '#00ff00'});
    svg.circle(7).attr({ cx: center[0], cy: center[1]}).attr({fill: '#ff0000'});
    svg.line(enter[0], enter[1], center[0], center[1]).attr({fill: 'none', stroke: '#000000', 'stroke-opacity': 0.5})
    svg.line(center[0], center[1], exit[0], exit[1]).attr({fill: 'none', stroke: '#000000', 'stroke-opacity': 0.5})
    svg.circle(8).attr({ cx: exit[0], cy: exit[1]}).attr({fill: '#0000ff', 'opacity': 0.5 });
    // console.log(`center (${cx}, ${cy}) leave me at ${context.x} ${context.y}`)
    // console.log(`start ${x},${y} goes to ${cx} ${cy} after radius ${this.radius} angle ${this.startAngle}`);
  }

  static random(){
    //TODO: Might be great if these all took strategies and not just picked their own bounds/distributions
    const radius = _.random(2, 35); //DERP
    const startAngle = _.random(0,Math.PI*2*1000000)/1000000;
    const finishAngle = _.random(0,Math.PI*2*1000000)/1000000;
    const strokeWidth = _.random(1, 4);
    const opacity = _.random(50000, 1000000)/1000000;

    const options = {
      radius: radius,
      startAngle: startAngle,
      finishAngle: finishAngle,
      strokeWidth: strokeWidth,
      opacity: opacity,
      color: 'rgb(0,0,0)',
      fill: 'none'  //TODO
      //TODO TBD: others
    };
    const inst = new CircleAction(options);
    return ctx => inst.action(ctx);
  }

}

export { CircleAction };

'use strict';

const _ = require('lodash');
const pu = require('./point-util');

// Single quadratic control point
class Curve1Action {

  constructor(options){
    this.length = options.length;
    this.angle = options.angle;
    this.controlAngle = options.controlAngle;
    this.controlPercent = options.controlPercent || 0.5;
    this.strokeWidth = options.strokeWidth || 1;
    this.color = options.color || '#aaaaaa';
    this.opacity = options.opacity || 0.75;
    this.lineCap = options.lineCap || 'round';
    this.showStructure = options.showStructure || false;
    // TODO: MAYBE just save options?
  }

  action(context){
    const [x,y] = [context.x, context.y];
    const [cx,cy] = this._controlPoint(context);
    const [ex,ey] = pu.pointAtAngle(x, y, this.length, this.angle);

    //debuggery
    this._showStructure(context.svg, [x,y], [cx,cy], [ex,ey]);

    context.svg.path(`M ${x} ${y} Q ${cx}, ${cy} ${ex} ${ey}`)
      .attr({fill: 'none'})
      .attr({'stroke-opacity': this.opacity})
      .attr({'stroke-linecap': this.lineCap})
      .stroke({width: this.strokeWidth, color: this.color});

    [context.x, context.y] = [ex, ey];
    return context;
  }

  _controlPoint(context){
    const len = this.length * this.controlPercent;
    return pu.pointAtAngle(context.x, context.y, len, this.controlAngle);
  }

  _showStructure(svg, s, c, e){
    if(!this.showStructure){
      return;
    }
    svg.circle(5).attr({ fill: '#ff000099'}).attr({cx: c[0], cy: c[1]});
    svg.line(s[0], s[1], c[0], c[1]).attr({stroke: '#0000ff', 'stroke-opacity': 0.3});
    svg.line(c[0], c[1], e[0], e[1]).attr({stroke: '#0000ff', 'stroke-opacity': 0.3});
  }

  static random(){
    //TODO: Might be great if these all took strategies and not just picked their own bounds/distributions
    const length = _.random(2, 250); //DERP
    const angle = _.random(0,Math.PI*2*1000000)/1000000;
    const controlAngle = _.random(0,Math.PI*2*1000000)/1000000;
    const controlPercent = _.random(1, 1000000)/1000000;
    const strokeWidth = _.random(1, 7);
    const opacity = _.random(50000, 1000000)/1000000;
    const lineCap = _.random(0,100) > 50 ? 'butt' : 'round';

    const options = {
      length: length,
      angle: angle,
      controlAngle: controlAngle,
      controlPercent: controlPercent,
      strokeWidth: strokeWidth,
      opacity: opacity,
      color: 'rgb(0,0,0)',
      lineCap: lineCap
      //TBD: others
    };
    const inst = new Curve1Action(options);
    return ctx => inst.action(ctx);
  }

}

export { Curve1Action };

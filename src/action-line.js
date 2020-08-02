'use strict';

const _ = require('lodash');
const du = require('./draw-util');

class LineAction {

  constructor(options){
    this.length = options.length;
    this.angle = options.angle;
    this.finishAtPercentageAlongLine = options.finishPercent || 1.0;
    this.strokeWidth = options.strokeWidth || 1;
    this.color = options.color || '#aaaaaa';
    this.opacity = options.opacity || 0.75;
    this.lineCap = options.lineCap || 'round';
    // TODO: MAYBE just save options?
  }

  action(context){
    const [x,y] = [context.x, context.y];
    const [tx,ty] = this._dest(x,y);
    context.svg.line(x, y, tx, ty)
      .attr({fill: 'none'})
      .attr({'stroke-opacity': this.opacity})
      .attr({'stroke-linecap': this.lineCap})
      .stroke({width: this.strokeWidth, color: context.dark ? du.invertColor(this.color) : this.color});
    [context.x, context.y] = this._finishXY(context)
    return context;
  }

  _finishXY(context){
      const finishLen = this.length * this.finishAtPercentageAlongLine;
      return this._dest(context.x, context.y, finishLen);
  }

  _dest(x, y, len = this.length){
    return du.pointAtAngle(x, y, len, this.angle);
  }

  static random(){
    //TODO: Might be great if these all took strategies and not just picked their own bounds/distributions
    const length = _.random(2, 50); //DERP
    const angle = _.random(0,Math.PI*2*1000000)/1000000;
    const strokeWidth = _.random(1, 4);
    const opacity = _.random(50000, 1000000)/1000000;
    const lineCap = _.random(0,100) > 50 ? 'butt' : 'round';
    const finishAtPercentageAlongLine = _.random(1, 1000000)/1000000;

    const options = {
      length: length,
      angle: angle,
      finishAtPercentageAlongLine: finishAtPercentageAlongLine,
      strokeWidth: strokeWidth,
      opacity: opacity,
      color: 'rgb(0,0,0)',
      lineCap: lineCap
      //TBD: others
    };
    const inst = new LineAction(options);
    return ctx => inst.action(ctx);
  }

}

export { LineAction };

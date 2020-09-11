'use strict';

const _ = require('lodash');
const du = require('./draw-util');

// 5 point bezier with 3 control points (like an S curve)
// start, mid, end all in a straight line
class Curve2Action {

  constructor(options){
    this.length = options.length;  // total dist from p1 -> p3
    this.angle = options.angle;    //to the final 3rd point

    this.midPercent = options.midPercent;
    this.c1Percent = options.c1Percent;
    this.c1Angle = options.c1Angle;
    this.c2Percent = options.c2Percent;
    this.c2Angle = options.c2Angle;
    this.c3Percent = options.c3Percent;
    this.c3Angle = options.c3Angle;

    this.strokeWidth = options.strokeWidth || 1;
    this.color = options.color || '#aaaaaa';
    this.opacity = options.opacity || 0.75;
    this.lineCap = options.lineCap || 'round';
    this.showStructure = options.showStructure || false;
    // TODO: MAYBE just save options?
  }

  execute(context){
    const [x,y] = [context.x, context.y];
    const [ex,ey] = du.pointAtAngle(x, y, this.length, this.angle);
    const [mx,my] = du.pointAtAngle(x, y, this.length * this.midPercent, this.angle);
    const [c1x,c1y] = du.pointAtAngle(x, y, this.length * this.c1Percent, this.c1Angle);
    const [c2x,c2y] = du.pointAtAngle(x, y, this.length * this.c2Percent, this.c2Angle);
    const [c3x,c3y] = du.pointAtAngle(x, y, this.length * this.c3Percent, this.c3Angle);

    //debuggery
    this._showStructure(context.svg, [x,y], [mx, my], [c1x, c1y], [c2x, c2y], [c3x, c3y], [ex, ey]);

    context.svg.path(`M ${x} ${y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${mx}, ${my} S ${c3x} ${c3y}, ${ex} ${ey}`)
      .attr({fill: 'none'})
      .attr({'stroke-opacity': this.opacity})
      .attr({'stroke-linecap': this.lineCap})
      .stroke({width: this.strokeWidth, color: context.dark ? du.invertColor(this.color) : this.color});

    [context.x, context.y] = [ex, ey];
    return context;
  }

  _showStructure(svg, s, m, c1, c2, c3, e){
    if(!this.showStructure){
      return;
    }
    svg.circle(5).attr({ fill: '#ff000099'}).attr({cx: s[0], cy: s[1]});
    svg.line(s[0], s[1], m[0], m[1]).attr({stroke: '#0000ff', 'stroke-opacity': 0.3});
    svg.circle(5).attr({ fill: '#00ff0099'}).attr({cx: m[0], cy: m[1]});
    svg.line(m[0], m[1], e[0], e[1]).attr({stroke: '#0000ff', 'stroke-opacity': 0.3});
    svg.circle(9).attr({ fill: '#0000bb99'}).attr({cx: e[0], cy: e[1]});
    svg.circle(3).attr({ fill: '#ff000055'}).attr({cx: c1[0], cy: c1[1]});
    svg.line(s[0], s[1], c1[0], c1[1]).attr({stroke: '#ff000055', 'stroke-opacity': 0.3});
    svg.line(c2[0], c2[1], m[0], m[1]).attr({stroke: '#ff000055', 'stroke-opacity': 0.3});
    svg.circle(3).attr({ fill: '#ff000055'}).attr({cx: c2[0], cy: c2[1]});
    svg.circle(3).attr({ fill: '#ff000055'}).attr({cx: c3[0], cy: c3[1]});
    svg.line(c3[0], c3[1], e[0], e[1]).attr({stroke: '#ff000055', 'stroke-opacity': 0.3});
  }

  static random(){
    //TODO: Might be great if these all took strategies and not just picked their own bounds/distributions
    const length = _.random(20, 250); //DERP
    const angle = _.random(0,Math.PI*2*1000000)/1000000;

    // between 0.4 and 0.6
    const midPercent = du.randFloat(0.4, 0.6);
    const lowerControls = [ du.randFloat(0.1, midPercent), du.randFloat(0.1, midPercent)];
    const c1Percent = _.min(lowerControls);
    const c2Percent = _.max(lowerControls);

    const side1 = _.random(0,1) === 0 ? 1 : -1;
    const side2 = -1 * side1;

    const mindAngle = Math.PI/16.0;
    const maxdAngle = 3.0 * Math.PI/16.0;
    const c1Angle = angle + side1 * (du.randFloat(mindAngle, maxdAngle));
    const c2Angle = angle + side1 * (du.randFloat(mindAngle, maxdAngle));

    const c3MinPerc = midPercent + (midPercent - c2Percent);
    const c3Percent = du.randFloat(c3MinPerc, 1.0);

    const dfac = (1.0-c3Percent); // Just a weird guess for sure! Improve me!
    const c3Angle = angle + side2 * (du.randFloat(dfac*mindAngle, dfac*maxdAngle));

    const strokeWidth = _.random(1, 4);
    const opacity = _.random(50000, 1000000)/1000000;
    const lineCap = _.random(0,100) > 50 ? 'butt' : 'round';

    const options = {
      length: length,
      angle: angle,

      midPercent: midPercent,
      c1Percent: c1Percent,
      c1Angle: c1Angle,
      c2Percent: c2Percent,
      c2Angle: c2Angle,
      c3Percent: c3Percent,
      c3Angle: c3Angle,

      strokeWidth: strokeWidth,
      opacity: opacity,
      color: 'rgb(0,0,0)',
      lineCap: lineCap,
      // showStructure: true
      //TBD: others
    };
    return new Curve2Action(options);
  }
}



export { Curve2Action };

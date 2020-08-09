'use strict';
import { PathArray } from '@svgdotjs/svg.js';
const du = require('./draw-util');
const _ = require('lodash');
const bezierSpline = require('@freder/bezier-spline');

// Not quite a blob, but a distorted circle
class BlerbAction {

  constructor(options) {
    this.baseRadius = options.baseRadius;
    this.circleVectors = options.circleVectors;
    this.controlVectors = options.controlVectors;

    //TODO: enter and exit points?
    // this.numPoints = options.numPoints || 6;
    this.stroke = options.stroke || 'black';
    this.color = options.color || '#aaaaaa';
    this.strokeWidth = options.strokeWidth || 1;
    this.fill = options.fill || 'none';
    this.showStructure = options.showStructure || false;
    this.opacity = options.opacity || 0.75;
    // TODO: MAYBE just save options?
  }

  action(context) {
    const curves = this._buildCurves(context.x, context.y);
    context.svg.path(curves)
                .attr({fill: 'none'})
                .attr({'stroke-opacity': this.opacity})
                .stroke({width: this.strokeWidth, color: context.dark ? du.invertColor(this.color) : this.color});

    if(this.showStructure){
      du.svgCircle(context.svg, { x: context.x, y: context.y }, 3, '#ff6666');
      du.svgCircle(context.svg, { x: context.x, y: context.y }, this.baseRadius, '#dddddd');
      this.circleVectors.forEach(v => {
        const [x,y] = du.pointAtAngle(context.x, context.y, v.r, v.a);
        du.svgCircle(context.svg, { x: x, y: y }, 3, '#66ff66');
      });
      this.controlVectors.forEach(v => {
        const [x,y] = du.pointAtAngle(context.x, context.y, v.r, v.a);
        du.svgCircle(context.svg, { x: x, y: y }, 3, '#6666ff');
      });
    }
    return context;
  }

  _buildCurves(cx, cy){

    const vec = _.flatten(_.zip(this.circleVectors, this.controlVectors));
    const points = vec.map(v => du.pointAtAngle(cx, cy, v.r, v.a));
    points.push(points[0]);

    const controlPoints = bezierSpline.getControlPoints(points);
    const combined = bezierSpline.combinePoints(points, controlPoints);
    const segments = bezierSpline.getSegments(combined);

    // credit given to https://github.com/freder/bezier-spline/issues/1
    const thePathArray = new PathArray([
        ['M', ...segments[0][0]],
        ...segments.slice(1).map(segment => ([
          'C',
          ...segment[1],
          ...segment[2],
          ...segment[3]
        ]))
      ]);

    return thePathArray.toString()
  }

  static random(){
    const numAngles = _.random(4, 8);
    const baseRadius = _.random(10, 66); //tbd
    const angles = du.getCircleAngles(numAngles, false);
    const circleVectors = angles.map(a => ({a: a, r: baseRadius}));
    const controlVectors = BlerbAction._controlVectors(angles, baseRadius);
    const strokeWidth = _.random(1, 4);
    const opacity = _.random(50000, 1000000)/1000000;

    const options = {
        baseRadius: baseRadius,
        circleVectors: circleVectors,
        controlVectors: controlVectors,
        strokeWidth: strokeWidth,
        opacity: opacity,
        color: '#000000',
        showStructure: false,
    };
    const obj = new BlerbAction(options);
    return ctx => obj.action(ctx);
  }

  static _controlVectors(angles, baseRadius) {
        const anglePairs = BlerbAction._pairsAround(angles);
        return anglePairs.map(pair => {
            const firstAngle = pair[0];
            const secondAngle = pair[1] == 0 ? 2 * Math.PI : pair[1];
            const deltaAngles = (secondAngle - firstAngle) / 2.0;
            const controlAngleError = _.random(-0.3 * deltaAngles, 0.3 * deltaAngles);
            const controlAngle = firstAngle + deltaAngles + controlAngleError;
            //TODO: radius error should be related to deltaAngles (closer, less radial error?)
            const radiusErrPercent = 1.0 - _.random(-1000000, 1000000)/10000000.0;
            return {a: controlAngle, r: baseRadius * radiusErrPercent };
        });
    }

    // creates pairs from a list that completes a loop around
    static _pairsAround(list){
      return list.map((item, i) => {
          if (i == list.length - 1) {
              return [item, list[0]];
          }
          return [item, list[i + 1]];
      });
    }
}

export { BlerbAction };

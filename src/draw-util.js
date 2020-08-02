'use strict';

function pointAtAngle(sx, sy, dist, angle){
  return [
    sx + (dist * Math.cos(angle)),
    sy + (dist * Math.sin(angle))
  ]
}

function randFloat(min, max){
  const fac = 1000000000.0;
  return _.random(min * fac, max * fac) / fac;
}

function invertColor(color) {
  if(color === 'black') return 'white';
  if(color === 'white') return 'black';
  const numColor = parseInt(color.slice(1), 16);
  const invColor = 0xFFFFFF ^ numColor;
  return "#" + ("000000" + invColor.toString(16)).slice(-6);
}

// returns angles in a circle, maybe evenly distributed
function getCircleAngles(num, distEven = true){
  let angleInc =  2.0 * Math.PI / num;
  return _.range(0, 2.0 * Math.PI, angleInc)
      .map((a,i) => {
        if(!distEven && (i > 0) && (i < num - 1)){
          return a + _.random(0, (angleInc * 0.85), true);
        }
        return a;
      });
}

function svgCircle(svg, middle, radius, color, alpha = 1, strokeWidth = 1){
  return svg.circle(radius*2)
            .attr({ cx: middle.x, cy: middle.y})
            .attr({ fill: 'none' })
            .attr({ stroke: color })
            .attr({ width: strokeWidth })
            .attr({ opacity: alpha });
  // return svg.append("circle")
  //           .attr("cx", middle.x)
  //           .attr("cy", middle.y)
  //           .attr("r", radius)
  //           .style('fill', 'none')
  //           .style('stroke', color)
  //           .style('opacity', alpha == null ? 1 : alpha)
  //           .style('stroke-width', strokeWidth);
}

module.exports = {
  pointAtAngle,
  randFloat,
  invertColor,
  getCircleAngles,
  svgCircle
}

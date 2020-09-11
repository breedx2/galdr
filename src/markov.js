'use strict';

const _ = require('lodash');

const DEFAULT_MIN_NODES = 2;
const DEFAULT_MAX_NODES = 10;
const DEFAULT_MIN_LINKS = 2;
const DEFAULT_MAX_LINKS = 5;
const DEFAULT_ALLOW_SELF = true;

//TODO:
// * allow/exclude self?
// * library of actions to choose from
function create(options = {}) {
  const nodes = createNodes(options);
  return new MarkovChain(nodes);
}

function createNodes(options) {
  const minNodes = options.minNodes || DEFAULT_MIN_NODES;
  const maxNodes = options.maxNodes || DEFAULT_MAX_NODES;
  const numNodes = _.random(minNodes, maxNodes);
  console.log(`Making a chain with ${numNodes} nodes...`);
  const initialNodes = _.range(0, numNodes).map(i => makeTempNode(i, options));
  const nodes = initialNodes.map(node => {
    const minLinks = options.minLinks || DEFAULT_MIN_LINKS;
    const maxLinks = Math.min(numNodes-1, options.maxLinks || DEFAULT_MAX_LINKS);
    const numLinks = _.random(minLinks, maxLinks);
    const ranges = makeRanges(numLinks);
    const shuffledNodes = _.shuffle([...initialNodes]); //spread clones here
    const links = ranges.map(r => new MarkovLink(r[0], r[1], shuffledNodes.pop()));
    links.forEach(link => {
      node.addLink(link);
    });
    return node;
  });
  return nodes;
}

// produce num ranges between 0-100
function makeRanges(num) {
  return _.chain(_.range(0, 100))
    .shuffle()
    .slice(0, num - 1)
    .push(0)
    .push(100)
    .sort((a, b) => a - b)
    .reduce((acc, val, i, a) => {
      acc.push([a[i], a[i + 1]]);
      return acc;
    }, [])
    .filter(x => x[1])
    .value()
}

function makeTempNode(i, options) {
  const action = options.actionsFactory.pickRandom();
  return new MarkovNode(action);
}

class MarkovChain {

  constructor(nodes) {
    this.current = nodes[0];
    this.nodes = nodes;
  }

  next(context) {
    this.current = this.current.next();
    const newContext = this.current.getAction().execute(context);
    context.oid = (context.oid || 0) + 1
    return this._wrapBounds(newContext);
  }

  _wrapBounds(ctx){
    if(ctx.x > ctx.maxX){
      ctx.x = 0;
    }
    if(ctx.x < 0){
      ctx.x = ctx.maxX;
    }
    if(ctx.y > ctx.maxY){
      ctx.y = 0;
    }
    if(ctx.y < 0){
      ctx.y = ctx.maxY;
    }
    return ctx;
  }

}

class MarkovNode {

  // The range on links must be contiguous
  constructor(action) {
    this.action = action;
    this.links = [];
  }

  addLink(link) {
    this.links.push(link);
  }

  next() {
    const prob = _.random(0, 99);
    const link = _.find(this.links, link => link.match(prob));
    if(link){
      return link.target();
    }
    throw new Error(`Whoopsie couldn't find node with range ${prob}`);
  }

  getAction(){
    return this.action;
  }
}

class MarkovLink {

  constructor(min, max, targetNode) {
    this.min = min;
    this.max = max;
    this.targetNode = targetNode;
  }

  match(value) {
    if (value >= this.min && value < this.max) {
      return true;
    }
    return false;
  }

  target(){
    return this.targetNode;
  }
}

module.exports = {
  create
};

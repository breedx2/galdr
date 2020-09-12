'use strict';

import { toJson as actionToJson } from './marshal-action';

function toJson(chain){

    const links = chain.nodes.flatMap(node => {
      const thisNodeIndex = _nodeIndex(chain, node);
      return node.links.map(link => {
        const targetIndex = _nodeIndex(chain, link.target());
        return [thisNodeIndex, targetIndex, link.min, link.max]
      });
    });
    const actions = chain.nodes
                      .map(node => node.action)
                      .map(action => actionToJson(action));

    return JSON.stringify([actions, links]);
}

function _nodeIndex(chain, node){
  for(let i=0; i < chain.nodes.length; i++){
    if(node === chain.nodes[i]){
      return i;
    }
  }
  throw new Error('Node not found: ' + node);
}


export {
  toJson
}

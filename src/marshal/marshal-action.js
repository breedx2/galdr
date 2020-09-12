'use strict';

import { pack as blerbPack, fromJson as blerbFromJson } from './marshal-blerb';
import { pack as circlePack, fromJson as circleFromJson } from './marshal-circle';
import { pack as curve1Pack, fromJson as curve1FromJson } from './marshal-curve1';
import { pack as curve2Pack, fromJson as curve2FromJson } from './marshal-curve2';
import { pack as latticePack, fromJson as lineFromJson } from './marshal-lattice';
import { pack as linePack, fromJson as latticeFromJson } from './marshal-line';

const typeMap = {
  BlerbAction: { code: 'b', pack: blerbPack },
  CircleAction: { code: 'o', pack: circlePack },
  Curve1Action: { code: 'c', pack: curve1Pack },
  Curve2Action: { code: 'C', pack: curve2Pack },
  LatticeAction: { code: 'L', pack: latticePack },
  LineAction: { code: 'l', pack: linePack },
};

function toJson(a){
  const { code, pack } = typeMap[a.constructor.name];
  const result = pack(a);
  result.unshift(code);
  return result;

}

function fromJson(json){
  console.log('build me');
}

export {
  toJson,
  fromJson
};

'use strict';

const _ = require('lodash');
import { LineAction } from './action-line';
import { CircleAction } from './action-circle';
import { Curve1Action } from './action-curve1';
import { Curve2Action } from './action-curve2';

const _actions = [
  LineAction,
  CircleAction,
  Curve1Action,
  Curve2Action
];

const factory = {
    pickRandom: function(){
      const action = _.shuffle(_actions).pop();
      return action.random();
    }
}

export { factory as ActionsFactory };

'use strict';

const _ = require('lodash');
import { LineAction } from './action-line';
import { CircleAction } from './action-circle';

const _actions = [
  LineAction,
  CircleAction
];

const factory = {
    pickRandom: function(){
      const action = _.shuffle(_actions).pop();
      return action.random();
    }
}

export { factory as ActionsFactory };

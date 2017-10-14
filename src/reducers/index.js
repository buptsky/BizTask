import {combineReducers} from 'redux';

import {common} from './common';
import {task} from './task';
import {workflow} from './workflow';

export default combineReducers({
  common,
  task,
  workflow
});
import { combineReducers } from 'redux';

import { common } from './common';
import { task } from './task';

export default combineReducers({
    common,
    task
});
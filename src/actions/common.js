import {actionCreator, actionTypes} from './action-creator';

export function activeHeaderMenu (args) {
    return (dispatch) => {
        dispatch(actionCreator(actionTypes.change_header_menu, args));
    }
};
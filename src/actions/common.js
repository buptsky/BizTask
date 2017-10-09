import {actionCreator, actionTypes} from './action-creator';

export function activeHeaderMenu(args) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.change_header_menu, args));
  }
};

export function loadAllPerson() {
  return (dispatch) => {
    fetchData({
      url: '/user/getAll.do',
    }).then(data => {
      dispatch(actionCreator(actionTypes.load_all_person, data));
    });
  }
};
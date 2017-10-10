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
      dispatch(actionCreator(actionTypes.load_all_person_success, data));
    });
  }
};

export function loadUserInfo() {
  return (dispatch) => {
    fetchData({
      url: '/user/getUserInfo.do',
    }).then(data => {
      dispatch(actionCreator(actionTypes.load_user_info_success, data));
    });
  }
};
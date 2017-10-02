import {actionCreator, actionTypes} from './action-creator';

export function getTasks (args) {
    return (dispatch) => {
        dispatch(actionCreator(actionTypes.get_tasks));
        fetchData({
            url: '/task/getTasks.do',
            data: args
        }).then(data => {
            dispatch( actionCreator(actionTypes.get_tasks_success, data) );
        });
    }
};
export function moveCard (args) {
  return (dispatch) => {
    dispatch( actionCreator(actionTypes.move_task_card, args) );
  };
};


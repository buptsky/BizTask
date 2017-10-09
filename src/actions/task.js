import {actionCreator, actionTypes} from './action-creator';

export function getTasks(args) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.get_tasks));
    fetchData({
      url: '/task/getTasks.do',
      data: args
    }).then(data => {
      dispatch(actionCreator(actionTypes.get_tasks_success, data));
    });
  }
};

export function moveTask(args) {
  return (dispatch) => {
    if (args.lastX !== args.nextX) {
      fetchData({
        url: '/task/updateTaskStatus.do',
        data: {
          taskId: args.taskId,
          statusName: args.nextX
        }
      });
    }
    dispatch(actionCreator(actionTypes.move_task, args));
  };
};

export function deleteTask(args) {
  return (dispatch) => {
    fetchData({
      url: '/task/deleteTask.do',
      data: {
        taskId: args.taskId
      }
    });
    dispatch(actionCreator(actionTypes.delete_task, args));
  };
};

export function openTaskPanel(args) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.open_task_panel, args));
  };
}
export function closeTaskPanel(args) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.close_task_panel, args));
  };
}

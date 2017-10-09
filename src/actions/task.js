import {actionCreator, actionTypes} from './action-creator';

export function getTasks(args) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.get_tasks,args));
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

export function openTaskModal(args) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.open_task_modal, args));
  };
}
export function closeTaskModal(args) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.close_task_modal, args));
  };
}
export function addTask(addArgs,queryArgs) {
  return (dispatch) => {
    dispatch(actionCreator(actionTypes.add_task));
    fetchData({
      url: '/task/addTask.do',
      data: addArgs
    }).then(() => {
      dispatch(actionCreator(actionTypes.add_task_success));
      /*刷新task列表*/
      dispatch(actionCreator(actionTypes.get_tasks,queryArgs));
      fetchData({
        url: '/task/getTasks.do',
        data: queryArgs
      }).then(data => {
        dispatch(actionCreator(actionTypes.get_tasks_success, data));
      });
    });
  };
}

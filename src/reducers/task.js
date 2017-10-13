import {actionTypes} from "../actions/action-creator";

const initialState = {
  taskLists: [],
  isLoading: true,
  queryArgs: {},
  newTask: {
    isShow: false,
    isSubmitting: false
  },
  editTask: {
    taskId: '',
    isShow: false,
    isSubmitting: false
  }
};

export function task(state = initialState, action) {
  switch (action.type) {
    /*获取任务列表*/
    case actionTypes.get_tasks:
      return {
        ...state,
        queryArgs: {
          ...state.queryArgs,
          ...action.payload
        },
        isLoading: true
      };
    /*成功获取任务列表*/
    case actionTypes.get_tasks_success:
      return {
        ...state,
        taskLists: action.payload,
        isLoading: false
      };
    /*任务拖拽*/
    case actionTypes.move_task:
      const newLists = [...state.taskLists];
      const {lastX, lastY, nextX, nextY} = action.payload;
      const sourceList = _.find(newLists, {name: lastX}).taskList;
      const targetList = _.find(newLists, {name: nextX}).taskList;
      if (lastX === nextX) {
        //剪切lastY至nextY
        sourceList.splice(nextY, 0, sourceList.splice(lastY, 1)[0]);
      } else {
        // 目标x添加lastY
        targetList.splice(nextY, 0, sourceList[lastY]);
        // 删除原来的lastY
        sourceList.splice(lastY, 1);
      }
      return {
        ...state,
        taskLists: newLists
      };
    /*删除任务*/
    case actionTypes.delete_task:
      const listForDelete = [...state.taskLists];
      const {x, y} = action.payload;
      const currentListForDelete = _.find(listForDelete, {name: x}).taskList;
      // 删除task
      currentListForDelete.splice(y, 1);
      return {
        ...state,
        taskLists: listForDelete
      };
    /*打开新建任务Modal*/
    case actionTypes.open_new_task:
      return {
        ...state,
        newTask: {
          isShow: true
        }
      };
    /*关闭新建任务Modal*/
    case actionTypes.close_new_task:
      return {
        ...state,
        newTask: {
          isShow: false
        }
      };
    /*打开编辑任务Panel*/
    case actionTypes.open_edit_task:
      return {
        ...state,
        editTask: {
          ...state.editTask,
          taskId: action.payload,
          isShow: true
        }
      };
    /*关闭编辑任务Panel*/
    case actionTypes.close_edit_task:
      return {
        ...state,
        editTask: {
          ...state.editTask,
          isShow: false
        }
      };
    default:
      return state;
  }
}
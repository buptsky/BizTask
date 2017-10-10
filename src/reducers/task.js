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
    taskDetail: {},
    isShow: false,
    isLoading: false,
    isSubmitting: false
  }
};

export function task(state = initialState, action) {
  switch (action.type) {
    case actionTypes.get_tasks:
      return {
        ...state,
        queryArgs: {
          ...state.queryArgs,
          ...action.payload
        },
        isLoading: true
      };
    case actionTypes.get_tasks_success:
      return {
        ...state,
        taskLists: action.payload,
        isLoading: false
      };
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
    case actionTypes.open_new_task:
      return {
        ...state,
        newTask: {
          isShow: true
        }
      };
    case actionTypes.close_new_task:
      return {
        ...state,
        newTask: {
          isShow: false
        }
      };
    case actionTypes.add_task:
      return {
        ...state,
        newTask: {
          ...state.newTask,
          isSubmitting: true
        }
      };
    case actionTypes.add_task_success:
      return {
        ...state,
        newTask: {
          ...state.newTask,
          isShow: false,
          isSubmitting: false
        }
      };
    case actionTypes.open_edit_task:
      return {
        ...state,
        editTask: {
          ...state.editTask,
          isShow: true,
          isLoading: true
        }
      };
    case actionTypes.get_task_detail_success:
      return {
        ...state,
        editTask: {
          ...state.editTask,
          isLoading: false,
          taskDetail: action.payload
        }
      };
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
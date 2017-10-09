import {actionTypes} from "../actions/action-creator";
import {TaskModalTypes} from '../components/task/Constants';

const initialState = {
  taskLists: [],
  isLoading: true,
  queryArgs: {},
  taskModal: {
    isShow: false,
    title: 'Title',
    taskId: undefined,
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
    case actionTypes.open_task_modal:
      const args = action.payload;
      return {
        ...state,
        taskModal: {
          isShow: true,
          title: args.type === TaskModalTypes.NEW ? '创建任务' : '任务详情',
          taskId: args.taskId
        }
      };
    case actionTypes.close_task_modal:
      return {
        ...state,
        taskModal: {
          isShow: false
        }
      };
    case actionTypes.add_task:
      return {
        ...state,
        taskModal: {
          ...state.taskModal,
          isSubmitting: true
        }
      };
    case actionTypes.add_task_success:
      return {
        ...state,
        taskModal: {
          ...state.taskModal,
          isShow: false,
          isSubmitting: false
        }
      };
    default:
      return state;
  }
}
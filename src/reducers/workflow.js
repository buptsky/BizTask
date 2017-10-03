import {actionTypes} from "../actions/action-creator";
import config from '../components/workflow/WorkflowConfig';

const startTime = [config.startDateRange.initialRange[0].format('YYYY-MM-DD'),config.startDateRange.initialRange[1].format('YYYY-MM-DD')].join(',');
const endTime = [config.endDateRange.initialRange[0].format('YYYY-MM-DD'),config.endDateRange.initialRange[1].format('YYYY-MM-DD')].join(',');

const initialState = {
  tableData: [],
  queryArgs: {
    typeId: 1,
    flowTypeId: 0,
    flowName: '',
    status: 0,
    startTime: startTime,
    endTime: endTime,
    pageSize: 10,
    pageNo: 1,
    employee: '',
    isDone: true
  },
  isLoading: true
};

export function workflow(state = initialState, action) {
  switch (action.type) {
    case actionTypes.get_workflow_data:
      return {
        ...state,
        loading: true
      };
    case actionTypes.get_workflow_data_success:
      return {
        ...state,
        tableData: action.payload,
        isLoading: false
      };
    // case actionTypes.change_query_args:
    //   return {
    //     ...state,
    //     queryArgs: Object.assign(state.queryArgs, action.payload)
    //   };
    default:
      return state;
  }
}
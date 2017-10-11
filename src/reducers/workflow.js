import {actionTypes} from "../actions/action-creator";
import config from '../components/workflow/WorkflowConfig';

const startTime = [config.startDateRange.initialRange[0].format('YYYY-MM-DD'),config.startDateRange.initialRange[1].format('YYYY-MM-DD')].join(',');
const endTime = [config.endDateRange.initialRange[0].format('YYYY-MM-DD'),config.endDateRange.initialRange[1].format('YYYY-MM-DD')].join(',');

const initialState = {
  flowData: [],
  flowDetailData: {},
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
  flowLoading: true,
  flowDetailLoading: true
};

export function workflow(state = initialState, action) {
  switch (action.type) {
    case actionTypes.get_workflow_data:
      return {
        ...state,
        flowLoading: true
      };
    case actionTypes.get_workflow_data_success:
      return {
        ...state,
        flowData: action.payload,
        flowLoading: false
      };
    case actionTypes.get_flow_detail:
      return {
        ...state,
        flowDetailLoading: true
      };
    case actionTypes.get_flow_detail_success:
      return {
        ...state,
        flowDetailData: action.payload,
        flowDetailLoading: false
      };
    case actionTypes.clear_flow_detail:
      return {
        ...state,
        flowDetailData: {},
      };
    default:
      return state;
  }
}
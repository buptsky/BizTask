import {actionTypes} from "../actions/action-creator";
import config from '../components/workflow/WorkflowConfig';

const startTime = [config.startDateRange.initialRange[0].format('YYYY-MM-DD'),config.startDateRange.initialRange[1].format('YYYY-MM-DD')].join(',');
const endTime = [config.endDateRange.initialRange[0].format('YYYY-MM-DD'),config.endDateRange.initialRange[1].format('YYYY-MM-DD')].join(',');

const initialState = {
  flowData: [], // 流程数据
  flowDetailData: {}, // 流程详情数据
  repositories: [], // svn仓库数据
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
  flowLoading: false,
  flowDetailLoading: false,
  repositoryLoading: false // 仓库数据加载中，暂时不使用此数据
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
    case actionTypes.get_repositories:
      return {
        ...state,
        repositoryLoading: true
      };
    case actionTypes.get_repositories_success:
      return {
        ...state,
        repositories: action.payload,
        repositoryLoading: false
      };
    default:
      return state;
  }
}
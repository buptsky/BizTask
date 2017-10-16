import {actionCreator, actionTypes} from './action-creator';

export function getFlowData (args) {
  return (dispatch, getState) => {
    const state = getState();
    const queryArgs = Object.assign(state.workflow.queryArgs, args);
    dispatch(actionCreator(actionTypes.get_workflow_data));
    fetchData({
      url: '/workflow/getApplications.do',
      data: queryArgs
    }).then((data) => {
      dispatch(actionCreator(actionTypes.get_workflow_data_success, data));
    });
  }
};

export function getFlowDetailData (flowId) {
  return (dispatch, getState) => {
    dispatch(actionCreator(actionTypes.get_flow_detail));
    fetchData({
      url: '/workflow/getApplicationDetailTest.do',
      data: {flowId}
    }).then((data) => {
      // 格式化处理数据
      let flowData = {...data, formData: JSON.parse(data.formData)}
      dispatch(actionCreator(actionTypes.get_flow_detail_success, flowData));
    });
  }
};

export function clearFlowDetailData (flowId) {
  return (dispatch, getState) => {
    dispatch(actionCreator(actionTypes.clear_flow_detail));
  }
};

export function getRepositories () {
  return (dispatch, getState) => {
    dispatch(actionCreator(actionTypes.get_repositories));
    fetchData({
      url: '/svnService/getRepositories.do',
      data: {}
    }).then((data) => {
      dispatch(actionCreator(actionTypes.get_repositories_success, data));
    });
  }
};


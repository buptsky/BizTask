import {actionCreator, actionTypes} from './action-creator';

export function getTableData (args) {
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

// export function changeQueryArgs (args) {
//   return (dispatch) => {
//     dispatch(actionCreator(actionTypes.change_query_args, args));
//   }
// };


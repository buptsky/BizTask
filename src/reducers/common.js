import {actionTypes} from "../actions/action-creator";

const initialState = {
  headerActiveKey: 'workflow',
  commonData: {}
};

export function common(state = initialState, action) {
  switch (action.type) {
    case actionTypes.change_header_menu:
      return {
        ...state,
        headerActiveKey: action.payload
      };
    case actionTypes.load_all_person_success:
      const personsAndGroups = _.groupBy(action.payload, (ele) => {
        return ele.type
      });
      const persons = personsAndGroups[0];
      const groups = personsAndGroups[1];
      return {
        ...state,
        commonData: {
          ...state.commonData,
          persons: persons,
          groups: groups,
          personsAndGroups: action.payload
        }
      };
    case actionTypes.load_user_info_success:
      return {
        ...state,
        commonData: {
          ...state.commonData,
          userInfo: action.payload
        }
      };
    default:
      return state;
  }
}
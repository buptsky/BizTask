import {actionTypes} from "../actions/action-creator";

const initialState = {
    headerActiveKey: 'workflow'
};

export function common(state = initialState, action) {
    switch (action.type) {
        case actionTypes.change_header_menu:
            return {
                ...state,
                headerActiveKey: action.payload
            };
        default:
            return state;
    }
}
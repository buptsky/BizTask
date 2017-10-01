import {actionTypes} from "../actions/action-creator";

const initialState = {
    taskLists: [],
    isLoading: true
};

export function task(state = initialState, action) {
    switch (action.type) {
        case actionTypes.get_tasks:
            return {
                ...state,
                isLoading: true
            };
        case actionTypes.get_tasks_success:
            return {
                ...state,
                taskLists: action.payload,
                isLoading: false
            };
        default:
            return state;
    }
}
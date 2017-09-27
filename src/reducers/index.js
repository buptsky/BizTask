const initialState = {
    headerActiveKey: 'task'
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'change_header_menu':
            return {
                ...state,
                headerActiveKey: action.payload
            };
        default:
            return state;
    }
};
export default reducer;
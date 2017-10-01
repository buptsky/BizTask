export const actionCreator = (type, data = null) => ({
    type: type,
    payload: data
});
export const actionTypes = {
    change_header_menu: 'change_header_menu',
    get_tasks:'get_tasks',
    get_tasks_success: 'get_tasks_success',
    move_task_card:'move_task_card'
};
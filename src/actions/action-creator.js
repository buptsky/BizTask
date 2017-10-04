export const actionCreator = (type, data = null) => ({
  type: type,
  payload: data
});
export const actionTypes = {
  change_header_menu: 'change_header_menu',
  get_tasks: 'get_tasks',
  get_tasks_success: 'get_tasks_success',
  move_task: 'move_task',
  delete_task: 'delete_task',
  open_task_panel: 'open_task_panel',
  close_task_panel: 'close_task_panel'

};
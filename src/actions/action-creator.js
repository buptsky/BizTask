export const actionCreator = (type, data = null) => ({
  type: type,
  payload: data
});
export const actionTypes = {
  /*common*/
  change_header_menu: 'change_header_menu',
  load_all_person: 'load_all_person',
  /*workflow*/
  get_workflow_data: 'get_table_data', // 获取流程列表数据
  get_workflow_data_success: 'get_workflow_data_success', // 成功获取流程列表数据
  /*task*/
  get_tasks: 'get_tasks',
  get_tasks_success: 'get_tasks_success',
  move_task: 'move_task',
  delete_task: 'delete_task',
  open_task_modal: 'open_task_modal',
  close_task_modal: 'close_task_modal',
  add_task: 'add_task',
  add_task_success: 'add_task_success'
};
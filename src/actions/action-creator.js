export const actionCreator = (type, data = null) => ({
  type: type,
  payload: data
});
export const actionTypes = {
  /*common*/
  change_header_menu: 'change_header_menu',
  load_all_person_success: 'load_all_person_success',
  load_user_info_success: 'load_user_info_success',
  /*workflow*/
  get_workflow_data: 'get_table_data', // 获取流程列表数据
  get_workflow_data_success: 'get_workflow_data_success', // 成功获取流程列表数据
  get_flow_detail: 'get_flow_detail', // 获取流程详情
  get_flow_detail_success: 'get_flow_detail_success', // 成功获取流程详情
  clear_flow_detail: 'clear_flow_detail', // 清空流程详细数据
  /*task*/
  get_tasks: 'get_tasks',
  get_tasks_success: 'get_tasks_success',
  move_task: 'move_task',
  delete_task: 'delete_task',
  open_new_task: 'open_new_task',
  close_new_task: 'close_new_task',
  add_task: 'add_task',
  add_task_success: 'add_task_success',
  open_edit_task: 'open_edit_task',
  close_edit_task: 'close_edit_task',
  get_task_detail_success: 'get_task_detail_success',
  update_task: 'update_task',
  update_task_success: 'update_task_success'
};
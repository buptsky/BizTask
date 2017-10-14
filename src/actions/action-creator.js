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
  get_workflow_data: 'get_workflow_data', // 获取流程列表数据
  get_workflow_data_success: 'get_workflow_data_success', // 成功获取流程列表数据
  get_flow_detail: 'get_flow_detail', // 获取流程详情
  get_flow_detail_success: 'get_flow_detail_success', // 成功获取流程详情
  clear_flow_detail: 'clear_flow_detail', // 清空流程详细数据
  get_repositories: 'get_repositories', // 获取仓库路径数据
  get_repositories_success: 'get_repositories_success', // 成功获取仓库路径数据
  /*task*/
  get_tasks: 'get_tasks',         //获取任务列表
  get_tasks_success: 'get_tasks_success', //成功获取任务列表
  move_task: 'move_task',         //任务拖拽
  delete_task: 'delete_task',     //删除任务
  open_new_task: 'open_new_task', //打开新建任务Modal
  close_new_task: 'close_new_task', //关闭新建任务Modal
  open_edit_task: 'open_edit_task',     //打开编辑任务Panel
  close_edit_task: 'close_edit_task',   //关闭编辑任务Panel
};
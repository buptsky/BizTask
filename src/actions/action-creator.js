export const actionCreator = (type, data = null) => ({
  type: type,
  payload: data
});
export const actionTypes = {
  change_header_menu: 'change_header_menu',
  get_tasks: 'get_tasks',
  get_tasks_success: 'get_tasks_success',
  move_task_card: 'move_task_card',
  get_workflow_data: 'get_table_data', // 获取流程列表数据
  get_workflow_data_success: 'get_workflow_data_success', // 成功获取流程列表数据
  get_query_args: 'get_query_args', // 获取查询参数
  change_query_args: 'change_query_args' // 更改查询参数
};
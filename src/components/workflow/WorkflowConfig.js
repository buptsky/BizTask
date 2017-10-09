/*
 * 工作流参数配置 (部分参数值需要结合线上进行修改，第一版仅做调试使用）
 * workflowType     工作流程下拉列表参数
 * workflowStatus   流程状态下拉列表参数
 * createType       新建工作流中可选的流程类型
 * startDateRange   发起时间datePicker初始参数
 * endDateRange     结束时间datePicker初始参数
 * tablePagination  表格分页基础配置
 */
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const workflowConfig = {
  // 101-svn仓库申请 102-svn权限分配 201-新员工入职
  workflowType: [
    {title: 'svn仓库申请', value: '101'},
    {title: 'svn权限分配', value: '102'},
    {title: '新员工入职', value: '201'}
  ],
  workflowStatus: [
    {title: '已完成', value: '1'},
    {title: '进行中', value: '2'},
    {title: '已取消', value: '3'}
  ],
  createType: [
    {title: 'svn仓库申请', value: '101'},
    {title: 'svn权限分配', value: '102'}
  ],
  startDateRange: {
    quickPiker: {
      '今天': [moment(), moment()],
      '本月': [moment().startOf('month'), moment().endOf('month')]
    },
    initialRange: [moment().subtract(3, 'month'), moment()]
  },
  endDateRange: {
    quickPiker: {
      '今天': [moment(), moment()],
      '本月': [moment().startOf('month'), moment().endOf('month')]
    },
    initialRange: [moment().subtract(3, 'month'), moment()]
  },
  tablePagination: {
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50'],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (totalNumber) => `共${totalNumber}条`
  }
};
export default workflowConfig;
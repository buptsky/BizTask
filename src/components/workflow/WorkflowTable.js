import {Table, Icon} from 'antd';
import config from './WorkflowConfig';
// table列表配置项,字段名与线上数据返回字段名一致
const columns = [
  {
    title: '流程名称',
    dataIndex: 'flowName',
    key: 'flowName',
    render: text => <a href="javascript:void(0)">{text}</a>,
  },
  {
    title: '发起人',
    dataIndex: 'employee',
    key: 'employee',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '发起时间',
    dataIndex: 'startTime',
    key: 'startTime'
  },
  {
    title: '完结时间',
    dataIndex: 'endTime',
    key: 'endTime'
  },
  {
    title: '所属开发组',
    dataIndex: 'group',
    key: 'group'
  }
];
// 模拟线上数据，注意key属性需要自己添加
const data = [
  {
    key: 1,
    flowName: 'SVN权限分配-test',
    employee: "陈曦",
    endTime: "",
    flowId: "bizwork_svnDistribution__0000015EC83CD761CB9DC4431D195C35",
    group: "bizwork",
    startTime: "2017-09-28 19:26:24",
    status: "未完结"
  },
  {
    key: 2,
    employee: "翟懿博",
    endTime: "2017-09-27 11:40:12",
    flowId: "bizwork_svnDistribution__0000015EC0CF61AA1A5E3745334B7C1A",
    flowName: "SVN权限分配-朱庆广开通权限--bizwork-fe:/",
    group: "bizdev_kcfe",
    startTime: "2017-09-27 08:49:30",
    status: "已完结"
  },
  {
    key: 3,
    employee: "翟懿博",
    endTime: "2017-09-27 11:40:12",
    flowId: "bizwork_svnDistribution__0000015EC0CF61AA1A5E3745334B7C1A",
    flowName: "SVN权限分配-朱庆广开通权限--bizwork-fe:/",
    group: "bizdev_kcfe",
    startTime: "2017-09-27 08:49:30",
    status: "已完结"
  },
  {
    key: 4,
    employee: "翟懿博",
    endTime: "2017-09-27 11:40:12",
    flowId: "bizwork_svnDistribution__0000015EC0CF61AA1A5E3745334B7C1A",
    flowName: "SVN权限分配-朱庆广开通权限--bizwork-fe:/",
    group: "bizdev_kcfe",
    startTime: "2017-09-27 08:49:30",
    status: "已完结"
  },
  {
    key: 5,
    employee: "翟懿博",
    endTime: "2017-09-27 11:40:12",
    flowId: "bizwork_svnDistribution__0000015EC0CF61AA1A5E3745334B7C1A",
    flowName: "SVN权限分配-朱庆广开通权限--bizwork-fe:/",
    group: "bizdev_kcfe",
    startTime: "2017-09-27 08:49:30",
    status: "已完结"
  }
];

class WorkflowTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 1
    }
  }

  pageSizeChange = () => {

  }

  pageNumberChange = (page) => {
    this.setState({
      current: page,
    });
  }

  render() {
    return (
      <Table
        style={{paddingTop: '20px'}}
        columns={columns}
        dataSource={data}
        pagination={{
          ...config.tablePagination,
          current: this.state.current,
          total: 200,
          onShowSizeChange: this.pageSizeChange,
          onChange: this.pageNumberChange
        }}
        bordered
      />
    );
  }
}

export default WorkflowTable;

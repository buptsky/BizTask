/*
 * table 表格显示组件
 * 组件的props
 * ①data 表格数据源 ②isLoading 表格过渡状态 ③total 表格条目总数 ④pageChange 表格分页信息变动的回调
 */
import {Table} from 'antd';
import config from './WorkflowConfig';

class WorkflowTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 1, // 当前页码
    }
  }
  // 每页显示数目改变
  pageSizeChange = (current, pageSize) => {
    this.props.pageChange({
      pageSize: pageSize.toString(),
      pageNo: current
    });
  }
  // 页码改变
  pageNumberChange = (page, pageSize) => {
    this.setState({
      current: page,
    });
    this.props.pageChange({
      pageSize: pageSize.toString(),
      pageNo: page
    });
  }

  render() {
    // table列表配置项,字段名与线上数据返回字段名一致
    const columns = [
      {
        title: '流程名称',
        dataIndex: 'flowName',
        key: 'flowName',
        render: (value, row) => {
          return (
            <a href="javascript:void(0)"
               style={{textDecoration: 'none'}}
               onClick={() => {this.props.operate(row.flowId)}}
            >{value}</a>
          );
        },
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
    // 由于react的要求，为每条表格数据添加key属性(使用flowId代替)
    const dataSource = this.props.data;
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item) => {
        item.key = item.flowId;
      })
    }

    return (
      <Table
        loading={this.props.isLoading}
        style={{paddingTop: '20px'}}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          ...config.tablePagination,
          current: this.state.current,
          total: this.props.total,
          onShowSizeChange: this.pageSizeChange,
          onChange: this.pageNumberChange
        }}
        bordered
      />
    );
  }
}

export default WorkflowTable;

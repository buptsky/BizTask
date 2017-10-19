import WorkflowMenu from './WorkflowMenu';
import WorkflowFilter from './WorkflowFilter';
import WorkflowTable from './WorkflowTable';
import WorkflowPanel from './WorkflowPanel';
import Panel from '../common/panel/panel';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreator} from '../../actions/action-creator';
import {getFlowData, getFlowDetailData, clearFlowDetailData, getRepositories} from '../../actions/workflow';
import {Layout, Menu, Icon, Button} from 'antd';

const {Sider, Content} = Layout;

@connect(
  state => ({
    tableLoading: state.workflow.flowLoading,
    dataSource: state.workflow.flowData,
    flowDetailData: state.workflow.flowDetailData,
    flowDetailLoading: state.workflow.flowDetailLoading
  }),
  dispatch => ({
    activeHeaderMenu: () => {
      dispatch(actionCreator('change_header_menu', 'workflow'));
    },
    getFlowData: bindActionCreators(getFlowData, dispatch),
    getFlowDetailData: bindActionCreators(getFlowDetailData, dispatch),
    clearFlowDetailData: bindActionCreators(clearFlowDetailData, dispatch),
    getRepositories: bindActionCreators(getRepositories, dispatch)
  })
)
class DailyWorksheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: 'pending-apply', // 申请类型tab栏
      showCreatePanel: false, // 控制流程面板显隐
      filterType: 'pending-apply', // 筛选组件类型
      flowTypes: [],
      isCreate: true // 是否为创建流程
    }
  }

  componentWillMount() {
    this.props.activeHeaderMenu();
    const flowTypes = [];
    // 获取所有流程
    fetchData({
      url: '/workflow/getFlowTypes.do',
      data: {}
    }).then((data) => {
      data.forEach((flowType) => {
        flowType['subFlowTypeList'].forEach((subFlowType) => {
          flowTypes.push(subFlowType);
        });
      });
      this.setState({
        flowTypes
      });
    });
  }

  componentDidMount() {
    this.props.activeHeaderMenu();
    this.props.getFlowData(); // 获取table数据
    this.props.getRepositories(); // 获取svn仓库数据
  }

  // 关闭创建流程面板
  closePanel = () => {
    // 清除flowdata
    this.setState({
      showCreatePanel: false,
      isCreate: true
    });
    this.props.clearFlowDetailData(); // 清空redux中相关数据
  }
  // 打开创建流程面板
  openPanel = () => {
    this.setState({
      showCreatePanel: true
    });
  }
  // 切换申请类型菜单
  switchMenu = (e) => {
    // 这里直接使用menu的key值是由于，key与filter组件接受的type类型是一一对应的
    let typeId = 0;
    switch (e.key) {
      case 'pending-apply':
        typeId = 1;
        break;
      case 'my-apply':
        typeId = 2;
        break;
      case 'all-apply':
        typeId = 3;
        break;
    }
    this.setState({
      filterType: e.key,
      currentMenu: e.key,
    });
    this.props.getFlowData({typeId: typeId});
  }
  // table分页变化
  tablePageChange = (args) => {
    this.props.getFlowData({
      ...args
    });
  }
  // filter筛选条件变化
  filterChange = (args) => {
    console.log(args);
    this.props.getFlowData(args);
  }
  // 查看/修改表格中的流程
  operateFlow = (id) => {
    this.setState({isCreate: false});
    this.props.getFlowDetailData(id); // 异步获取流程详情数据
    this.openPanel(); // 打开面板,使用了异步加载，打开面板后会有loading状态
  }

  render() {
    return (
      <Layout className="workflow">
        <Sider>
          <WorkflowMenu activeKey="daily-worksheet"/>
        </Sider>
        <Content style={{padding: '10px 20px', position: 'relative'}}>
          <Menu
            onClick={this.switchMenu}
            selectedKeys={[this.state.currentMenu]}
            mode="horizontal"
          >
            <Menu.Item key="pending-apply">
              <Icon type="hourglass"/>待处理的申请
            </Menu.Item>
            <Menu.Item key="my-apply">
              <Icon type="user"/>我的申请
            </Menu.Item>
            <Menu.Item key="all-apply">
              <Icon type="team"/>所有人的申请
            </Menu.Item>
          </Menu>
          <Button type="primary"
                  icon="plus"
                  style={{position: 'absolute', top: '20px', left: '475px', height: 28}}
                  onClick={this.openPanel}>新增申请
          </Button>
          <Panel
            visible={this.state.showCreatePanel}
            onCancel={this.closePanel}
            title={this.props.flowDetailData.flowTypeId ? '查看流程' : '创建流程'}
            footer={false}
            loading={this.state.isCreate ? false : this.props.flowDetailLoading}
          >
            <WorkflowPanel
              flowTypes={this.state.flowTypes}
              close={this.closePanel}
            />
          </Panel>
          <WorkflowFilter
            type={this.state.filterType}
            filterChange={this.filterChange}
            flowTypes={this.state.flowTypes}
          />
          <WorkflowTable
            pageChange={this.tablePageChange}
            data={this.props.dataSource.list}
            isLoading={this.props.tableLoading}
            total={this.props.dataSource.totalNumber}
            operate={this.operateFlow}
          />
        </Content>
      </Layout>
    );
  }
}

export default DailyWorksheet;

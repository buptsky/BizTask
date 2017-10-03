import WorkflowMenu from './WorkflowMenu';
import WorkflowFilter from './WorkflowFilter';
import WorkflowTable from './WorkflowTable';
import WorkflowCreate from './WorkflowCreate';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreator} from '../../actions/action-creator';
import {getTableData} from '../../actions/workflow';
import {Layout, Menu, Icon, Button} from 'antd';

const {Sider, Content} = Layout;

@connect(
  state => ({
    isLoading: state.workflow.isLoading,
    dataSource: state.workflow.tableData
  }),
  dispatch => ({
    activeHeaderMenu: ()=> {
      dispatch(actionCreator('change_header_menu', 'workflow'));
    },
    getTableData: bindActionCreators(getTableData, dispatch)
  })
)
class DailyWorksheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: 'pending-apply', // 申请类型tab栏
      showCreatePanel: false, // 控制流程面板显隐
      filterType: 'pending-apply' // 筛选组件类型
    }
  }

  componentDidMount() {
    this.props.activeHeaderMenu();
    this.props.getTableData(); // 获取table数据
  }
  // 关闭创建流程面板
  closePanel = () => {
    this.setState({
      showCreatePanel: false
    })
  }
  // 打开创建流程面板
  openPanel = () => {
    this.setState({
      showCreatePanel: true
    })
  }
  // 切换申请类型菜单
  switchMenu = (e) => {
    // 这里直接使用menu的key值是由于，key与filter组件接受的type类型是一一对应的
    let typeId = 0;
    console.log('click', e);
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
    this.props.getTableData({typeId: typeId});
  }
  // table分页变化
  tablePageChange = (args) => {
    this.props.getTableData({
      ...args
    });
  }
  // filter筛选条件变化
  filterChange = (args) => {
    console.log(args);
    this.props.getTableData(args);
  }

  render() {
    return (
      <Layout className="workflow">
        <Sider width={200} style={{ background: '#fff', borderRight: '2px solid #ccc' }}>
          <WorkflowMenu activeKey="daily-worksheet"/>
        </Sider>
        <Content style={{padding: '20px', position: 'relative', backgroundColor: '#fff'}}>
          <Menu
            onClick={this.switchMenu}
            selectedKeys={[this.state.currentMenu]}
            mode="horizontal"
          >
            <Menu.Item key="pending-apply">
              <Icon type="hourglass" />待处理的申请
            </Menu.Item>
            <Menu.Item key="my-apply">
              <Icon type="user" />我的申请
            </Menu.Item>
            <Menu.Item key="all-apply">
              <Icon type="team" />所有人的申请
            </Menu.Item>
          </Menu>
          <Button type="primary" icon="plus" style={{position: 'absolute', top: '30px', left: '475px'}} onClick={this.openPanel}>新增申请</Button>
          {
            this.state.showCreatePanel ?
              <WorkflowCreate close={this.closePanel}/>
              : ''
          }
          <WorkflowFilter
            type={this.state.filterType}
            filterChange={this.filterChange}
          />
          <WorkflowTable
            pageChange={this.tablePageChange}
            data={this.props.dataSource.list}
            isLoading={this.props.isLoading}
            total={this.props.dataSource.totalNumber}
          />
        </Content>
      </Layout>
    );
  }
}
export default DailyWorksheet;

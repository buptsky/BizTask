import {Layout, Menu, Icon, Button} from 'antd';
const {Sider, Content} = Layout;
import WorkflowMenu from './WorkflowMenu';
import WorkflowFilter from './WorkflowFilter';
import WorkflowTable from './WorkflowTable';
import WorkflowCreate from './WorkflowCreate';
import {connect} from 'react-redux';
import {actionCreator} from '../../actions/action-creator';

@connect(
  state => ({}),
  dispatch => ({
    activeHeaderMenu: ()=> {
      dispatch(actionCreator('change_header_menu', 'workflow'));
    }
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
    console.log(this.workFilter);
    // this.workFilter.collectArgs();
  }

  closePanel = () => { // 关闭创建流程面板
    this.setState({
      showCreatePanel: false
    })
  }

  openPanel = () => { // 打开创建流程面板
    this.setState({
      showCreatePanel: true
    })
  }
  // 切换申请类型菜单
  switchMenu = (e) => {
    // 这里直接使用menu的key值是由于，key与filter组件接受的type类型是一一对应的
    this.setState({filterType: e.key})
    console.log('click ', e);
    this.setState({
      currentMenu: e.key,
    });
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
          <WorkflowFilter type={this.state.filterType} ref={(filter) => {this.workFilter = filter;}}/>
          <WorkflowTable/>
        </Content>
      </Layout>
    );
  }
}
export default DailyWorksheet;

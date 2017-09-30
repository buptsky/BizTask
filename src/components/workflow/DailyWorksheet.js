import {Layout, Menu, Icon, Button} from 'antd';
const {Sider, Content} = Layout;
import WorkflowMenu from './WorkflowMenu';
import WorkflowFilter from './WorkflowFilter';
import WorkflowTable from './WorkflowTable';
import WorkflowCreate from './WorkflowCreate';
import {connect} from 'react-redux';
import {actionCreator} from '../../action-creator';

@connect(
  state => ({}),
  dispatch => ({
    activeHeaderMenu: ()=> {
      dispatch(actionCreator('change_header_menu', 'workflow.less'));
    }
  })
)
class DailyWorksheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'pending-apply', // 申请类型tab栏
      showCreatePanel: false
    }
  }

  componentDidMount() {
    this.props.activeHeaderMenu();
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

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
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
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
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
          <WorkflowFilter/>
          <WorkflowTable/>
        </Content>
      </Layout>
    );
  }
}
export default DailyWorksheet;

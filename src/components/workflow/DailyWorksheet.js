import {Layout, Menu, Icon, Button} from 'antd';
const {Sider, Content} = Layout;
import WorkflowMenu from './WorkflowMenu';
import WorkflowFilter from './WorkflowFilter';
import WorkflowTable from './WorkflowTable';
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
      current: 'pending-apply'
    }
  }

  componentDidMount() {
    this.props.activeHeaderMenu();
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <Layout>
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
          <Button type="primary" icon="plus" style={{position: 'absolute', top: '30px', left: '475px'}}>新增申请</Button>
          <WorkflowFilter/>
          <WorkflowTable/>
        </Content>
      </Layout>
    );
  }
}
export default DailyWorksheet;

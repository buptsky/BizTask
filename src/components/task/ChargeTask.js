import {actionCreator, actionTypes} from '../../action-creator';
import {Layout} from 'antd';
import {connect} from 'react-redux';
import TaskMenu from './TaskMenu';
import TaskContent from "./TaskContent";

const {Sider, Content} = Layout;

@connect(
  state => ({}),
  dispatch => ({
    activeHeaderMenu: () => {
      dispatch(actionCreator('change_header_menu', 'task'));
    }
  })
)
class Task extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.activeHeaderMenu();
  }

  render() {
    return (
      <Layout>
        <Sider>
          <TaskMenu activeKey="chargeTask"/>
        </Sider>
        <Content style={{padding: "20px"}}>
          <TaskContent/>
        </Content>
      </Layout>
    );
  }
}

export default Task;

import {actionCreator, actionTypes} from '../../action-creator';
import {Layout, Spin} from 'antd';
import {connect} from 'react-redux';
import TaskMenu from './TaskMenu';
import TaskList from './TaskList';

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
    this.state = {
      loading: true,
      dataSource: []
    };
  }

  componentDidMount() {
    this.props.activeHeaderMenu();
    this.getTasks();
  }

  getTasks = () => {
    const queryArgs = {
      userType: 0,  //我负责的任务0，我关注的任务1
      viewType: 0   //标签视图，将要废弃
    };
    fetchData({
      url: '/task/getTasks.do',
      data: queryArgs
    }).then((data) => {
      this.setState({
        loading: false,
        dataSource: data
      });
    });
  };
  renderTasks = (dataSource) => {
    return dataSource.map((taskList) => {
      return <TaskList key={taskList.name} name={taskList.name} dataSource={taskList.taskList}/>
    });
  };

  render() {
    const {loading, dataSource} = this.state;
    return (
      <Layout>
        <Sider>
          <TaskMenu activeKey="chargeTask"/>
        </Sider>
        <Content style={{padding: "20px"}}>
          {loading ? <Spin tip="Loading..."/> : this.renderTasks(dataSource)}
        </Content>
      </Layout>
    );
  }
}

export default Task;

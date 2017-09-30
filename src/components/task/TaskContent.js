import {Spin} from 'antd';
import TaskContainer from './TaskContainer';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class TaskContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: []
    };
  }

  componentDidMount() {
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
      return (
        <div key={taskList.name} className="task-list">
          <div className="task-list-title">
            {taskList.name}
          </div>
          <TaskContainer dataSource={taskList.taskList}/>
        </div>
        )
    });
  };

  render() {
    const {loading, dataSource} = this.state;
    return (
      <div>
        {loading ? <Spin tip="Loading..."/> : this.renderTasks(dataSource)}
      </div>
    );
  }
}

export default TaskContent;

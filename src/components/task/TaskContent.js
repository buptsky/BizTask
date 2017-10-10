import {Spin} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TaskContainer from './TaskContainer';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as TaskActions from '../../actions/task';

function mapStateToProps(state) {
  return {
    isLoading: state.task.isLoading,
    taskLists: state.task.taskLists
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TaskActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
class TaskContent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTasks({
      userType: 0,  //我负责的任务0，我关注的任务1
      viewType: 0   //标签视图，将要废弃
    });
  }

  renderTasks = (taskLists) => {
    const me = this;
    return taskLists.map((taskList) => {
      return (
        <div key={taskList.name} className="task-list">
          <div className="task-list-title">
            {taskList.name}
          </div>
          <TaskContainer
            moveTask={me.props.moveTask}
            x={taskList.name}
            dataSource={taskList.taskList}/>
        </div>
      )
    });
  };

  render() {
    const {isLoading, taskLists} = this.props;
    return (
      <div style={{display: 'flex', marginTop: '10px', flexGrow: 1}}>
        {isLoading ? <Spin tip="Loading..."/> : this.renderTasks(taskLists)}
      </div>
    );
  }
}

export default TaskContent;

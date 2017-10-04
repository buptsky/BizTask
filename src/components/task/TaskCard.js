import {Icon, Modal} from 'antd';
import {ItemTypes} from './Constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {TaskPanelTypes} from './Constants';
import {DragSource} from 'react-dnd';

const confirm = Modal.confirm;
import * as TaskActions from '../../actions/task';

const spec = {
  beginDrag(props, monitor, component) {
    return {
      taskId: props.taskInfo.taskId,
      x: props.x,
      y: props.y
    };
  },
  endDrag(props, monitor) {
    document.getElementById(monitor.getItem().taskId).style.display = 'block';
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TaskActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
@DragSource(ItemTypes.TASK_CARD, spec, collect)
class TaskCard extends React.Component {
  constructor(props) {
    super(props);
    this.toDeleteTask = {};
  }

  //render参与人
  renderMembers = (members) => {
    return members.map((member) => {
      return <label key={member.displayName} className="task-card-member">{member.displayName}</label>
    });
  };
  //点击"删除"按钮，弹出提示框
  showDeleteConfirm = (task) => {
    return (e) => {
      this.toDeleteTask = task;
      confirm({
        title: '删除任务',
        content: `确定要删除${task.taskName}吗?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteTask()
        }
      });
      e.stopPropagation();
    }
  };
  //确认删除，当前任务的x,y作为参数，前端缓存删除，不等请求响应
  deleteTask = () => {
    const {x, y} = this.props;
    const taskId = this.toDeleteTask.taskId;
    const delteArgs = {x, y, taskId};
    this.props.deleteTask(delteArgs);
  };
  //编辑任务
  editTask = (task) => {
    return (e) => {
      this.props.openTaskPanel({
        type: TaskPanelTypes.EDIT,
        taskId: task.taskId
      });
    }
  };

  render() {
    const {connectDragSource, taskInfo} = this.props;
    return connectDragSource(
      <div className="task-card" id={taskInfo.taskId} onClick={this.editTask(taskInfo)}>
        <div className="task-card-row">
          <span className="task-card-title">{taskInfo.taskName}</span>
          <Icon type="close" onClick={this.showDeleteConfirm(taskInfo)}/>
        </div>
        <div className="task-card-row mt5">
          <span className="task-card-time"><Icon type="clock-circle-o"/>{taskInfo.startTime}-{taskInfo.endTime}</span>
          <span className="task-card-members">
              {this.renderMembers(taskInfo.followUsers)}
          </span>
        </div>
      </div>
    );
  }
}

export default TaskCard;

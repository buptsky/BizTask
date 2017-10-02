import {Icon} from 'antd';
import {ItemTypes} from './Constants';
import {DragSource} from 'react-dnd';

const spec = {
  beginDrag(props,monitor,component) {
    return {
      taskId: props.taskInfo.taskId,
      x: props.x,
      y: props.y
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

@DragSource(ItemTypes.TASK_CARD, spec, collect)
class TaskCard extends React.Component {
  constructor(props) {
    super(props);
  }
  renderMembers = (members) => {
    return members.map((member) => {
      return <label key={member.displayName} className="task-card-member">{member.displayName}</label>
    });
  };

  render() {
    const {connectDragSource,isDragging,taskInfo} = this.props;
    return connectDragSource(
      <div className="task-card" id={taskInfo.taskId} style={{display:0.5}}>
        <div className="task-card-row">
          <span className="task-card-title">{taskInfo.taskName}</span>
          <Icon type="close"/>
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

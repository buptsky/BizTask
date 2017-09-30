import {Icon} from 'antd';

class TaskCard extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMembers = (members) => {
    return members.map((member) => {
      return <label key={member.displayName}>{member.displayName}</label>
    });
  };

  render() {
    const {taskInfo} = this.props;
    return (
      <div className="task-card">
        <div className="task-card-first-row">
          <span className="task-card-title">{taskInfo.taskName}</span>
          <Icon type="close"/>
        </div>
        <div className="task-card-second-row">
          <span className="task-card-time"><Icon type="clock-circle-o" />{taskInfo.startTime}-{taskInfo.endTime}</span>
          <span className="task-card-members">
              {this.renderMembers(taskInfo.followUsers)}
          </span>
        </div>
      </div>
    );
  }
}

export default TaskCard;

import TaskCard from './TaskCard';
class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }
  renderTaskCard = (dataSource) => {
    return dataSource.map((task)=>{
      return <TaskCard key={task.taskId} taskInfo={task}/>
    });
  };
  render() {
    const {name,dataSource} = this.props;
    return (
      <div className="task-list">
        <div className="task-list-title">
          {name}
        </div>
        <ul>
          {this.renderTaskCard(dataSource)}
        </ul>
      </div>
    );
  }
}

export default TaskList;

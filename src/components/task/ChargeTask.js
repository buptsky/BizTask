import {Button, Layout} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TaskMenu from './TaskMenu';
import TaskContent from './TaskContent';
import TaskPanel from './TaskPanel';
import {TaskPanelTypes} from './Constants';
import * as CommonActions from '../../actions/common';
import * as TaskActions from '../../actions/task';

const {Sider, Content} = Layout;

function mapStateToProps(state) {
  return {
    taskPanel: state.task.taskPanel
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    activeHeaderMenu: CommonActions.activeHeaderMenu,
    openTaskPanel: TaskActions.openTaskPanel,
    closeTaskPanel: TaskActions.closeTaskPanel
  }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Task extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.activeHeaderMenu('task');
  }

  newTask = () => {
    this.props.openTaskPanel({
      type: TaskPanelTypes.NEW
    });
  };
  closePanel = () => {
    this.props.closeTaskPanel();
  };

  render() {
    const {taskPanel} = this.props;
    return (
      <Layout>
        <Sider>
          <TaskMenu activeKey="chargeTask"/>
        </Sider>
        <Content style={{padding: "20px"}}>
          <Button type="primary" icon="plus" style={{}} onClick={this.newTask}>添加任务</Button>
          {
            taskPanel.isShow ?
              <TaskPanel
                title={taskPanel.title}
                close={this.closePanel}
                taskId={taskPanel.taskId}/>
              : ''
          }
          <TaskContent/>
        </Content>
      </Layout>
    );
  }
}

export default Task;

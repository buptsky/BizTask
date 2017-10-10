import {Button, Layout, Modal} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TaskMenu from './TaskMenu';
import TaskContent from './TaskContent';
import Panel from '../common/panel/panel';
import NewTask from './NewTask';
import EditTask  from './EditTask';
import * as CommonActions from '../../actions/common';
import * as TaskActions from '../../actions/task';

const {Sider, Content} = Layout;

function mapStateToProps(state) {
  return {
    newTask: state.task.newTask,
    editTask: state.task.editTask
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...CommonActions,
    ...TaskActions
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
    this.props.openNewTask();
  };

  render() {
    const {newTask, closeNewTask, editTask, closeEditTask} = this.props;
    return (
      <Layout>
        <Sider>
          <TaskMenu activeKey="chargeTask"/>
        </Sider>
        <Content style={{padding: "20px", display: "flex", flexDirection: "column"}}>
          <Button type="primary" icon="plus" style={{width: "110px"}} onClick={this.newTask}>添加任务</Button>
          <Modal
            title="创建任务"
            visible={newTask.isShow}
            onCancel={closeNewTask}
            footer={null}
            maskClosable={false}
          >
            <NewTask onCancel={closeNewTask}/>
          </Modal>
          <TaskContent/>
          <Panel
            visible={editTask.isShow}
            onCancel={closeEditTask}
            title="任务详情"
            footer={false}
          >
            <EditTask onCancel={closeEditTask}/>
          </Panel>
        </Content>
      </Layout>
    );
  }
}

export default Task;

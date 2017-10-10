import {Button, Layout, Modal} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TaskMenu from './TaskMenu';
import TaskContent from './TaskContent';
import TaskModal from './TaskModal';
import {TaskModalTypes} from './Constants';
import * as CommonActions from '../../actions/common';
import * as TaskActions from '../../actions/task';

const {Sider, Content} = Layout;

function mapStateToProps(state) {
  return {
    taskModal: state.task.taskModal
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    activeHeaderMenu: CommonActions.activeHeaderMenu,
    openTaskModal: TaskActions.openTaskModal,
    closeTaskModal: TaskActions.closeTaskModal
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
    this.props.openTaskModal({
      type: TaskModalTypes.NEW,
      taskId: undefined
    });
  };

  render() {
    const {taskModal, closeTaskModal} = this.props;
    return (
      <Layout>
        <Sider>
          <TaskMenu activeKey="chargeTask"/>
        </Sider>
        <Content style={{padding: "20px"}}>
          <Button type="primary" icon="plus" style={{}} onClick={this.newTask}>添加任务</Button>
          <Modal
            title={taskModal.title}
            visible={taskModal.isShow}
            onCancel={closeTaskModal}
            footer={null}
            maskClosable={false}
          >
            <TaskModal onCancel={closeTaskModal}/>
          </Modal>
          <TaskContent/>
        </Content>
      </Layout>
    );
  }
}

export default Task;

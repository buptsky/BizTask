import {Button, Layout, Modal} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TaskMenu from './TaskMenu';
import TaskContent from './TaskContent';
import TaskDetail from './TaskDetail';
import {TaskPanelTypes} from './Constants';
import * as CommonActions from '../../actions/common';
import * as TaskActions from '../../actions/task';

const {Sider, Content} = Layout;

function mapStateToProps(state) {
  return {
    taskDetail: state.task.taskDetail
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    activeHeaderMenu: CommonActions.activeHeaderMenu,
    openTaskDetail: TaskActions.openTaskDetail,
    closeTaskDetail: TaskActions.closeTaskDetail
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
    this.props.openTaskDetail({
      type: TaskPanelTypes.NEW
    });
  };
  closeDetail = () => {
    this.props.closeTaskDetail();
  };

  render() {
    const {taskDetail} = this.props;
    return (
      <Layout>
        <Sider>
          <TaskMenu activeKey="chargeTask"/>
        </Sider>
        <Content style={{padding: "20px"}}>
          <Button type="primary" icon="plus" style={{}} onClick={this.newTask}>添加任务</Button>
          <Modal
            title={taskDetail.title}
            visible={taskDetail.isShow}
            onCancel={this.closeDetail}
            footer={null}
            maskClosable={false}
          >
            <TaskDetail closeDetail={this.closeDetail}/>
          </Modal>
          <TaskContent/>
        </Content>
      </Layout>
    );
  }
}

export default Task;

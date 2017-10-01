import {actionCreator, actionTypes} from '../../actions/action-creator';
import {Layout} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import TaskMenu from './TaskMenu';
import TaskContent from './TaskContent';
import * as CommonActions from '../../actions/common';

const {Sider, Content} = Layout;

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(CommonActions, dispatch);
}
@connect(mapStateToProps,mapDispatchToProps)
class Task extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.activeHeaderMenu('task');
  }

  render() {
    return (
      <Layout>
        <Sider>
          <TaskMenu activeKey="chargeTask"/>
        </Sider>
        <Content style={{padding: "20px"}}>
          <TaskContent/>
        </Content>
      </Layout>
    );
  }
}

export default Task;

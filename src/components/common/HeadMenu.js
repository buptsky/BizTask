import {connect} from 'react-redux';
import {Menu} from 'antd';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as CommonActions from '../../actions/common';

function mapStateToProps(state) {
  return {
    activeKey: state.common.headerActiveKey
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CommonActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class HeadMenu extends React.Component {
  componentWillMount() {
    this.props.loadAllPerson();
  }

  render() {
    const {activeKey} = this.props;
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[activeKey]}
        style={{fontSize: '14px', lineHeight: '64px'}}
      >
        <Menu.Item key="workflow">
          <Link to="/workflow">待办流程</Link>
        </Menu.Item>
        <Menu.Item key="task">
          <Link to="/task/charge">任务</Link>
        </Menu.Item>
        <Menu.Item key="score">
          <Link to="/score">部门积分</Link>
        </Menu.Item>
      </Menu>
    )
  }
}
export default HeadMenu;
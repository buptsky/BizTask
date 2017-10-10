import {connect} from 'react-redux';
import {Layout, Menu, Popover, Icon, Avatar} from 'antd';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as CommonActions from '../../actions/common';

const {Header} = Layout;

function mapStateToProps(state) {
  return {
    activeKey: state.common.headerActiveKey,
    userInfo: state.common.commonData.userInfo
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CommonActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class BizTaskHeader extends React.Component {
  componentWillMount() {
    this.props.loadAllPerson();
    this.props.loadUserInfo();
  }

  renderUserInfo = (userInfo) => {
    return (
      <div style={{display:'flex'}}>
        <Avatar>{userInfo.userLastName}</Avatar>
        <div>
          
        </div>
      </div>
    );
  };

  render() {
    const {activeKey, userInfo} = this.props;
    return (
      <Header>
        <Link to="/" className="logo"/>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeKey]}
          style={{fontSize: '14px', lineHeight: '64px', width: '500px',float: 'left'}}
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
        {userInfo ? <Popover content={this.renderUserInfo(userInfo)}>
          <div className="fr" style={{color:'white'}}>
            {userInfo.userName}
            <Icon type="down" />
          </div>
        </Popover> : null}
      </Header>
    )
  }
}

export default BizTaskHeader;
import {connect} from 'react-redux';
import {Layout, Menu, Popover, Avatar, Icon, Tag, Row} from 'antd';
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

  renderUserName = (userInfo) => {
    return (
      <div className="fr" style={{color: 'white', height: '52px'}}>
        <Popover content={this.renderUserInfo(userInfo)} placement="bottomRight">
          <span style={{cursor: 'default'}}>{userInfo.userName}</span>
        </Popover>
        <span style={{margin: '0 5px'}}>|</span>
        <a href="/pc/index/logout" style={{color: 'white'}}>退出</a>
      </div>
    );
  };
  renderUserInfo = (userInfo) => {
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div className="user-photo">{userInfo.userLastName}</div>
        <div className="ml10">
          <Row className="mt5">
            <Tag color="green">{userInfo.level}</Tag>{userInfo.title}
          </Row>
          <Row className="mt5">
            <Icon type="team" className="mr10"/>{userInfo.group}
          </Row>
          <Row className="mt5">
            <Icon type="phone" className="mr10"/>{userInfo.telephone}
          </Row>
        </div>
      </div>
    );
  };

  render() {
    const {activeKey, userInfo} = this.props;
    console.log(activeKey);
    return (
      <Header>
        <Link to="/" className="logo"/>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeKey]}
          style={{fontSize: '14px', lineHeight: '64px', width: '500px', float: 'left'}}
        >
          <Menu.Item key="workflow">
            <Link to="/workflow">待办流程</Link>
          </Menu.Item>
          <Menu.Item key="task">
            <Link to="/task/charge">日常任务</Link>
          </Menu.Item>
          <Menu.Item key="score">
            <Link to="/score">部门积分</Link>
          </Menu.Item>
        </Menu>
        {userInfo ? this.renderUserName(userInfo) : null}
      </Header>
    )
  }
}

export default BizTaskHeader;
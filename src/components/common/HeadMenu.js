import {connect} from 'react-redux';
import {Menu} from 'antd';
import {Link} from 'react-router-dom';
function mapStateToProps(state) {
    return {
        activeKey: state.common.headerActiveKey
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}
@connect(mapStateToProps,mapDispatchToProps)
class HeadMenu extends React.Component {
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
;
export default HeadMenu;
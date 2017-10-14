import {Menu} from 'antd';
import {Link} from 'react-router-dom';
class WorkflowMenu extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {activeKey} = this.props;

    return (
      <Menu
        defaultSelectedKeys={[activeKey]}
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="daily-worksheet">
          <Link to="/workflow/daily">日常工作单</Link>
        </Menu.Item>
        <Menu.Item key="extension">
          可扩展tab页
        </Menu.Item>
      </Menu>
    );
  }
}
export default WorkflowMenu;

import {Menu} from 'antd';
import {Link} from 'react-router-dom';
import {TaskListTypes} from "./Constants";

class TaskMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {activeKey} = this.props;
    return (
      <Menu
        defaultSelectedKeys={[activeKey]}
        mode="inline"
        style={{ height: '100%' , borderRight:0}}
      >
        <Menu.Item key={TaskListTypes.CHARGE}>
          <Link to="/task/charge">我负责的任务</Link>
        </Menu.Item>
        <Menu.Item key={TaskListTypes.ATTENTION}>
          <Link to="/task/attention">我关注的任务</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
export default TaskMenu;

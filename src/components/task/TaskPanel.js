import Panel from '../common/panel/panel';

class TaskPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  // 关闭面板
  cancelPanel = () => {
    this.props.close();
  }
  render() {
    const {title} = this.props;
    return (
      <Panel cancel={this.cancelPanel}
             disableBtn={true}
             panelTitle={title}
      >
      </Panel>
    );
  }
}

export default TaskPanel;

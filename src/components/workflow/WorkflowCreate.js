import {Icon, Button} from 'antd';
import Panel from '../common/panel/panel';

class WorkflowCreate extends React.Component {
  constructor(props) {
    super(props);

  }

  createConfirm = () => {
    this.props.close();
    console.log('panel confirm');
  }

  createCancel = () => {
    this.props.close();
    console.log('panel cancel');
  }

  render() {
    return (
     <Panel cancel={this.createCancel} confirm={this.createConfirm} panelTitle="创建流程">

     </Panel>
    );
  }
}
export default WorkflowCreate;

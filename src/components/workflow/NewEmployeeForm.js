import NewEmployeeStep1 from './NewEmployeeStep1';
import NewEmployeeStep2 from './NewEmployeeStep2';
import NewEmployeeStep3 from './NewEmployeeStep3';
import {connect} from 'react-redux';
// antd 组件配置

@connect(
  state => ({
    flowDetailData: state.workflow.flowDetailData
  }),
  dispatch => ({})
)
class NewEmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    console.log(this.props.flowDetailData);
  }

  render() {
    let data = this.props.flowDetailData;
    let employeeForm = '';
    if (data.formData) {
      switch (data.formData.step) {
        case 1:
          employeeForm = (<NewEmployeeStep1 getMsg={this.props.getMsg}/>);
          break;
        case 2:
          employeeForm = (<NewEmployeeStep2/>);
          break;
        case 3:
          employeeForm = (<NewEmployeeStep3 getMsg={this.props.getMsg}/>);
          break;
        default:
      }
    }

    return (
      <div>
        {employeeForm}
      </div>
    );
  }
}

export default NewEmployeeForm;
